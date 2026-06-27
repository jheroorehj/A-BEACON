# embedding.py

from sentence_transformers import SentenceTransformer
import numpy as np

print("Loading E5...")

text_model = SentenceTransformer(
    "intfloat/multilingual-e5-base"
)

print("E5 Loaded")


def normalize(vec):

    norm = np.linalg.norm(vec)

    if norm == 0:
        return vec

    return vec / norm


def text_embedding(text):

    vec = text_model.encode(
        text,
        normalize_embeddings=True
    )

    return vec