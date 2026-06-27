import base64
import io
import os
import time

from collections import Counter

from flask import (
    Flask,
    render_template,
    request,
    redirect,
    jsonify,
    send_from_directory
)
from flask_cors import CORS
from werkzeug.utils import secure_filename

from PIL import Image

from artwork_store import (
    add_artwork,
    delete_artwork,
    update_artwork,
    load_artworks
)

from vector_db import (
    build_vector_db
)

from buyer_profile import (
    build_buyer_profile
)

from recommendation_engine import (
    recommend
)

from recommend_logs import (
    add_log,
    load_logs
)

app = Flask(__name__)
CORS(app)

ARTWORK_FOLDER = "uploads/artworks"
ROOM_FOLDER = "uploads/rooms"

os.makedirs(ARTWORK_FOLDER, exist_ok=True)
os.makedirs(ROOM_FOLDER, exist_ok=True)


# ─── 웹 UI 라우트 ────────────────────────────────────────────────────────────

@app.route("/")
def home():
    artworks = build_vector_db()
    logs = load_logs()
    return render_template("index.html", artworks=artworks, logs=logs)


@app.route("/dashboard")
def dashboard():
    logs = load_logs()
    total_recommendations = len(logs)
    average_score = 0
    if logs:
        average_score = sum(log["score"] for log in logs) / len(logs)
    counter = Counter(log["result"] for log in logs)
    most_common_artwork = counter.most_common(1)[0] if counter else None
    return render_template(
        "dashboard.html",
        total_recommendations=total_recommendations,
        average_score=round(average_score, 3),
        most_common_artwork=most_common_artwork,
        logs=logs[-10:]
    )


@app.route("/uploads/artworks/<filename>")
def artwork_file(filename):
    return send_from_directory(ARTWORK_FOLDER, filename)


@app.route("/uploads/rooms/<filename>")
def room_file(filename):
    return send_from_directory(ROOM_FOLDER, filename)


@app.route("/register", methods=["POST"])
def register_artwork():
    title = request.form["title"]
    description = request.form["description"]
    image_file = request.files["image"]
    filename = secure_filename(image_file.filename)
    image_path = os.path.join(ARTWORK_FOLDER, filename)
    image_file.save(image_path)
    add_artwork(title, description, image_path)
    return redirect("/")


@app.route("/delete/<artwork_id>")
def delete_page(artwork_id):
    delete_artwork(artwork_id)
    return redirect("/")


@app.route("/edit/<artwork_id>")
def edit_page(artwork_id):
    artworks = build_vector_db()
    artwork = next((a for a in artworks if a.get("id") == artwork_id), None)
    if artwork is None:
        return redirect("/")
    return render_template("edit.html", artwork=artwork)


@app.route("/update/<artwork_id>", methods=["POST"])
def update_page(artwork_id):
    title = request.form["title"]
    description = request.form["description"]
    artworks = build_vector_db()
    current = next((a for a in artworks if a.get("id") == artwork_id), None)
    image_file = request.files.get("image")
    if image_file and image_file.filename:
        filename = secure_filename(image_file.filename)
        image_path = os.path.join(ARTWORK_FOLDER, filename)
        image_file.save(image_path)
    else:
        image_path = current["image"] if current else ""
    update_artwork(artwork_id, title, description, image_path)
    return redirect("/")


@app.route("/recommend", methods=["POST"])
def recommend_page():
    user_text = request.form["user_text"]
    room_image = request.files["room_image"]
    filename = secure_filename(room_image.filename)
    room_path = os.path.join(ROOM_FOLDER, filename)
    room_image.save(room_path)
    artworks = build_vector_db()
    buyer_profile = build_buyer_profile(user_text, room_path)
    results = recommend(buyer_profile, artworks, user_text)
    if results:
        add_log(user_text, results[0]["title"], results[0]["final_score"])
    logs = load_logs()
    return render_template(
        "index.html",
        artworks=artworks,
        results=results,
        room_image=room_path,
        logs=logs
    )


# ─── a-beacon 연동 API ───────────────────────────────────────────────────────

@app.route("/api/sync", methods=["POST"])
def sync_artworks():
    """
    a-beacon에서 작품 목록을 받아 일괄 벡터화 등록.
    요청 형식: [{ ab_id, title, description, imageUrl }, ...]
    이미 등록된 ab_id는 건너뜀.
    """
    items = request.json
    if not items or not isinstance(items, list):
        return jsonify({"error": "올바른 형식이 아닙니다."}), 400

    existing = load_artworks()
    existing_ab_ids = {a.get("ab_id") for a in existing if a.get("ab_id")}

    synced = 0
    skipped = 0
    errors = []

    for item in items:
        ab_id = item.get("ab_id")
        if ab_id in existing_ab_ids:
            skipped += 1
            continue
        try:
            add_artwork(
                title=item["title"],
                description=item["description"],
                image_path=item["imageUrl"],   # URL 지원 추가됨
                ab_id=ab_id
            )
            synced += 1
        except Exception as e:
            errors.append({"ab_id": ab_id, "error": str(e)})

    return jsonify({"synced": synced, "skipped": skipped, "errors": errors})


@app.route("/api/recommend-json", methods=["POST"])
def recommend_json():
    """
    a-beacon 프론트엔드 연동용 추천 엔드포인트.
    요청 형식: { userText, roomImageBase64 }  (base64는 data:image/...;base64,... 형식)
    응답 형식: { matchedArtworkIds, explanations, scores }
      - matchedArtworkIds: ab_id 기준 상위 3개
      - explanations: { ab_id: reason }
      - scores: { ab_id: final_score }
    """
    data = request.json
    if not data:
        return jsonify({"error": "요청 데이터가 없습니다."}), 400

    user_text = data.get("userText", "")
    image_b64 = data.get("roomImageBase64", "")

    # base64 디코딩 → 임시 파일 저장
    try:
        header, encoded = image_b64.split(",", 1)
        image_bytes = base64.b64decode(encoded)
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        temp_filename = f"temp_room_{int(time.time())}.jpg"
        temp_path = os.path.join(ROOM_FOLDER, temp_filename)
        pil_image.save(temp_path)
    except Exception as e:
        return jsonify({"error": f"이미지 처리 실패: {str(e)}"}), 400

    artworks = build_vector_db()
    if not artworks:
        return jsonify({"error": "등록된 작품이 없습니다. /api/sync를 먼저 실행하세요."}), 404

    try:
        buyer_profile = build_buyer_profile(user_text, temp_path)
        results = recommend(buyer_profile, artworks, user_text)
    finally:
        # 임시 파일 정리
        if os.path.exists(temp_path):
            os.remove(temp_path)

    # ab_id 기준으로 응답 구성
    matched_ids = []
    explanations = {}
    scores = {}

    for r in results:
        ab_id = r.get("ab_id") or r.get("title")  # ab_id 없으면 title 폴백
        matched_ids.append(ab_id)
        explanations[ab_id] = r["reason"]
        scores[ab_id] = round(r["final_score"], 3)

    if results:
        add_log(user_text, results[0]["title"], results[0]["final_score"])

    return jsonify({
        "matchedArtworkIds": matched_ids,
        "explanations": explanations,
        "scores": scores
    })


@app.route("/api/health")
def health():
    return jsonify({"status": "ok", "artworks": len(load_artworks())})


if __name__ == "__main__":
    app.run(debug=True, port=5001)
