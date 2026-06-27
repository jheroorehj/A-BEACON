# artwork_store.py

import json
import uuid

from pathlib import Path

from artwork_profile import (
    build_artwork_profile
)

DATA_DIR = Path("data")

DATA_FILE = (
    DATA_DIR /
    "artworks.json"
)


def load_artworks():

    if not DATA_FILE.exists():

        return []

    with open(

        DATA_FILE,

        "r",

        encoding="utf-8"

    ) as f:

        return json.load(f)


def save_artworks(data):

    DATA_DIR.mkdir(
        exist_ok=True
    )

    with open(

        DATA_FILE,

        "w",

        encoding="utf-8"

    ) as f:

        json.dump(

            data,

            f,

            ensure_ascii=False,

            indent=4
        )


def add_artwork(

    title,

    description,

    image_path,

    ab_id=None
):

    profile = (

        build_artwork_profile(

            title,

            description,

            image_path
        )
    )

    profile["id"] = str(uuid.uuid4())

    if ab_id:
        profile["ab_id"] = ab_id

    artworks = (
        load_artworks()
    )

    artworks.append(
        profile
    )

    save_artworks(
        artworks
    )


def delete_artwork(
    artwork_id
):

    artworks = (
        load_artworks()
    )

    artworks = [
        a for a in artworks
        if a.get("id") != artwork_id
    ]

    save_artworks(
        artworks
    )


def update_artwork(

    artwork_id,

    title,

    description,

    image_path
):

    artworks = (
        load_artworks()
    )

    for i, artwork in enumerate(artworks):

        if artwork.get("id") == artwork_id:

            profile = (

                build_artwork_profile(

                    title,

                    description,

                    image_path
                )
            )

            profile["id"] = artwork_id

            artworks[i] = profile

            break

    save_artworks(
        artworks
    )
