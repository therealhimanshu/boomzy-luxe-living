"""Extract and prepare web-ready photography from the Luxe Living brochure."""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps
from pypdf import PdfReader


@dataclass(frozen=True)
class Export:
    filename: str
    page: int
    image: int
    size: tuple[int, int]
    centering: tuple[float, float] = (0.5, 0.5)
    quality: int = 80


EXPORTS = (
    Export("home-hero.webp", 5, 3, (2000, 1127), (0.54, 0.5), 80),
    Export("home-hero-mobile.webp", 5, 3, (1000, 1400), (0.5, 0.5), 78),
    Export("showroom-curated.webp", 4, 1, (1200, 1500), (0.54, 0.5)),
    Export("showroom-wallpaper.webp", 7, 3, (1600, 1200), (0.5, 0.5)),
    Export("collections-hero.webp", 9, 3, (1200, 1500), (0.47, 0.5)),
    Export("about-hero.webp", 2, 1, (1200, 1500), (0.72, 0.5)),
    Export("contact-hero.webp", 10, 4, (1200, 1500), (0.53, 0.5)),
    Export("curtains-card.webp", 3, 1, (1000, 1400), (0.53, 0.5)),
    Export("curtains-detail.webp", 5, 3, (1600, 1100), (0.54, 0.5), 78),
    Export("blinds-card.webp", 6, 4, (1000, 1400), (0.53, 0.5)),
    Export("blinds-detail.webp", 6, 4, (1600, 1100), (0.52, 0.5)),
    Export("upholstery-card.webp", 6, 5, (1000, 1400), (0.5, 0.5), 76),
    Export("upholstery-detail.webp", 6, 5, (1600, 1100), (0.5, 0.5), 76),
    Export("wallpapers-card.webp", 7, 1, (1000, 1400), (0.5, 0.5)),
    Export("wallpapers-detail.webp", 7, 3, (1600, 1100), (0.5, 0.5)),
    Export("flooring-card.webp", 8, 1, (1000, 1400), (0.6, 0.58)),
    Export("flooring-detail.webp", 8, 1, (1600, 1100), (0.55, 0.58)),
)


def prepare(image: Image.Image, export: Export) -> Image.Image:
    if image.mode == "CMYK":
        image = image.convert("RGB")
    elif image.mode == "RGBA":
        background = Image.new("RGB", image.size, "white")
        background.paste(image, mask=image.getchannel("A"))
        image = background
    elif image.mode != "RGB":
        image = image.convert("RGB")

    image = ImageOps.fit(
        image,
        export.size,
        method=Image.Resampling.LANCZOS,
        centering=export.centering,
    )
    image = ImageEnhance.Contrast(image).enhance(1.03)
    image = ImageEnhance.Color(image).enhance(1.02)
    return ImageEnhance.Sharpness(image).enhance(1.06)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    args.output.mkdir(parents=True, exist_ok=True)
    reader = PdfReader(args.pdf)
    cache: dict[tuple[int, int], Image.Image] = {}

    for export in EXPORTS:
        key = (export.page, export.image)
        if key not in cache:
            page = reader.pages[export.page - 1]
            cache[key] = page.images[export.image].image.copy()

        result = prepare(cache[key].copy(), export)
        destination = args.output / export.filename
        result.save(destination, "WEBP", quality=export.quality, method=6)
        print(
            f"{destination.name:28} {result.width}x{result.height} "
            f"{destination.stat().st_size / 1024:7.1f} KB"
        )


if __name__ == "__main__":
    main()
