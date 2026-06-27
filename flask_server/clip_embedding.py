# clip_embedding.py

import io
import urllib.request

from transformers import (
    CLIPProcessor,
    CLIPModel
)

from PIL import Image

import torch
import numpy as np


print(
    "Loading CLIP..."
)

model = CLIPModel.from_pretrained(
    "openai/clip-vit-base-patch32"
)

processor = CLIPProcessor.from_pretrained(
    "openai/clip-vit-base-patch32"
)

print(
    "CLIP Loaded"
)


def normalize(vec):

    norm = np.linalg.norm(
        vec
    )

    if norm == 0:

        return vec

    return vec / norm


def _open_image(image_source):
    """경로(로컬 or URL) 또는 PIL Image 객체를 받아 RGB PIL Image 반환"""

    if isinstance(image_source, Image.Image):
        return image_source.convert("RGB")

    if isinstance(image_source, str) and (
        image_source.startswith("http://") or
        image_source.startswith("https://")
    ):
        req = urllib.request.Request(image_source, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
        return Image.open(io.BytesIO(data)).convert("RGB")

    return Image.open(image_source).convert("RGB")


def image_embedding(image_source):

    image = _open_image(image_source)

    inputs = processor(

        images=image,

        return_tensors="pt"
    )

    with torch.no_grad():

        features = (

            model.get_image_features(
                **inputs
            )
        )

    vec = (
        features[0]
        .cpu()
        .numpy()
    )

    vec = normalize(
        vec
    )

    return vec
