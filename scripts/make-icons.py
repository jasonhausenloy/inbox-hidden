#!/usr/bin/env python3
"""Generate extension icons.

A small inbox-tray glyph crossed with a slash, on Gmail-blue background.
"""
from PIL import Image, ImageDraw
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "icons"
OUT.mkdir(parents=True, exist_ok=True)

BG = (26, 115, 232)   # Gmail blue
FG = (255, 255, 255)


def draw_icon(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), BG + (255,))
    d = ImageDraw.Draw(img)
    s = size

    # Rounded square mask via alpha (manual)
    radius = int(s * 0.22)
    mask = Image.new("L", (s, s), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle((0, 0, s - 1, s - 1), radius=radius, fill=255)
    rounded = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    rounded.paste(img, (0, 0), mask)

    d = ImageDraw.Draw(rounded)

    # Inbox tray (open at top)
    pad = int(s * 0.22)
    tray_top = int(s * 0.48)
    tray_bot = s - pad
    tray_left = pad
    tray_right = s - pad
    lw = max(2, int(s * 0.06))
    # left wall
    d.line([(tray_left, tray_top), (tray_left, tray_bot)], fill=FG, width=lw)
    # right wall
    d.line([(tray_right, tray_top), (tray_right, tray_bot)], fill=FG, width=lw)
    # bottom
    d.line([(tray_left, tray_bot), (tray_right, tray_bot)], fill=FG, width=lw)
    # inner lip / mouth
    mouth_y = int(s * 0.55)
    mouth_pad = int(s * 0.04)
    d.line(
        [(tray_left + lw // 2, mouth_y), (tray_left + (s * 0.18), mouth_y)],
        fill=FG, width=lw,
    )
    d.line(
        [(tray_right - (s * 0.18), mouth_y), (tray_right - lw // 2, mouth_y)],
        fill=FG, width=lw,
    )

    # Diagonal slash through the tray
    slash_w = max(2, int(s * 0.08))
    d.line([(int(s * 0.18), int(s * 0.86)), (int(s * 0.86), int(s * 0.18))],
           fill=FG, width=slash_w)
    # subtle dark outline on slash for contrast on blue
    d.line([(int(s * 0.18), int(s * 0.86)), (int(s * 0.86), int(s * 0.18))],
           fill=(26, 115, 232, 255), width=max(1, slash_w // 3))

    return rounded


for size in (16, 32, 48, 128):
    img = draw_icon(size)
    img.save(OUT / f"icon-{size}.png", "PNG")
    print(f"wrote {OUT / f'icon-{size}.png'}")
