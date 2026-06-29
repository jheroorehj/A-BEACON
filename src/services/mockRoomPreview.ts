/**
 * 목(Mock) 룸 프리뷰 — 영상 촬영용 임시 파일
 * 실제 Gemini API 대신 /mock/room-preview-demo.png 를 3초 딜레이 후 반환.
 *
 * 원래대로 되돌리려면:
 *   .env 에서 VITE_MOCK_ROOM_PREVIEW=true → 삭제 또는 false 로 변경
 */
export async function mockRoomPreview(delayMs = 3000): Promise<{ previewImageBase64: string; mimeType: string }> {
  await new Promise((r) => setTimeout(r, delayMs));

  const res = await fetch("/mock/room-preview-demo.png");
  const blob = await res.blob();
  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(blob);
  });

  return { previewImageBase64: base64, mimeType: "image/png" };
}
