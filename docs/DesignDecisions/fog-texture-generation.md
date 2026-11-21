# Generating Focus fog textures

Three original texture candidates are available in [`sudokuru/.assets/FocusFog/`](../../sudokuru/.assets/FocusFog/):

| File             | Appearance                                    |
| ---------------- | --------------------------------------------- |
| `fog-haze.png`   | Subtle, low-contrast haze                     |
| `fog-clouds.png` | Medium-contrast cloud shapes                  |
| `fog-dense.png`  | Denser fog with stronger light/dark variation |

**These are candidates only. They are not wired into the Sudoku board.** The existing app appearance is unchanged.

## Preview

Open [`preview.html`](../../sudokuru/.assets/FocusFog/preview.html) in a browser. On macOS, from the repository root:

```sh
open sudokuru/.assets/FocusFog/preview.html
```

The page compares every candidate on Light, Classic, and Dark fog backgrounds. A checkbox toggles the sample Sudoku grid. It works locally without a server or external resources.

[`preview.png`](../../sudokuru/.assets/FocusFog/preview.png) is an opaque contact sheet that also works in ordinary image viewers. Rows are haze, clouds, and dense fog; columns are Light, Classic, and Dark. It omits grid lines to make the cloud detail easier to compare.

The PNGs contain **white clouds with variable alpha**, not an opaque grayscale background. Inspect them against a colored/dark surface or in the preview page; a white image viewer background can hide their detail. The same asset can be placed over different theme colors without regenerating it. Cell contents must still be hidden separately—the texture is decorative, not a privacy mask.

## Reproduce the checked-in candidates

Requirements: **Python 3.9 or later**, standard library only. No Pillow, NumPy, image service, additional npm package, or network access is needed.

From the repository root:

```sh
python3 scripts/generate-fog-textures.py
```

This is equivalent to:

```sh
python3 scripts/generate-fog-textures.py --seed 42 --size 512 --preset all
```

The default output location is resolved relative to the script, not the shell's working directory. Running the same command overwrites generated files with the same names in that directory. It does not remove other files.

The generator creates:

- Three 512 × 512 RGBA PNGs.
- `preview.html`, for visual comparison.
- `preview.png`, an opaque comparison sheet.
- `manifest.json`, recording the seed, dimensions, preset parameters, and SHA-256 hashes of both uncompressed RGBA pixels and PNG files.

The seed and explicit integer hashing make the pixels repeatable. No timestamps or platform-specific image metadata are included. PNG compression bytes may differ across zlib versions; `rgba_sha256` compares the actual pixels independently of compression.

## Create other variations

Use another seed to change cloud placement without changing the preset's character:

```sh
python3 scripts/generate-fog-textures.py --seed 123 --output-dir fog-previews/seed-123
```

Generate one candidate at another resolution:

```sh
python3 scripts/generate-fog-textures.py --preset clouds --seed 42 --size 1024 --output-dir fog-previews/clouds-large
```

`--size` supports 64–2048 pixels. Larger textures take longer to generate. A single-preset run writes a preview and manifest for only that preset; use a separate output directory when experimenting so the checked-in candidates remain intact.

To customize the style, edit the `PRESETS` dictionary in [`scripts/generate-fog-textures.py`](../../scripts/generate-fog-textures.py):

| Setting                       | Effect                                                                                                                               |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `frequency`                   | Lower values produce larger, broader clouds; higher values produce smaller shapes. Keep this a positive integer for seamless tiling. |
| `persistence`                 | Higher values add more fine-grained detail from the smaller noise layers.                                                            |
| `warp`                        | Higher values bend cloud shapes more, avoiding straight noise bands.                                                                 |
| `contrast`                    | Higher values separate clear and dense areas more strongly.                                                                          |
| `gamma`                       | Values below 1 favor thicker/brighter fog; values above 1 favor clearer areas.                                                       |
| `opacity_min` / `opacity_max` | The transparency range, from 0 to 1.                                                                                                 |

## How the textures are made

The script combines six layers of periodic value noise, smooths them using quintic interpolation, and warps their coordinates with two additional periodic noise fields. It maps the result to white pixels with varying opacity.

Every noise field wraps in both dimensions, including the coordinate-warping fields. The resulting texture is seamless when repeated. Opposite edge pixels are not forced to be identical: adjacent tiles join as consecutive samples of the same smooth, periodic field.

The image encoder uses standard-library PNG chunks and zlib compression. The texture data is generated entirely in this repository, without copying Chess.com's fog image or any third-party artwork.

For eventual integration, use one continuous texture across the board and reveal it only inside inactive cell interiors. Do not restart the texture in every cell, soften the grid borders, or use the image to obscure still-rendered digits.
