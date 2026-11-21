#!/usr/bin/env python3
"""Generate original, tileable fog PNGs using only the Python standard library."""

import argparse
import hashlib
import html
import json
import math
from pathlib import Path
import struct
import zlib


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "sudokuru" / ".assets" / "FocusFog"
PRESETS = {
    "haze": {
        "label": "Subtle haze",
        "frequency": 2,
        "persistence": 0.45,
        "warp": 0.13,
        "contrast": 1.4,
        "gamma": 1.0,
        "opacity_min": 0.08,
        "opacity_max": 0.42,
    },
    "clouds": {
        "label": "Medium clouds",
        "frequency": 3,
        "persistence": 0.5,
        "warp": 0.12,
        "contrast": 2.2,
        "gamma": 1.0,
        "opacity_min": 0.06,
        "opacity_max": 0.82,
    },
    "dense": {
        "label": "Dense fog",
        "frequency": 4,
        "persistence": 0.55,
        "warp": 0.15,
        "contrast": 2.7,
        "gamma": 0.7,
        "opacity_min": 0.22,
        "opacity_max": 0.96,
    },
}


def hash32(value):
    """Explicit integer hashing keeps noise independent of Python's random seed."""
    value &= 0xFFFFFFFF
    value ^= value >> 16
    value = (value * 0x7FEB352D) & 0xFFFFFFFF
    value ^= value >> 15
    value = (value * 0x846CA68B) & 0xFFFFFFFF
    return value ^ (value >> 16)


def fade(value):
    return value * value * value * (value * (value * 6 - 15) + 10)


class TileableNoise:
    def __init__(self, frequency, seed):
        self.frequency = frequency
        self.grid = [
            [
                hash32(seed ^ (x * 0x9E3779B1) ^ (y * 0x85EBCA77)) / 0xFFFFFFFF
                for x in range(frequency)
            ]
            for y in range(frequency)
        ]

    def sample(self, u, v):
        x = (u % 1.0) * self.frequency
        y = (v % 1.0) * self.frequency
        left, top = math.floor(x), math.floor(y)
        right = (left + 1) % self.frequency
        bottom = (top + 1) % self.frequency
        tx, ty = fade(x - left), fade(y - top)
        upper = self.grid[top][left] * (1 - tx) + self.grid[top][right] * tx
        lower = self.grid[bottom][left] * (1 - tx) + self.grid[bottom][right] * tx
        return upper * (1 - ty) + lower * ty


def generate_texture(size, seed, preset):
    # Periodic domain warping avoids straight, obviously procedural noise bands.
    warp_x = TileableNoise(3, hash32(seed ^ 0xA341316C))
    warp_y = TileableNoise(3, hash32(seed ^ 0xC8013EA4))
    octaves = [
        TileableNoise(preset["frequency"] * 2**index, hash32(seed + index * 7919))
        for index in range(6)
    ]
    weights = [preset["persistence"] ** index for index in range(len(octaves))]
    total_weight = sum(weights)
    pixels = bytearray()
    for y in range(size):
        v = y / size
        for x in range(size):
            u = x / size
            warped_u = u + (warp_x.sample(u, v) - 0.5) * preset["warp"]
            warped_v = v + (warp_y.sample(u, v) - 0.5) * preset["warp"]
            value = sum(
                octave.sample(warped_u, warped_v) * weight
                for octave, weight in zip(octaves, weights)
            ) / total_weight
            value = min(1.0, max(0.0, (value - 0.5) * preset["contrast"] + 0.5))
            value **= preset["gamma"]
            opacity = preset["opacity_min"] + value * (
                preset["opacity_max"] - preset["opacity_min"]
            )
            pixels.extend((255, 255, 255, round(opacity * 255)))
    return bytes(pixels)


def png_chunk(kind, data):
    return (
        struct.pack(">I", len(data))
        + kind
        + data
        + struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)
    )


def encode_png(width, pixels, height=None):
    # RGBA, filter type 0, no timestamps or platform-specific metadata.
    height = width if height is None else height
    stride = width * 4
    rows = b"".join(b"\x00" + pixels[y * stride : (y + 1) * stride] for y in range(height))
    return (
        b"\x89PNG\r\n\x1a\n"
        + png_chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))
        + png_chunk(b"IDAT", zlib.compress(rows, level=9))
        + png_chunk(b"IEND", b"")
    )


def make_contact_sheet(textures, size):
    """Opaque preview: texture rows, Light/Classic/Dark columns, no grid."""
    thumb = min(size, 256)
    gutter = 16
    width = thumb * 3 + gutter * 4
    height = thumb * len(textures) + gutter * (len(textures) + 1)
    pixels = bytearray((242, 242, 242, 255) * (width * height))
    for row, texture in enumerate(textures.values()):
        for column, background in enumerate(((229, 231, 235), (72, 90, 100), (36, 38, 42))):
            for y in range(thumb):
                source_y = y * size // thumb
                target_y = gutter + row * (thumb + gutter) + y
                for x in range(thumb):
                    source_x = x * size // thumb
                    alpha = texture[(source_y * size + source_x) * 4 + 3]
                    target_x = gutter + column * (thumb + gutter) + x
                    index = (target_y * width + target_x) * 4
                    pixels[index : index + 4] = bytes(
                        [round((base * (255 - alpha) + 255 * alpha) / 255) for base in background]
                        + [255]
                    )
    return encode_png(width, pixels, height)


def make_preview(names, seed, size):
    cards = []
    for name in names:
        label = html.escape(PRESETS[name]["label"])
        source = f"fog-{name}.png"
        samples = "".join(
            f'<div><h3>{theme}</h3><div class="sample {theme.lower()}">'
            f'<img src="{source}" alt="{label} on {theme} background">'
            '<div class="grid"></div></div></div>'
            for theme in ("Light", "Classic", "Dark")
        )
        cards.append(
            f'<section><h2>{label}</h2><a href="{source}">{source}</a>'
            f'<div class="samples">{samples}</div></section>'
        )
    return f"""<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Focus fog texture candidates</title>
<style>
  * {{ box-sizing: border-box; }}
  body {{ margin: 0 auto; padding: 24px; max-width: 1200px; background: #f2f2f2; color: #17212b; font: 16px/1.5 system-ui, sans-serif; }}
  h1, h2, h3 {{ line-height: 1.2; }}
  section {{ margin: 24px 0; padding: 20px; background: white; border-radius: 12px; }}
  a {{ color: #025e73; }}
  .samples {{ display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 20px; }}
  .sample {{ position: relative; aspect-ratio: 1; overflow: hidden; border: 2px solid #333; }}
  .sample img {{ display: block; width: 100%; height: 100%; }}
  .light {{ background: #e5e7eb; }}
  .classic {{ background: #485a64; }}
  .dark {{ background: #24262a; }}
  .grid {{ position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(to right, #0009 1px, transparent 1px), linear-gradient(to bottom, #0009 1px, transparent 1px), linear-gradient(to right, #000 2px, transparent 2px), linear-gradient(to bottom, #000 2px, transparent 2px); background-size: calc(100% / 9) calc(100% / 9), calc(100% / 9) calc(100% / 9), calc(100% / 3) calc(100% / 3), calc(100% / 3) calc(100% / 3); }}
  .no-grid .grid {{ display: none; }}
  @media (max-width: 700px) {{ .samples {{ grid-template-columns: 1fr; }} }}
</style>
<h1>Focus fog texture candidates</h1>
<p>Seed: <strong>{seed}</strong> · {size} × {size} pixels · Original static, seamless textures.</p>
<p>These are white clouds with variable transparency over the current fog colors, not images of board contents. The grid is only a preview overlay; the app has not been changed.</p>
<label><input type="checkbox" checked onchange="document.body.classList.toggle('no-grid', !this.checked)"> Show Sudoku grid</label>
{''.join(cards)}
</html>
"""


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--seed", type=int, default=42, help="Deterministic seed (default: 42)")
    parser.add_argument("--size", type=int, default=512, help="Square PNG size, 64–2048 (default: 512)")
    parser.add_argument("--preset", choices=["all", *PRESETS], default="all")
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    if not 64 <= args.size <= 2048:
        parser.error("--size must be between 64 and 2048")

    args.output_dir.mkdir(parents=True, exist_ok=True)
    names = list(PRESETS) if args.preset == "all" else [args.preset]
    manifest = {"generator_version": 1, "seed": args.seed, "size": args.size, "textures": {}}
    textures = {}
    for name in names:
        pixels = generate_texture(args.size, args.seed, PRESETS[name])
        textures[name] = pixels
        encoded = encode_png(args.size, pixels)
        path = args.output_dir / f"fog-{name}.png"
        path.write_bytes(encoded)
        manifest["textures"][name] = {
            "file": path.name,
            "settings": PRESETS[name],
            "rgba_sha256": hashlib.sha256(pixels).hexdigest(),
            "png_sha256": hashlib.sha256(encoded).hexdigest(),
        }
        print(f"Created {path} ({len(encoded):,} bytes)")
    (args.output_dir / "preview.png").write_bytes(make_contact_sheet(textures, args.size))
    (args.output_dir / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )
    preview = args.output_dir / "preview.html"
    preview.write_text(make_preview(names, args.seed, args.size), encoding="utf-8")
    print(f"Preview: {preview}")


if __name__ == "__main__":
    main()
