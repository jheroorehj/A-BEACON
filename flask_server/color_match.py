# color_match.py

import io
import urllib.request

import cv2
import numpy as np

from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity


def _load_image(image_source):
    """경로(로컬 or URL)를 받아 OpenCV BGR 이미지 반환"""

    if isinstance(image_source, str) and (
        image_source.startswith("http://") or
        image_source.startswith("https://")
    ):
        req = urllib.request.Request(image_source, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = np.frombuffer(resp.read(), dtype=np.uint8)
        return cv2.imdecode(data, cv2.IMREAD_COLOR)

    # 로컬 경로 (한글/유니코드 경로 대응)
    data = np.fromfile(image_source, dtype=np.uint8)
    return cv2.imdecode(data, cv2.IMREAD_COLOR)


def extract_dominant_color(
    image_source,
    n_colors=3
):

    image = _load_image(image_source)

    if image is None:

        raise ValueError(
            f"이미지를 읽을 수 없습니다: {image_source}"
        )

    image = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2RGB
    )

    pixels = image.reshape(
        (-1, 3)
    )

    kmeans = KMeans(
        n_clusters=n_colors,
        random_state=42,
        n_init="auto"
    )

    kmeans.fit(
        pixels
    )

    colors = (
        kmeans.cluster_centers_
    )

    return colors


def color_similarity(
    image1,
    image2
):

    colors1 = extract_dominant_color(image1)
    colors2 = extract_dominant_color(image2)

    vec1 = colors1.flatten()
    vec2 = colors2.flatten()

    score = cosine_similarity(
        [vec1],
        [vec2]
    )[0][0]

    return float(score)
