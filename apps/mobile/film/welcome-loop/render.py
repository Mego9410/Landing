"""Renders loop.html to the welcome screen's video, 1080 x 1350, 30 fps, H.264, no sound.

  python3 render.py light ../../assets/film/welcome-loop-light.mp4
  python3 render.py dark  ../../assets/film/welcome-loop-dark.mp4
  python3 render.py light prev/l 0,1.6,4.6      # still frames at those seconds instead, for checking

Then refresh the still each video starts on (shown before it plays, and with Reduce Motion):
  ffmpeg -y -i ../../assets/film/welcome-loop-light.mp4 -frames:v 1 -q:v 3 ../../assets/film/welcome-loop-light.jpg
"""
import asyncio, os, subprocess, sys
from playwright.async_api import async_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
scheme, out = sys.argv[1], sys.argv[2]
stills = [float(x) for x in sys.argv[3].split(",")] if len(sys.argv) > 3 else None
FPS, SCALE = 30, 1.5   # the page is 720 x 900


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 720, "height": 900}, device_scale_factor=SCALE)
        await pg.goto(f"file://{HERE}/loop.html?scheme={scheme}")
        await pg.wait_for_function("window.READY === true")
        if stills:
            for t in stills:
                await pg.evaluate(f"render({t})")
                await pg.screenshot(path=f"{out}_{t:05.2f}.png")
        else:
            n = int(round(await pg.evaluate("window.T") * FPS))
            ff = subprocess.Popen(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "image2pipe", "-framerate", str(FPS),
                                   "-i", "-", "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-profile:v", "high",
                                   "-pix_fmt", "yuv420p", "-movflags", "+faststart", out], stdin=subprocess.PIPE)
            for i in range(n):
                await pg.evaluate(f"render({i / FPS})")
                ff.stdin.write(await pg.screenshot(type="png"))
            ff.stdin.close(); ff.wait()
        await b.close()

asyncio.run(main())
