#!/usr/bin/env python3
"""Genera un índice compacto de nombres de PokéAPI para la interfaz en español."""

import csv
import io
import json
import unicodedata
from pathlib import Path
from urllib.request import urlopen

BASE_URL = "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv"
ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
OUTPUT = DATA_DIR / "pokemon-es.json"
CORRECTIONS = DATA_DIR / "correcciones-es.json"


def fetch_csv(filename: str) -> list[dict[str, str]]:
    with urlopen(f"{BASE_URL}/{filename}", timeout=30) as response:
        return list(csv.DictReader(io.StringIO(response.read().decode("utf-8"))))


def normalize(value: str) -> str:
    decomposed = unicodedata.normalize("NFD", value.lower())
    return "".join(char for char in decomposed if char.isalnum())


def localized_names(records: list[dict[str, str]], id_field: str, spanish_id: str) -> dict[str, str]:
    return {
        row[id_field]: row["name"]
        for row in records
        if row["local_language_id"] == spanish_id
    }


def main() -> None:
    DATA_DIR.mkdir(exist_ok=True)
    languages = fetch_csv("languages.csv")
    spanish_id = next(row["id"] for row in languages if row["identifier"] == "es")

    species_names = localized_names(fetch_csv("pokemon_species_names.csv"), "pokemon_species_id", spanish_id)
    type_names = localized_names(fetch_csv("type_names.csv"), "type_id", spanish_id)
    ability_names = localized_names(fetch_csv("ability_names.csv"), "ability_id", spanish_id)
    stat_names = localized_names(fetch_csv("stat_names.csv"), "stat_id", spanish_id)
    pokemon = fetch_csv("pokemon.csv")
    species = fetch_csv("pokemon_species.csv")
    colors = {row["id"]: row["identifier"] for row in fetch_csv("pokemon_colors.csv")}

    corrections = json.loads(CORRECTIONS.read_text(encoding="utf-8")) if CORRECTIONS.exists() else {}
    for category, entries in corrections.items():
        if category in {"species", "types", "abilities", "stats"}:
            target = {"species": species_names, "types": type_names, "abilities": ability_names, "stats": stat_names}[category]
            target.update({str(key): value for key, value in entries.items()})

    default_pokemon = {
        row["species_id"]: row["identifier"]
        for row in pokemon
        if row["is_default"] == "1"
    }
    species_colors = {
        row["id"]: colors[row["color_id"]]
        for row in species
        if row["id"] in default_pokemon
    }
    search: dict[str, str] = {}
    for species_id, identifier in default_pokemon.items():
        search[str(int(species_id))] = identifier
        search[normalize(identifier)] = identifier
        if translated_name := species_names.get(species_id):
            search[normalize(translated_name)] = identifier

    OUTPUT.write_text(
        json.dumps(
            {
                "species": species_names,
                "types": type_names,
                "abilities": ability_names,
                "stats": stat_names,
                "colors": species_colors,
                "catalog": [
                    {
                        "id": int(species_id),
                        "identifier": identifier,
                        "name": species_names.get(species_id, identifier),
                        "color": species_colors[species_id],
                    }
                    for species_id, identifier in sorted(default_pokemon.items(), key=lambda item: int(item[0]))
                    if species_id in species_colors
                ],
                "search": search,
            },
            ensure_ascii=False,
            separators=(",", ":"),
        ),
        encoding="utf-8",
    )
    print(f"Índice localizado creado en {OUTPUT} ({len(species_names)} especies).")


if __name__ == "__main__":
    main()
