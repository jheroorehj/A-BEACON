/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { INITIAL_ARTISTS, INITIAL_ARTWORKS } from "./src/data";
import { Artist, Artwork, UserInquiry, ChatMessage } from "./src/types";

/** JSON 문자열을 안전하게 파싱. 실패 시 fallback을 반환 */
function safeJsonParse<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

// Load environment variables
dotenv.config();

// ─── 파일 기반 데이터 영속성 ──────────────────────────────────────────────────
// 서버 재시작 시 데이터 유지를 위해 _server_data.json에 저장

const DATA_FILE = path.join(process.cwd(), "_server_data.json");

interface PersistedStore {
  artists: Artist[];
  artworks: Artwork[];
  inquiries: UserInquiry[];
  chatMessages: ChatMessage[];
}

function loadPersistedData(): PersistedStore | null {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const data = JSON.parse(raw) as PersistedStore;
      console.log(`[Data] 저장된 데이터 로드 완료 — artists:${data.artists?.length ?? 0}, artworks:${data.artworks?.length ?? 0}, inquiries:${data.inquiries?.length ?? 0}, messages:${data.chatMessages?.length ?? 0}`);
      return data;
    }
  } catch (e) {
    console.warn("[Data] 저장 파일 로드 실패, 시드 데이터로 초기화합니다:", e);
  }
  return null;
}

function saveData(): void {
  const payload: PersistedStore = { artists, artworks, inquiries, chatMessages };
  fs.writeFile(DATA_FILE, JSON.stringify(payload, null, 2), "utf-8", (err) => {
    if (err) console.error("[Data] 저장 실패:", err);
  });
}

// 시작 시 파일에서 복원, 없으면 시드 데이터 사용
const persisted = loadPersistedData();
let artists: Artist[] = persisted?.artists?.length ? persisted.artists : [...INITIAL_ARTISTS];
let artworks: Artwork[] = persisted?.artworks?.length ? persisted.artworks : [...INITIAL_ARTWORKS];
let inquiries: UserInquiry[] = persisted?.inquiries ?? [];
let chatMessages: ChatMessage[] = persisted?.chatMessages ?? [];

// Lazy-initialized Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Fallback search algorithm if GEMINI_API_KEY is not defined
function localRuleBasedSearch(query: string) {
  const normQuery = query.toLowerCase().trim();
  const matchedTags: string[] = [];

  // Simple key terms extraction
  const terms = [
    { key: "따뜻한", tags: ["따뜻한", "분홍", "노을", "크림색"] },
    { key: "차분한", tags: ["차분한", "고요한", "정적인", "수채느낌"] },
    { key: "바다", tags: ["바다", "물성", "풍경화"] },
    { key: "풍경", tags: ["풍경화", "풍경", "자연산", "아침안개"] },
    { key: "기하학", tags: ["기하학", "철조", "미니멀", "구조적"] },
    { key: "미니멀", tags: ["미니멀", "무채색", "정적선"] },
    { key: "몽환", tags: ["몽환적인", "빛의번짐", "장노출", "도시야경"] },
    { key: "공예", tags: ["공예", "도예", "오브제", "대지의질감", "소박한"] },
    { key: "디지털", tags: ["디지털", "알고리즘", "네온", "형형색색"] },
    { key: "네온", tags: ["네온사인", "네온", "형형색색"] },
  ];

  for (const item of terms) {
    if (normQuery.includes(item.key)) {
      matchedTags.push(...item.tags);
    }
  }

  // Deduplicate tags
  const tags = Array.from(new Set(matchedTags));
  if (tags.length === 0) {
    // default tags if nothing matched
    tags.push("풍경화", "고요한", "추상");
  }

  // Calculate matching scores for all artworks
  type MatchScore = { id: string; score: number; reason: string };
  const matches: MatchScore[] = artworks.map((art) => {
    let score = 0;
    const reasons: string[] = [];

    // Tag matching (highest priority)
    const matchingTags = art.tags.filter((t) => tags.includes(t));
    if (matchingTags.length > 0) {
      score += matchingTags.length * 4;
      reasons.push(`작품의 키워드 [${matchingTags.join(", ")}]가 검색 요청과 어울립니다.`);
    }

    // Text search in title and description
    if (art.title.toLowerCase().includes(normQuery)) {
      score += 10;
      reasons.push("작품 제목에 검색 단어가 직접 포함되어 있습니다.");
    }

    const descMatches = [
      { word: "따뜻", desc: "따뜻하고 온화한 분위기" },
      { word: "차분", desc: "차분하고 고요한 휴식의 감각" },
      { word: "바다", desc: "푸르른 바다의 심상" },
      { word: "고요", desc: "고요와 침묵 속 치유의 힘" },
      { word: "공예", desc: "소박한 공예품 특유의 소담한 미학" },
      { word: "디지털", desc: "스스로 증식하는 디지털적 현대성" },
      { word: "기하", desc: "구조적이고 정밀한 기하학적 그리드" },
    ];

    for (const dm of descMatches) {
      if (normQuery.includes(dm.word) && art.description.includes(dm.word)) {
        score += 3;
        reasons.push(dm.desc);
      }
    }

    // Category check as fallback
    if (normQuery.includes("그림") || normQuery.includes("회화") || normQuery.includes("페인팅")) {
      if (art.category === "Painting") {
        score += 2;
        reasons.push("요청하신 회화(페인팅) 매체를 최우선 추천합니다.");
      }
    }
    if (normQuery.includes("조소") || normQuery.includes("조식") || normQuery.includes("조각")) {
      if (art.category === "Sculpture") {
        score += 2;
        reasons.push("요청하신 3차원 조각/조소 입체를 최우선 추천합니다.");
      }
    }
    if (normQuery.includes("사진") || normQuery.includes("포토")) {
      if (art.category === "Photography") {
        score += 2;
        reasons.push("요청하신 시각적 서정성이 가득한 파인아트 사진 작품을 우선 매칭합니다.");
      }
    }
    if (normQuery.includes("디지털") || normQuery.includes("미디어") || normQuery.includes("컴퓨터")) {
      if (art.category === "Media Art") {
        score += 2;
        reasons.push("요청하신 생동하는 뉴미디어 아트 장르와 부합합니다.");
      }
    }
    if (normQuery.includes("그릇") || normQuery.includes("도자기") || normQuery.includes("공예")) {
      if (art.category === "Craft") {
        score += 2;
        reasons.push("대지의 따뜻한 감각이 담긴 수제 공예 매칭입니다.");
      }
    }

    const fallbackReason = reasons.length > 0 
      ? reasons.join(" ") 
      : "작품이 지닌 독창적이고 편안한 슬레이트 풍의 감각이 감상 환경에 어울립니다.";

    return {
      id: art.id,
      score,
      reason: fallbackReason,
    };
  });

  // Sort and filter only those with scores > 0 (or top 3 if zero matches)
  let sortedMatches = matches.sort((a, b) => b.score - a.score);
  const matchedArtworkIds = sortedMatches
    .filter((m) => m.score > 0)
    .map((m) => m.id);

  const finalMatchedIds = matchedArtworkIds.length > 0 
    ? matchedArtworkIds 
    : sortedMatches.slice(0, 3).map((m) => m.id);

  const explanations: { [artworkId: string]: string } = {};
  for (const m of sortedMatches) {
    if (finalMatchedIds.includes(m.id)) {
      explanations[m.id] = m.reason;
    }
  }

  return {
    tags,
    matchedArtworkIds: finalMatchedIds,
    explanations,
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // CORS - 개발 환경에서 프론트엔드가 다른 포트로 실행될 경우를 위한 허용 헤더
  app.use((req, res, next) => {
    const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "http://localhost:5173,http://localhost:3000").split(",");
    const origin = req.headers.origin ?? "";
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
      res.setHeader("Access-Control-Allow-Origin", origin || "*");
      res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    }
    if (req.method === "OPTIONS") {
      return res.sendStatus(204);
    }
    next();
  });

  // API Route - Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Route - Get all artworks
  app.get("/api/artworks", (req, res) => {
    res.json(artworks);
  });

  // API Route - Get artwork by ID
  app.get("/api/artworks/:id", (req, res) => {
    const art = artworks.find((a) => a.id === req.params.id);
    if (!art) {
      return res.status(404).json({ error: "Artwork not found" });
    }
    res.json(art);
  });

  // API Route - Add new artwork
  app.post("/api/artworks", (req, res) => {
    const { title, artistId, artistName, image, description, category, tags, year, medium, dimensions, priceRange } = req.body;
    if (!title || !artistId || !artistName || !image) {
      return res.status(400).json({ error: "Missing required artwork fields" });
    }

    const newArtwork: Artwork = {
      id: `art_user_${Date.now()}`,
      title,
      artistId,
      artistName,
      image,
      description: description || "작가의 특별한 작가 노트와 설명이 준비 중입니다.",
      category: category || "Painting",
      tags: tags && Array.isArray(tags) ? tags : ["기타"],
      year: year || new Date().getFullYear(),
      medium: medium || "Mixed Media",
      dimensions: dimensions || "가변 크기",
      priceRange: priceRange || "가격 문의",
    };

    artworks.unshift(newArtwork); // Place newly uploaded items first!
    saveData();
    res.status(201).json(newArtwork);
  });

  // API Route - Delete artwork
  app.delete("/api/artworks/:id", (req, res) => {
    const initialLength = artworks.length;
    artworks = artworks.filter((art) => art.id !== req.params.id);
    if (artworks.length === initialLength) {
      return res.status(404).json({ error: "Artwork not found" });
    }
    saveData();
    res.json({ success: true, message: "Artwork deleted successfully" });
  });

  // API Route - Update artwork details
  app.put("/api/artworks/:id", (req, res) => {
    const index = artworks.findIndex((art) => art.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Artwork not found" });
    }
    artworks[index] = { ...artworks[index], ...req.body };
    saveData();
    res.json(artworks[index]);
  });

  // API Route - List artists
  app.get("/api/artists", (req, res) => {
    res.json(artists);
  });

  // API Route - Get artist profile by ID or create empty placeholder if new
  app.get("/api/artists/:id", (req, res) => {
    let artist = artists.find((a) => a.id === req.params.id);
    if (!artist) {
      // Create empty placeholder if it's a first-time login of a new artist
      artist = {
        id: req.params.id,
        name: "작가",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        bio: "새로 가입한 작가입니다. 프로필을 채워 나를 소개해보세요.",
        keywords: ["열정", "독창적"],
        interviewQuestions: [
          {
            question: "왜 작업을 시작하게 되었나요?",
            answer: "세상에 나만의 예술적 지표를 심어 다른 사람들과 소통하기 위해서입니다."
          }
        ],
        email: "artist_contact@artspatform.com",
      };
      artists.push(artist);
      saveData();
    }
    res.json(artist);
  });

  // API Route - Update artist profile
  app.put("/api/artists/:id", (req, res) => {
    const index = artists.findIndex((a) => a.id === req.params.id);
    if (index === -1) {
      const newArtist: Artist = {
        id: req.params.id,
        name: req.body.name || "신무명작가",
        avatar: req.body.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        bio: req.body.bio || "",
        keywords: req.body.keywords || [],
        interviewQuestions: req.body.interviewQuestions || [],
        email: req.body.email || "artist@artsplatform.com",
      };
      artists.push(newArtist);
      saveData();
      return res.json(newArtist);
    }
    artists[index] = { ...artists[index], ...req.body };
    saveData();
    res.json(artists[index]);
  });

  // API Route - Register/Get Buyer Inquiries
  app.post("/api/inquiries", (req, res) => {
    const { artworkId, artworkTitle, artworkImage, artistId, artistName, buyerName, buyerEmail, message } = req.body;
    if (!artworkId || !artistId || !buyerName || !buyerEmail || !message) {
      return res.status(400).json({ error: "Missing required inquiry fields" });
    }

    const inquiryId = `inquiry_${Date.now()}`;
    const newInquiry: UserInquiry = {
      id: inquiryId,
      artworkId,
      artworkTitle: artworkTitle || "무제 작품",
      artworkImage: artworkImage || "",
      artistId,
      artistName: artistName || "작가",
      buyerName,
      buyerEmail,
      message,
      status: "문의중",
      createdAt: new Date().toISOString(),
    };

    inquiries.push(newInquiry);

    // 첫 메시지로 문의 내용을 채팅 메시지로 등록
    const initMsg: ChatMessage = {
      id: `msg_${Date.now()}_init`,
      inquiryId,
      senderEmail: buyerEmail,
      senderName: buyerName,
      senderRole: "buyer",
      content: message,
      sentAt: new Date().toISOString(),
    };
    chatMessages.push(initMsg);
    saveData();

    res.status(201).json(newInquiry);
  });

  // API Route - Update inquiry status
  app.put("/api/inquiries/:id/status", (req, res) => {
    const { status } = req.body;
    const index = inquiries.findIndex((i) => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Inquiry not found" });
    inquiries[index] = { ...inquiries[index], status };

    // 상태 변경 시스템 메시지 자동 생성
    const statusLabels: Record<string, string> = {
      거래중: "거래가 시작되었습니다. 작가와 자유롭게 소통해 보세요.",
      거래완료: "거래가 완료되었습니다. 감사합니다!",
      취소: "거래가 취소되었습니다.",
    };
    const label = statusLabels[status];
    if (label) {
      chatMessages.push({
        id: `msg_sys_${Date.now()}`,
        inquiryId: req.params.id,
        senderEmail: "system",
        senderName: "시스템",
        senderRole: "system",
        content: label,
        sentAt: new Date().toISOString(),
        messageType: "system",
      });
    }

    saveData();
    res.json(inquiries[index]);
  });

  // API Route - Get chat rooms (filtered inquiries) for a user
  app.get("/api/chat/rooms", (req, res) => {
    const { buyerEmail, artistId } = req.query as { buyerEmail?: string; artistId?: string };
    const filtered = inquiries.filter((inq) => {
      if (buyerEmail && inq.buyerEmail === buyerEmail) return true;
      if (artistId && inq.artistId === artistId) return true;
      return false;
    });

    // Enrich each room with last message info
    const enriched = filtered.map((room) => {
      const roomMsgs = chatMessages
        .filter((m) => m.inquiryId === room.id)
        .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
      const lastMsg = roomMsgs[0];
      return {
        ...room,
        lastMessage: lastMsg?.content,
        lastMessageAt: lastMsg?.sentAt,
      };
    });

    // Sort by most recently active
    enriched.sort((a, b) => {
      const aTime = new Date(a.lastMessageAt ?? a.createdAt).getTime();
      const bTime = new Date(b.lastMessageAt ?? b.createdAt).getTime();
      return bTime - aTime;
    });

    res.json(enriched);
  });

  // API Route - Get messages for a chat room
  app.get("/api/chat/:inquiryId/messages", (req, res) => {
    const msgs = chatMessages
      .filter((m) => m.inquiryId === req.params.inquiryId)
      .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
    res.json(msgs);
  });

  // API Route - Send a chat message
  app.post("/api/chat/:inquiryId/messages", (req, res) => {
    const { senderEmail, senderName, senderRole, content } = req.body;
    if (!senderEmail || !content) {
      return res.status(400).json({ error: "Missing required message fields" });
    }
    const msg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      inquiryId: req.params.inquiryId,
      senderEmail,
      senderName,
      senderRole: senderRole || "buyer",
      content,
      sentAt: new Date().toISOString(),
    };
    chatMessages.push(msg);
    saveData();
    res.status(201).json(msg);
  });

  app.get("/api/inquiries", (req, res) => {
    const { artistId } = req.query;
    if (artistId) {
      const filtered = inquiries.filter((inq) => inq.artistId === artistId);
      return res.json(filtered);
    }
    res.json(inquiries);
  });

  // API Route: Admin Statistics
  app.get("/api/admin/stats", (req, res) => {
    const categoryCounts = {
      Painting: artworks.filter((a) => a.category === "Painting").length,
      Sculpture: artworks.filter((a) => a.category === "Sculpture").length,
      Photography: artworks.filter((a) => a.category === "Photography").length,
      "Media Art": artworks.filter((a) => a.category === "Media Art").length,
      Craft: artworks.filter((a) => a.category === "Craft").length,
    };
    res.json({
      totalArtworks: artworks.length,
      totalArtists: artists.length,
      totalInquiries: inquiries.length,
      categoryCounts,
    });
  });

  // API Route: AI Natural Language Art Search
  app.post("/api/search", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return res.status(400).json({ error: "검색 질의가 제공되지 않았습니다." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback if no Gemini Key is loaded
      console.log("No GEMINI_API_KEY. Using local rule-based matched search.");
      const matches = localRuleBasedSearch(prompt);
      return res.json({ ...matches, isMocked: true });
    }

    try {
      console.log(`Analyzing art discovery prompt: "${prompt}" via gemini-3.5-flash`);

      // Prepare database resume to feed Gemini context
      const artworksContext = artworks.map((art) => ({
        id: art.id,
        title: art.title,
        artistName: art.artistName,
        category: art.category,
        tags: art.tags,
        description: art.description.slice(0, 150), // keep tokens small
      }));

      const systemInstruction = `You are a professional fine art curator assistant for A-BEACON, a premium fine art platform representing emerging artists as their guiding beacon.
Analyze the buyer's natural language request (written in Korean/English) that describes what artwork they desire (their mood, colors, places, emotions, styles).

Your tasks:
1. Extract 3-5 concise, modern Korean tags (such as '따뜻한', '고요한', '기하학', '초현실', '빛의번짐') representative of the user's emotional and physical description.
2. Carefully look at our active artwork collection listed below, select up to 5 best matched artworks, and rank them.
3. For each selected matched artwork, draft a highly compelling 1-2 sentence curators' choice explanation (in elegant Korean) detailing *exactly* why this specific piece is an exquisite match for their described space or mood.

Our Artwork Database:
${JSON.stringify(artworksContext, null, 2)}

You MUST strictly output a JSON object adhering exactly to this TypeScript schema:
{
  "tags": string[], // Extracted tags from user text
  "matchedArtworkIds": string[], // Ranked list of artwork IDs that match
  "explanations": { [key: string]: string } // Map of artworkId -> Korean curator matching description
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `사용자의 작품 희망 묘사: "${prompt}"\n\n위 묘사를 근거로 큐레이팅 된 매칭 작품들의 ID 리스트와 그 큐레이션 해설을 JSON 스키마로 작성해 주세요.`,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "추출된 작품 관련 핵심 감상 태그들",
              },
              matchedArtworkIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "가장 잘 어울리는 작품 ID들의 순위 리스트",
              },
              explanations: {
                type: Type.OBJECT,
                description: "각 작품 ID별로 사용자의 검색 묘사 및 무드에 어울리는 구체적인 한국어 큐레이션 매칭 설명",
              }
            },
            required: ["tags", "matchedArtworkIds", "explanations"],
          },
        },
      });

      const responseText = response.text ? response.text.trim() : "";
      console.log("Raw Response from Gemini Search Curation:", responseText);
      const searchResult = safeJsonParse<{
        tags?: string[];
        matchedArtworkIds?: string[];
        explanations?: Record<string, string>;
      }>(responseText, {});

      res.json({
        tags: searchResult.tags || [],
        matchedArtworkIds: searchResult.matchedArtworkIds || [],
        explanations: searchResult.explanations || {},
        isMocked: false,
      });

    } catch (err: any) {
      console.error("Gemini AI Search API failed:", err);
      // Fallback
      const matches = localRuleBasedSearch(prompt);
      res.json({ ...matches, isMocked: true, error: err.message });
    }
  });

  // API Route: AI Auto-tag generation for artists when uploading an artwork
  app.post("/api/ai-autotag", async (req, res) => {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: "작품 제목이 필요합니다." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback rule based
      const defaultTags = ["도예", "회화", "풍경", "인테리어", "현대미술", "인기작"].slice(0, 4);
      return res.json({ tags: defaultTags, isMocked: true });
    }

    try {
      console.log(`Generating AI Tags for: "${title}" via gemini-3.5-flash`);

      const systemInstruction = `You are a meta-tagging engine for fine art pieces.
Analyze the artwork title and author's description and generate 4-6 highly aesthetic, precise Korean keyword tags (such as '따뜻한', '고요한', '내출럴', '몽환적인', '추상', '기하학'). Do not include empty tags or generic terms like '예술' or '작품'.

Output your response strictly as a JSON object of this structure:
{
  "tags": string[]
}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `제목: "${title}"\n설명: "${description || "설명 없음"}"\n\n위 작품에 어울리는 어울리는 핵심 태그 4-6개를 출력하세요.`,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ["tags"],
          },
        },
      });

      const tagsRes = safeJsonParse<{ tags?: string[] }>(response.text ? response.text.trim() : "", { tags: [] });
      res.json({ tags: tagsRes.tags || [], isMocked: false });
    } catch (e: any) {
      console.error("AutoTag API Error:", e);
      res.json({ tags: ["회화", "풍경", "따뜻한", "미니멀"], isMocked: true });
    }
  });

  // ─── Iamhero AI 연동 ──────────────────────────────────────────────────────
  // Flask 서버 URL (Iamhero). 환경변수로 재정의 가능.
  const FLASK_URL = process.env.FLASK_URL ?? "http://localhost:5000";

  /**
   * Flask /api/sync 에 현재 작품 목록을 전송해 벡터 DB를 동기화.
   * Flask가 꺼져 있으면 조용히 실패 (기능 열화만 발생).
   */
  async function syncArtworksToFlask(): Promise<void> {
    try {
      const payload = artworks.map((a) => ({
        ab_id: a.id,
        title: a.title,
        description: a.description,
        imageUrl: a.image,
      }));
      const res = await fetch(`${FLASK_URL}/api/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(60_000), // 최대 60초 (벡터화 시간 고려)
      });
      if (res.ok) {
        const result = await res.json() as { synced: number; skipped: number };
        console.log(`[AI Sync] Flask 동기화 완료 — synced:${result.synced}, skipped:${result.skipped}`);
      } else {
        console.warn("[AI Sync] Flask 응답 오류:", res.status);
      }
    } catch (e) {
      console.warn("[AI Sync] Flask 서버에 연결할 수 없습니다. 방 사진 AI 기능이 비활성화됩니다.");
    }
  }

  // 서버 시작 후 비동기로 동기화 (시작 속도에 영향 없음)
  syncArtworksToFlask();

  /**
   * POST /api/room-match
   * 방 사진 + 기분 텍스트로 Iamhero AI 추천을 받아 a-beacon 형식으로 반환.
   * Body: { userText: string, roomImageBase64: string }
   * Response: { matchedArtworkIds, explanations, scores, isMocked }
   */
  app.post("/api/room-match", async (req, res) => {
    const { userText, roomImageBase64 } = req.body as { userText?: string; roomImageBase64?: string };

    if (!userText || !roomImageBase64) {
      return res.status(400).json({ error: "userText와 roomImageBase64가 필요합니다." });
    }

    try {
      const flaskRes = await fetch(`${FLASK_URL}/api/recommend-json`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userText, roomImageBase64 }),
        signal: AbortSignal.timeout(60_000),
      });

      if (!flaskRes.ok) {
        const errText = await flaskRes.text();
        console.error("[Room Match] Flask 오류:", errText);
        return res.status(502).json({ error: "AI 추천 서버 오류", isMocked: true });
      }

      const flaskData = await flaskRes.json() as {
        matchedArtworkIds: string[];
        explanations: Record<string, string>;
        scores: Record<string, number>;
      };

      // ab_id → Artwork 매핑으로 tags 추출 (매칭된 작품의 태그를 통합)
      const tags: string[] = [];
      for (const abId of flaskData.matchedArtworkIds) {
        const artwork = artworks.find((a) => a.id === abId);
        if (artwork?.tags) {
          for (const t of artwork.tags) {
            if (!tags.includes(t)) tags.push(t);
          }
        }
      }

      res.json({
        tags: tags.slice(0, 6),
        matchedArtworkIds: flaskData.matchedArtworkIds,
        explanations: flaskData.explanations,
        scores: flaskData.scores,
        isMocked: false,
      });
    } catch (e) {
      console.error("[Room Match] 오류:", e);
      res.status(503).json({ error: "AI 서버에 연결할 수 없습니다.", isMocked: true });
    }
  });

  // Serve static files / Vite HMR routing
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[A-BEACON Full-Stack Server] booted successfully and listening on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start full-stack A-BEACON server:", error);
});
