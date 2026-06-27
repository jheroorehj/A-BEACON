# multimodal_embedding.py

import numpy as np


def normalize(vec):

    norm = np.linalg.norm(
        vec
    )

    if norm == 0:

        return vec

    return vec / norm


def create_artwork_vector(

    text_vector,

    image_vector,

    colors
):

    text_vector = np.array(
        text_vector
    )

    image_vector = np.array(
        image_vector
    )

    color_vector = (
        np.array(colors)
        .flatten()
        / 255.0
    )

    combined = np.concatenate([

        text_vector,

        image_vector,

        color_vector

    ])

    return normalize(
        combined
    )