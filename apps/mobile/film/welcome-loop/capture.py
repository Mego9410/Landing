"""Captures the real app screens the welcome loop shows, from the app's web build, in demo mode (Hannah), UK wording.

  pnpm --filter @landing/mobile web:phone          # builds apps/mobile/dist
  (cd apps/mobile/dist && python3 -m http.server 8765 &)
  python3 capture.py light && python3 capture.py dark

Writes screens/<name>_<scheme>.png at 390 x 1000 points, 3x, with the tab bar hidden so the loop can scroll them:
today, today_ticked (only its "3 of 5 done today" pill is used), session (Strength A), plan and progress. The tab bar
itself goes to screens/tabs-<name>_<scheme>.png, on a transparent ground, for the loop to keep fixed at the bottom.
"""
import asyncio, os, sys
from playwright.async_api import async_playwright

BASE = "http://localhost:8765"
HERE = os.path.dirname(os.path.abspath(__file__))
scheme = sys.argv[1]
STATE = os.path.join(HERE, f".state_{scheme}.json")


def context(b, **extra):
    return b.new_context(viewport={"width": 390, "height": 1000}, device_scale_factor=3, color_scheme=scheme,
                         locale="en-GB", timezone_id="Europe/London", **extra)


MARK_NAV = """() => {
  const tab = document.querySelector('[role=tab]');
  let el = tab; while (el && getComputedStyle(el).position !== 'absolute') el = el.parentElement;
  if (el) el.setAttribute('data-nav', '1');
  return !!el;
}"""


async def shot(pg, name, tabs=False):
    await pg.wait_for_timeout(1200)
    has_nav = await pg.evaluate(MARK_NAV)
    if tabs and has_nav:
        style = await pg.add_style_tag(content="* { visibility: hidden !important } [data-nav], [data-nav] * { visibility: visible !important }")
        await pg.screenshot(path=os.path.join(HERE, "screens", f"tabs-{name}_{scheme}.png"), omit_background=True)
        await style.evaluate("s => s.remove()")
    style = await pg.add_style_tag(content="[data-nav] { visibility: hidden !important }")
    await pg.screenshot(path=os.path.join(HERE, "screens", f"{name}_{scheme}.png"))
    await style.evaluate("s => s.remove()")
    print(name, pg.url)


async def demo(b):
    """Welcome screen → hold the film for three seconds (demo) → accept the health information. Saves the state."""
    ctx = await context(b)
    pg = await ctx.new_page()
    await pg.goto(BASE + "/"); await pg.wait_for_timeout(3000)
    await pg.mouse.move(195, 220); await pg.mouse.down(); await pg.wait_for_timeout(3600); await pg.mouse.up()
    await pg.wait_for_timeout(3000)
    for label in ["not medical advice, and", "18 or over"]:
        await pg.get_by_text(label, exact=False).last.click(); await pg.wait_for_timeout(300)
    await pg.get_by_role("button", name="Continue").click(); await pg.wait_for_timeout(3000)
    await ctx.storage_state(path=STATE)
    await ctx.close()


async def fresh(b):
    ctx = await context(b, storage_state=STATE)
    pg = await ctx.new_page()
    await pg.goto(BASE + "/"); await pg.wait_for_timeout(2500)
    return ctx, pg


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        await demo(b)
        ctx, pg = await fresh(b)
        await shot(pg, "today", tabs=True)
        await pg.get_by_role("checkbox", name="Protein at breakfast", exact=False).first.click()
        await shot(pg, "today_ticked")
        await ctx.close()
        ctx, pg = await fresh(b)
        await pg.get_by_text("Start Strength A", exact=False).first.click(); await pg.wait_for_timeout(2000)
        await shot(pg, "session")
        await ctx.close()
        for tab in ["Plan", "Progress"]:
            ctx, pg = await fresh(b)
            await pg.get_by_text(tab, exact=True).last.click(); await pg.wait_for_timeout(2500)
            await shot(pg, tab.lower(), tabs=True)
            await ctx.close()
        await b.close()
    os.remove(STATE)

asyncio.run(main())
