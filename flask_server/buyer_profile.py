# buyer_profile.py

from embedding import (
    text_embedding
)

from clip_embedding import (
    image_embedding
)

from color_match import (
    extract_dominant_color
)


def build_buyer_profile(

    user_text,

    room_image
):

    expanded_text = f"""
사용자 상태

{user_text}

원하는 감정
원하는 분위기
원하는 공간
"""

    text_vector = (
        text_embedding(
            expanded_text
        )
    )

    image_vector = (
        image_embedding(
            room_image
        )
    )

    colors = (
        extract_dominant_color(
            room_image
        )
    )

    return {

        "text_vector":
        text_vector,

        "image_vector":
        image_vector,

        "colors":
        colors
    }   