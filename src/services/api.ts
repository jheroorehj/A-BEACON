/**
 * A-BEACON API Service Layer
 *
 * 백엔드 연결을 위한 중앙화된 API 클라이언트.
 * 실제 백엔드 도입 시 BASE_URL과 getAuthHeaders만 수정하면 된다.
 */

import type { Artwork, Artist, UserInquiry, AISearchResult, AdminStats, ChatMessage, TradeStatus, EstimateData } from "../types";

// ─── 설정 ─────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

function getAuthHeaders(): Record<string, string> {
  try {
    const raw = localStorage.getItem("beacon_session");
    if (!raw) return {};
    const session = JSON.parse(raw) as { uid?: string };
    return session?.uid ? { Authorization: `Bearer ${session.uid}` } : {};
  } catch {
    return {};
  }
}

// ─── 공통 fetch 래퍼 ────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
    ...(init.headers as Record<string, string> | undefined),
  };

  const res = await fetch(url, { ...init, headers });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body?.error ?? message;
    } catch {
      // ignore
    }
    throw new ApiError(res.status, message);
  }

  return res.json() as Promise<T>;
}

// ─── Artworks ────────────────────────────────────────────────────────────────

export const artworksApi = {
  list(): Promise<Artwork[]> {
    return request<Artwork[]>("/api/artworks");
  },
  get(id: string): Promise<Artwork> {
    return request<Artwork>(`/api/artworks/${id}`);
  },
  create(payload: Omit<Artwork, "id">): Promise<Artwork> {
    return request<Artwork>("/api/artworks", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  update(id: string, patch: Partial<Artwork>): Promise<Artwork> {
    return request<Artwork>(`/api/artworks/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    });
  },
  remove(id: string): Promise<{ success: boolean; message: string }> {
    return request(`/api/artworks/${id}`, { method: "DELETE" });
  },
};

// ─── Artists ─────────────────────────────────────────────────────────────────

export const artistsApi = {
  list(): Promise<Artist[]> {
    return request<Artist[]>("/api/artists");
  },
  get(id: string): Promise<Artist> {
    return request<Artist>(`/api/artists/${id}`);
  },
  update(id: string, patch: Partial<Artist>): Promise<Artist> {
    return request<Artist>(`/api/artists/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    });
  },
};

// ─── Inquiries ───────────────────────────────────────────────────────────────

export interface CreateInquiryPayload {
  artworkId: string;
  artworkTitle: string;
  artworkImage?: string;
  artistId: string;
  artistName: string;
  buyerName: string;
  buyerEmail: string;
  message: string;
}

export const inquiriesApi = {
  create(payload: CreateInquiryPayload): Promise<UserInquiry> {
    return request<UserInquiry>("/api/inquiries", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  listByArtist(artistId: string): Promise<UserInquiry[]> {
    return request<UserInquiry[]>(`/api/inquiries?artistId=${encodeURIComponent(artistId)}`);
  },
  updateStatus(id: string, status: TradeStatus): Promise<UserInquiry> {
    return request<UserInquiry>(`/api/inquiries/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },
  /** 관리자 전용: 전체 문의 조회 */
  listAll(): Promise<UserInquiry[]> {
    return request<UserInquiry[]>("/api/inquiries");
  },
};

// ─── Chat ─────────────────────────────────────────────────────────────────────

export interface SendMessagePayload {
  senderEmail: string;
  senderName: string;
  senderRole: "artist" | "buyer";
  content: string;
  messageType?: "text" | "estimate";
  estimate?: EstimateData;
}

export const chatApi = {
  /** 내가 참여한 채팅방(문의) 목록 */
  getRooms(buyerEmail?: string, artistId?: string): Promise<UserInquiry[]> {
    const params = new URLSearchParams();
    if (buyerEmail) params.set("buyerEmail", buyerEmail);
    if (artistId) params.set("artistId", artistId);
    return request<UserInquiry[]>(`/api/chat/rooms?${params.toString()}`);
  },
  /** 특정 채팅방의 메시지 목록 */
  getMessages(inquiryId: string): Promise<ChatMessage[]> {
    return request<ChatMessage[]>(`/api/chat/${inquiryId}/messages`);
  },
  /** 메시지 전송 */
  sendMessage(inquiryId: string, payload: SendMessagePayload): Promise<ChatMessage> {
    return request<ChatMessage>(`/api/chat/${inquiryId}/messages`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  /** 견적서 수락 / 거절 (컬렉터 전용) */
  respondEstimate(inquiryId: string, msgId: string, response: "accepted" | "rejected"): Promise<ChatMessage> {
    return request<ChatMessage>(`/api/chat/${inquiryId}/messages/${msgId}/estimate`, {
      method: "PUT",
      body: JSON.stringify({ response }),
    });
  },
  /** 거래 상태 변경 (작가 전용) */
  updateStatus(inquiryId: string, status: TradeStatus): Promise<UserInquiry> {
    return request<UserInquiry>(`/api/inquiries/${inquiryId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },
};

// ─── AI Search ───────────────────────────────────────────────────────────────

export interface SearchResponse extends AISearchResult {
  isMocked: boolean;
}

export const searchApi = {
  naturalLanguage(prompt: string): Promise<SearchResponse> {
    return request<SearchResponse>("/api/search", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    });
  },
  autoTag(title: string, description?: string): Promise<{ tags: string[]; isMocked: boolean }> {
    return request("/api/ai-autotag", {
      method: "POST",
      body: JSON.stringify({ title, description }),
    });
  },
};

// ─── Room Match (Iamhero AI) ─────────────────────────────────────────────────

export interface RoomMatchResponse {
  tags: string[];
  matchedArtworkIds: string[];
  explanations: Record<string, string>;
  scores: Record<string, number>;
  isMocked: boolean;
}

export const roomMatchApi = {
  /**
   * 방 사진 + 기분 텍스트로 Iamhero AI 추천을 받는다.
   * @param userText 사용자의 현재 상태/원하는 분위기 텍스트
   * @param roomImageFile 방 사진 File 객체
   */
  async recommend(userText: string, roomImageFile: File): Promise<RoomMatchResponse> {
    // File → base64 변환
    const roomImageBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(roomImageFile);
    });

    return request<RoomMatchResponse>("/api/room-match", {
      method: "POST",
      body: JSON.stringify({ userText, roomImageBase64 }),
    });
  },
};

// ─── Admin ───────────────────────────────────────────────────────────────────

export const adminApi = {
  stats(): Promise<AdminStats> {
    return request<AdminStats>("/api/admin/stats");
  },
  health(): Promise<{ status: string }> {
    return request<{ status: string }>("/api/health");
  },
};
