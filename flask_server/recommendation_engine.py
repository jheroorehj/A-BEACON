# recommendation_engine.py

import numpy as np

from sklearn.metrics.pairwise import (
    cosine_similarity
)

from explanation_engine import (
    generate_explanation
)


def cosine(
    a,
    b
):

    a = np.array(a).reshape(
        1,
        -1
    )

    b = np.array(b).reshape(
        1,
        -1
    )

    return cosine_similarity(
        a,
        b
    )[0][0]


def recommend(

    buyer_profile,

    artworks,

    user_text=""
):

    results = []

    buyer_text = (
        buyer_profile[
            "text_vector"
        ]
    )

    buyer_image = (
        buyer_profile[
            "image_vector"
        ]
    )

    buyer_colors = (

        np.array(
            buyer_profile[
                "colors"
            ]
        )
        .flatten()
    )

    for artwork in artworks:

        text_score = cosine(

            buyer_text,

            artwork[
                "text_vector"
            ]
        )

        image_score = cosine(

            buyer_image,

            artwork[
                "image_vector"
            ]
        )

        artwork_colors = (

            np.array(
                artwork[
                    "colors"
                ]
            )
            .flatten()
        )

        color_score = cosine(

            buyer_colors,

            artwork_colors
        )

        final_score = (

            0.6 * text_score +

            0.3 * image_score +

            0.1 * color_score
        )

        reason = (

            generate_explanation(

                user_text,

                artwork
            )
        )

        results.append({

            "ab_id":
            artwork.get("ab_id", ""),

            "title":
            artwork["title"],

            "description":
            artwork["description"],

            "image":
            artwork["image"],

            "final_score":
            float(
                final_score
            ),

            "text_score":
            float(
                text_score
            ),

            "image_score":
            float(
                image_score
            ),

            "color_score":
            float(
                color_score
            ),

            "reason":
            reason
        })

    results.sort(

        key=lambda x:
        x["final_score"],

        reverse=True
    )

    return results[:3]