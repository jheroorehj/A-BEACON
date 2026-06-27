# recommend_logs.py

import json

from pathlib import Path


DATA_DIR = Path("data")

LOG_FILE = (
    DATA_DIR /
    "recommend_logs.json"
)


def load_logs():

    if not LOG_FILE.exists():

        return []

    with open(

        LOG_FILE,

        "r",

        encoding="utf-8"

    ) as f:

        return json.load(f)


def save_logs(logs):

    DATA_DIR.mkdir(
        exist_ok=True
    )

    with open(

        LOG_FILE,

        "w",

        encoding="utf-8"

    ) as f:

        json.dump(

            logs,

            f,

            ensure_ascii=False,

            indent=4
        )


def add_log(

    query,

    result_title,

    score
):

    logs = (
        load_logs()
    )

    logs.append({

        "query":
        query,

        "result":
        result_title,

        "score":
        round(
            score,
            3
        )
    })

    save_logs(
        logs
    )