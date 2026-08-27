"""Prepare generated category photography for responsive web layouts."""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps


@dataclass(frozen=True)
class Category:
    source: str
    output: str
    card_centering: tuple[float, float] = (0.5, 0.5)
    detail_centering: tuple[float, float] = (0.5, 0.5)


CATEGORIES = (
    Category("curtains-master.png", "curtains-luxe", (0.5, 0.52), (0.5, 0.52)),
    Category("venetian-blinds-master.png", "venetian-blinds", (0.56, 0.5), (0.54, 0.5)),
    Category("upholstery-sofa-master.png", "upholstery-sofa", (0.5, 0.55), (0.5, 0.56)),
)


def prepare(
    source: Image.Image,
    size: tuple[int, int],
    centering: tuple[float, float],
) -> Image.Image:
    image = ImageOps.fit(
        source.convert("RGB"),
        size,
        method=Image.Resampling.LANCZOS,
        centering=centering,
    )
    image = ImageEnhance.Contrast(image).enhance(1.02)
    image = ImageEnhance.Color(image).enhance(1.015)
    return ImageEnhance.Sharpness(image).enhance(1.05)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source_dir", type=Path)
    parser.add_argument("output_dir", type=Path)
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)

    exports = (
        ("card", (1000, 1400), "card_centering", 80),
        ("detail", (1600, 1100), "detail_centering", 82),
    )

    for category in CATEGORIES:
        with Image.open(args.source_dir / category.source) as source:
            for suffix, size, centering_name, quality in exports:
                image = prepare(source, size, getattr(category, centering_name))
                destination = args.output_dir / f"{category.output}-{suffix}.webp"
                image.save(destination, "WEBP", quality=quality, method=6)
                print(
                    f"{destination.name:38} {image.width}x{image.height} "
                    f"{destination.stat().st_size / 1024:7.1f} KB"
                )


if __name__ == "__main__":
    main()
