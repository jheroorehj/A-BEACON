# artwork_profile.py

from embedding import (
    text_embedding
)

from clip_embedding import (
    image_embedding
)

from color_match import (
    extract_dominant_color
)


def build_artwork_profile(

    title,

    description,

    image_path
):

    text_vector = (
        text_embedding(
            description
        )
    )

    image_vector = (
        image_embedding(
            image_path
        )
    )

    colors = (
        extract_dominant_color(
            image_path
        )
    )

    return {

        "title":
        title,

        "description":
        description,

        "image":
        image_path,

        "text_vector":
        text_vector.tolist(),

        "image_vector":
        image_vector.tolist(),

        "colors":
        colors.tolist()
    }