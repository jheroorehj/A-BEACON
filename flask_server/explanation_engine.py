# explanation_engine.py

import re


def summarize_text(
    text,
    limit=80
):

    text = re.sub(

        r"\s+",

        " ",

        text
    )

    if len(text) <= limit:

        return text

    return (
        text[:limit]
        + "..."
    )


def generate_explanation(

    user_text,

    artwork
):

    title = artwork[
        "title"
    ]

    description = artwork[
        "description"
    ]

    short_desc = (
        summarize_text(
            description
        )
    )

    return f"""
'{title}' 작품은

{short_desc}

를 담고 있습니다.

사용자가 입력한

'{user_text}'

와 의미적으로 가까워
추천되었습니다.

특히 작품이 전달하는
분위기와 감정이
사용자의 요구와
유사한 것으로 판단됩니다.
"""