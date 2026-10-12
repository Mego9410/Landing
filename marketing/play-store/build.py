"""Builds the Google Play listing graphics from the App Store source screens.

    python3 marketing/play-store/build.py

Writes to marketing/play-store/listing/:
  phone-01…08.png   1440 x 2560 phone screenshots (9:16; Play needs the long side at most twice the short side)
  feature-graphic.png  1024 x 500
  icon-512.png      512 x 512 app icon

Same copy, colours and fonts as the App Store set (designs/brand/Steadie App Store Assets.dc.html), but the phone is a
plain frame with an Android-style status bar: Google Play doesn't accept another platform's device in store images.
Needs Pillow. Fonts (OFL) are in ./fonts.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).resolve().parent
SRC = ROOT / "marketing/app-store/source"
OUT = HERE / "listing"
FONTS = HERE / "fonts"

W, H = 1440, 2560
INK, BEZEL, CREAM, APRICOT = (42, 37, 48), (31, 28, 35), (251, 241, 228), (222, 111, 68)


def hexc(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def font(name, size, weight):
    f = ImageFont.truetype(str(FONTS / f"{name}.ttf"), size)
    axes = f.get_variation_axes()
    f.set_variation_by_axes([weight] + [a["default"] for a in axes[1:]])
    return f


def wrap(text, f, max_w, draw):
    """Balanced wrap: the fewest lines that fit, then as even as possible (like CSS text-wrap: balance)."""
    words = text.split()

    def greedy(limit):
        lines, cur = [], ""
        for w in words:
            t = (cur + " " + w).strip()
            if draw.textlength(t, font=f) <= limit or not cur:
                cur = t
            else:
                lines.append(cur)
                cur = w
        return lines + [cur]

    n = len(greedy(max_w))
    lo, hi = 1, max_w
    while lo < hi:
        mid = (lo + hi) // 2
        if len(greedy(mid)) <= n:
            hi = mid
        else:
            lo = mid + 1
    return greedy(lo)


def text_block(draw, x, y, text, f, fill, max_w, line_h):
    for line in wrap(text, f, max_w, draw):
        draw.text((x, y), line, font=f, fill=fill)
        y += line_h
    return y


def rounded_mask(size, r):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), r, fill=255)
    return m


def android_screen(name):
    """The source screen with its iOS status bar (top 162 px, notch included) replaced by a plain Android one."""
    im = Image.open(SRC / name).convert("RGB")
    w = im.width
    bar_bg = im.getpixel((24, 175))
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, w, 162), fill=bar_bg)
    d.text((72, 84), "9:41", font=font("Nunito", 50, 700), fill=INK, anchor="lm")
    d.ellipse((w / 2 - 24, 84 - 24, w / 2 + 24, 84 + 24), fill=(18, 16, 20))  # punch-hole camera
    # Right: signal, wifi, battery, in simple Android shapes.
    x = w - 72
    d.rounded_rectangle((x - 62, 66, x - 6, 102), 8, outline=INK, width=5)
    d.rounded_rectangle((x - 56, 72, x - 22, 96), 4, fill=INK)
    d.rectangle((x - 6, 77, x, 91), fill=INK)
    x -= 96
    d.pieslice((x - 34, 58, x + 34, 126), 225, 315, fill=INK)  # wifi fan
    x -= 70
    d.polygon([(x - 28, 104), (x + 22, 104), (x + 22, 58)], fill=INK)  # signal
    return im


def phone(screen_name, width):
    """A plain dark phone frame around the screen, with a soft shadow. Returns an RGBA image."""
    scr = android_screen(screen_name)
    pad = round(width * 26 / 1003)
    inner_w = width - 2 * pad
    scr = scr.resize((inner_w, round(scr.height * inner_w / scr.width)), Image.LANCZOS)
    r_out, r_in = round(width * 148 / 1003), round(width * 124 / 1003)
    body = Image.new("RGBA", (width, scr.height + 2 * pad), BEZEL + (255,))
    body.putalpha(rounded_mask(body.size, r_out))
    body.paste(scr, (pad, pad), rounded_mask(scr.size, r_in))
    sh = 90
    out = Image.new("RGBA", (body.width + 2 * sh, body.height + 2 * sh), (0, 0, 0, 0))
    shadow = Image.new("RGBA", body.size, (40, 20, 10, 70))
    shadow.putalpha(rounded_mask(body.size, r_out).point(lambda v: v * 70 // 255))
    out.alpha_composite(shadow, (sh, sh + 40))
    out = out.filter(ImageFilter.GaussianBlur(45))
    out.alpha_composite(body, (sh, sh))
    return out, sh


def logo(height):
    """The cream Steadie lockup, lifted from the App Store hero (cream on apricot) as an alpha mask."""
    hero = Image.open(ROOT / "marketing/app-store/listing/6.9/iphone-01-hero.png").convert("RGB")
    crop = hero.crop((96, 158, 520, 248))
    g = crop.getchannel("G").point(lambda v: max(0, min(255, round((v - 111) * 255 / (241 - 111)))))
    box = g.point(lambda v: 255 if v > 20 else 0).getbbox()
    g = g.crop(box)
    g = g.resize((round(g.width * height / g.height), height), Image.LANCZOS)
    img = Image.new("RGBA", g.size, CREAM + (0,))
    img.putalpha(g)
    return img


SLIDES = [
    # (file, background, headline, subline, headline colour, subline colour, screen)
    ("hero", "#DE6F44", "Keep what you’ve worked for.", "The 12-month plan for the year after you stop a weight-loss jab.", "#FFFFFF", "#FFF6EC", "01-today.png"),
    ("plan", "#F8D8C4", "A year of support after the jab", "Three phases, Land, Settle and Steady, counted from your last injection.", "#2A2530", "#5B4E55", "06-plan.png"),
    ("habits", "#E3DBF2", "Three small habits a week", "Each with a short lesson. Swap one if it doesn’t suit your week.", "#2A2530", "#55506A", "07-week.png"),
    ("strength", "#D3E5EF", "Strength for every body", "25-minute sessions at home, shown by someone like you.", "#2A2530", "#4A5863", "03-run.png"),
    ("meals", "#D3E6D9", "Meals easier than a takeaway", "A week of meals planned, with leftovers and a takeaway night built in.", "#2A2530", "#4A5C50", "02-meals.png"),
    ("shopping", "#F5E5B5", "One shopping list for the week", "Every ingredient added up across every meal that uses it.", "#2A2530", "#5E5338", "08-shopping.png"),
    ("score", "#D3E6D9", "A weekly score for habits, not weight", "It notices drift early, and kindly.", "#2A2530", "#4A5C50", "04-progress.png"),
]

CARDS = [
    ("No goal weight", "We help you hold steady. Never a telling-off."),
    ("Numbers only if they help", "Safe mode hides weight entirely."),
    ("Your prescriber stays in charge", "A one-page summary to share. Never advice about medication."),
    ("Your data stays yours", "Kept private. Never sold, never used for ads."),
]


def phone_slide(i, key, bg, head, sub, head_c, sub_c, screen):
    im = Image.new("RGBA", (W, H), hexc(bg) + (255,))
    d = ImageDraw.Draw(im)
    left, max_w = 120, W - 240
    y = 200
    if key == "hero":
        lg = logo(92)
        im.alpha_composite(lg, (left, 170))
        y = 170 + lg.height + 70
        hf = font("Fredoka", 140, 600)
        y = text_block(d, left, y, head, hf, hexc(head_c), max_w, 148)
    else:
        hf = font("Fredoka", 124, 600)
        y = text_block(d, left, y, head, hf, hexc(head_c), max_w, 132)
    y += 36
    y = text_block(d, left, y, sub, font("Nunito", 55, 700), hexc(sub_c), max_w, 75)
    ph, sh = phone(screen, 980)
    im.alpha_composite(ph, ((W - ph.width) // 2, y + 90 - sh))
    im.convert("RGB").save(OUT / f"phone-{i:02d}-{key}.png", optimize=True)


def cards_slide(i):
    im = Image.new("RGBA", (W, H), APRICOT + (255,))
    d = ImageDraw.Draw(im)
    left, max_w = 120, W - 240
    y = text_block(d, left, 200, "On your side, all year", font("Fredoka", 140, 600), (255, 255, 255), max_w, 148) + 80
    tf, sf = font("Fredoka", 74, 600), font("Nunito", 50, 700)
    for title, sub in CARDS:
        tl = wrap(title, tf, max_w - 120, d)
        sl = wrap(sub, sf, max_w - 120, d)
        h = 60 + len(tl) * 86 + 20 + len(sl) * 68 + 60
        d.rounded_rectangle((left, y, W - left, y + h), 48, fill=CREAM)
        yy = text_block(d, left + 60, y + 60, title, tf, INK, max_w - 120, 86) + 20
        text_block(d, left + 60, yy, sub, sf, (91, 78, 85), max_w - 120, 68)
        y += h + 44
    lg = logo(84)
    base = H - 220
    im.alpha_composite(lg, (left, base - lg.height // 2))
    pf = font("Nunito", 54, 800)
    label = "Try it free for 7 days"
    tw = d.textlength(label, font=pf)
    x1 = W - left
    d.rounded_rectangle((x1 - tw - 110, base - 62, x1, base + 62), 62, fill=(255, 255, 255))
    d.text((x1 - 55 - tw, base), label, font=pf, fill=INK, anchor="lm")
    im.convert("RGB").save(OUT / f"phone-{i:02d}-on-your-side.png", optimize=True)


def feature_graphic():
    fw, fh = 1024, 500
    im = Image.new("RGBA", (fw, fh), APRICOT + (255,))
    d = ImageDraw.Draw(im)
    left = 64
    lg = logo(46)
    im.alpha_composite(lg, (left, 72))
    y = text_block(d, left, 72 + lg.height + 40, "Keep what you’ve worked for.", font("Fredoka", 66, 600), (255, 255, 255), 520, 72) + 18
    text_block(d, left, y, "A calm 12-month plan for after the weight-loss jab.", font("Nunito", 27, 700), (255, 246, 236), 470, 38)
    ph, sh = phone("01-today.png", 330)
    im.alpha_composite(ph, (fw - 330 - 70 - sh, 64 - sh))
    im.convert("RGB").save(OUT / "feature-graphic.png", optimize=True)


def icon():
    src = ROOT / "packages/design-system/assets/Logos/steadie-app-icon-1024.png"
    Image.open(src).convert("RGB").resize((512, 512), Image.LANCZOS).save(OUT / "icon-512.png", optimize=True)


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    for n, s in enumerate(SLIDES, 1):
        phone_slide(n, *s)
    cards_slide(len(SLIDES) + 1)
    feature_graphic()
    icon()
    for p in sorted(OUT.iterdir()):
        with Image.open(p) as im:
            print(p.name, im.size, im.mode)
