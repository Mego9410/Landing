/* Meals: the week's meal plan (M1), a recipe (M2), the recipe library (M3), the shopping list (M4), swap and add
   sheets (M5, M6), food preferences (S7) and two onboarding steps (O7b, O7c). The planning is packages/engine,
   loaded as window.LandingFood (src/food.js); this file is only screens. Every recipe is a draft until the
   dietitian signs it off, and the prototype says so. */
(function () {
  'use strict';
  var LP = window.LP, html = LP.html, L = LP.L, Icon = LP.Icon, nav = LP.nav, set = LP.set, useApp = LP.useApp, toast = LP.toast;
  var U = LP.ui, Btn = U.Btn, Back = U.Back, Choices = U.Choices, Options = U.Options, Row = U.Row, Avatar = U.Avatar, TabBar = U.TabBar, Toggle = U.Toggle, Steps = U.Steps, Skip = U.Skip;
  var F = window.LandingFood;
  var SLOTS = ['breakfast', 'lunch', 'dinner', 'snack'];
  var SLOT_NAME = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack' };
  var SLOT_TINT = { breakfast: 'tint-butter', lunch: 'tint-sky', dinner: 'tint-apricot', snack: 'tint-sage' };
  var HUNGRY = { Morning: 'morning', Lunchtime: 'lunchtime', Afternoon: 'afternoon', Evening: 'evening', 'Late night': 'late-night' };
  var DEFAULTS = { goal: 'steady', diet: 'none', allergens: [], lactoseFree: false, aversions: [], kit: ['hob', 'oven', 'microwave', 'kettle'], maxMinutes: 20, household: 1, cookNights: 4, conditions: [], cuisines: [], budget: 3, joinedWeek: null, seed: 1, plan: null, ticked: {}, open: null, pick: null };
  var TODAY_INDEX = (new Date(Date.UTC(2026, 9, 5)).getUTCDay() + 6) % 7; // the prototype's fixed "today" is a Monday

  function prefs(s) { return Object.assign({}, DEFAULTS, s.food || {}); }
  function setFood(patch) { set(function (s) { s.food = Object.assign({}, DEFAULTS, s.food || {}, typeof patch === 'function' ? patch(prefs(s)) : patch); return s; }); }

  /* ---------- the person and their week, from app state ---------- */
  var profiles = new Map();
  function profileOf(s) {
    var f = prefs(s), week = LP.weekOf(s);
    var p = {
      weeksSinceLastDose: s.ob.status === 'stopped' ? week : 0,
      weeksOnPlan: Math.max(1, week - (f.joinedWeek || week) + 1),
      goal: s.settings.safeMode ? 'steady' : f.goal, diet: f.diet, allergens: f.allergens, lactoseFree: f.lactoseFree, dislikes: [],
      aversions: f.aversions, kit: f.kit, maxMinutes: f.maxMinutes, household: f.household,
      hungryTimes: (s.ob.hungryTimes || []).map(function (h) { return HUNGRY[h]; }).filter(Boolean),
      cookNights: f.cookNights, conditions: f.conditions, cuisines: f.cuisines, budget: f.budget, safeMode: !!s.settings.safeMode
    };
    var key = JSON.stringify(p);
    if (!profiles.has(key)) profiles.set(key, F.profile(p));
    return profiles.get(key);
  }
  function keyOf(s) { return JSON.stringify(profileOf(s)) + '#' + prefs(s).seed; }
  var weeks = new Map();
  function weekOf(s) {
    var f = prefs(s), key = keyOf(s);
    if (f.plan && f.plan.key === key) return f.plan.week;
    if (!weeks.has(key)) weeks.set(key, F.planWeek(profileOf(s), { seed: f.seed, includeDrafts: true }));
    return weeks.get(key);
  }
  function saveWeek(s, week) { s.food = Object.assign({}, DEFAULTS, s.food || {}); s.food.plan = { key: keyOf(s), week: week }; }
  function mealAt(week, day, slot) { return slot === 'snack' ? week.days[day].snacks[0] : week.days[day][slot]; }
  function px(s, id) { return F.personaliseById(id, profileOf(s)); }

  function protein(s, n) { return s.settings.safeMode ? 'protein-rich' : 'about ' + n + ' g protein'; }
  // Batch recipes say their hands-on time: the rest is simmering, and it makes several meals.
  function minutes(r) { return r.total <= 1 ? 'No cooking' : r.serves >= 4 ? r.handsOn + ' min hands-on' : r.total + ' min'; }
  var GOAL_LINE = { steady: 'to help you hold steady', strength: 'to help you build strength', fuller: 'to help you feel fuller for longer' };
  function openRecipe(id, from) { set(function (s) { s.food = Object.assign({}, DEFAULTS, s.food || {}); s.food.open = Object.assign({ id: id }, from || {}); return s; }); nav.go('recipe'); }

  function Draft(p) {
    return html`<div class="banner tint-butter" role="note" style=${p.style}><${Icon} name="doc" size=${18} /><span class="caption grow">Recipes are drafts until our dietitian has checked them. Nutrition is approximate.</span></div>`;
  }

  /* ---------- M1 This week's meals ---------- */
  function MealRow(p) {
    var s = useApp(), m = p.meal, slot = p.slot;
    var label = html`<span class="label muted">${SLOT_NAME[slot].toUpperCase()}</span>`;
    if (!m || (!m.recipe && m.kind === 'free')) {
      return html`<div class="li" style=${{ alignItems: 'flex-start' }}>
        <span class="grow stack" style=${{ gap: 2 }}>${label}<span class="strong">Nothing planned</span><span class="caption muted">Pick something, or leave it free.</span></span>
        <${Btn} size="sm" variant="secondary" onClick=${function () { nav.sheet('meal-swap', p.day + ':' + slot); }}>Pick<//></div>`;
    }
    var x = px(s, m.recipe), r = x.recipe;
    var meta = m.kind === 'leftover' ? 'Leftovers from ' + F.DAYS[m.from] + ' · ' + protein(s, x.nutrition.protein) : minutes(r) + ' · ' + protein(s, x.nutrition.protein);
    return html`<div class="li" style=${{ alignItems: 'center', paddingRight: 8 }}>
      <button type="button" class="linkish grow stack" style=${{ gap: 2 }} onClick=${function () { openRecipe(m.recipe, { day: p.day, slot: slot }); }}>
        ${label}<span class="strong">${x.name}</span><span class="caption muted">${meta}${m.cook > 1 && m.kind === 'cook' ? ' · cook ' + m.cook + ' portions' : ''}</span>
      </button>
      <${Btn} size="sm" variant="quiet" onClick=${function () { nav.sheet('meal-swap', p.day + ':' + slot); }}>Swap<//>
    </div>`;
  }

  function Takeaway() {
    var o = React.useState(false), open = o[0], setOpen = o[1];
    var tips = F.orderingWell;
    return html`<div class="card tint-butter" style=${{ gap: 8 }}>
      <span class="label">DINNER · TAKEAWAY NIGHT</span>
      <span class="strong" style=${{ fontSize: 16 }}>A night off cooking, planned in</span>
      <span class="body">Enjoy it. A takeaway is part of a steady week.</span>
      <button type="button" class="linkish caption" style=${{ textDecoration: 'underline', alignSelf: 'flex-start' }} aria-expanded=${open} onClick=${function () { setOpen(!open); }}>${open ? 'Hide ideas for ordering' : 'Ideas for ordering'}</button>
      ${open ? html`<div class="stack" style=${{ gap: 6 }}>${Object.keys(tips).map(function (k) { return html`<p key=${k} class="caption"><span class="strong">${k}.</span> ${tips[k]}</p>`; })}</div>` : null}
    </div>`;
  }

  function Meals() {
    var s = useApp(), p = profileOf(s), t = F.targets(p), week = weekOf(s), safe = s.settings.safeMode;
    var d = React.useState(TODAY_INDEX), day = d[0], setDay = d[1];
    var today = week.days[day], tot = F.dayTotals(today, p), sum = F.weekSummary(week, p);
    var cooks = week.days.filter(function (x) { return x.dinner.kind === 'cook'; }).length;
    function shuffle() { setFood(function (f) { return { seed: (f.seed || 1) + 1, plan: null }; }); toast('Here’s a fresh week. Your preferences stay the same.'); }
    return html`<div class="scr">
      <div class="topbar"><${Back} fallback="plan" /><${L.Chip} tone="apricot">Week ${LP.weekOf(s)} · ${{ land: 'Land', settle: 'Settle', steady: 'Steady' }[t.phase]}<//><${Avatar} /></div>
      <div class="stack" style=${{ gap: 6 }}>
        <h1 class="t-title">This week's meals</h1>
        <p class="body muted">${cooks} dinners to cook, leftovers, a takeaway night and a free night. Planned ${GOAL_LINE[p.goal]}.</p>
      </div>
      <div class="card tint-sage" style=${{ gap: 8 }}>
        <span class="label">THIS WEEK'S AIM</span>
        ${safe ? html`<span class="body-lg">Protein at every meal, a little more fibre each week, and plenty to drink.</span>`
          : html`<span class="body-lg">About ${t.protein.lunch} g of protein a meal. Fibre: about ${t.fibreDay} g a day${t.fibreDay < t.fibreGoal ? ', building to ' + t.fibreGoal + ' g' : ''}.</span>`}
        ${t.notes.slice(0, 1).map(function (n) { return html`<span key=${n} class="caption">${n}</span>`; })}
      </div>
      <div class="cal" role="tablist" aria-label="Day">${week.days.map(function (x, i) {
        return html`<button key=${i} type="button" role="tab" aria-selected=${i === day} class=${'cal-btn' + (i === day ? ' on' : '')} onClick=${function () { setDay(i); }}>
          <span style=${{ display: 'block', fontSize: 12 }}>${x.name.slice(0, 3)}</span></button>`;
      })}</div>
      <div class="stack" style=${{ gap: 2 }}><h2 class="t-heading">${today.name}${day === TODAY_INDEX ? ' · today' : ''}</h2>${safe ? null : html`<span class="caption muted">Planned meals: about ${tot.protein} g protein and ${tot.fibre} g fibre</span>`}</div>
      <div class="list">
        <${MealRow} key=${'b' + day} day=${day} slot="breakfast" meal=${today.breakfast} />
        <${MealRow} key=${'l' + day} day=${day} slot="lunch" meal=${today.lunch} />
        ${today.dinner.kind === 'cook' || today.dinner.kind === 'leftover' ? html`<${MealRow} key=${'d' + day} day=${day} slot="dinner" meal=${today.dinner} />` : null}
        ${today.snacks.map(function (m, i) { return html`<${MealRow} key=${'s' + day + i} day=${day} slot="snack" meal=${m} />`; })}
      </div>
      ${today.dinner.kind === 'takeaway' ? html`<${Takeaway} />` : null}
      ${today.dinner.kind === 'free' ? html`<div class="card tint-sunk" style=${{ gap: 8 }}>
        <span class="label muted">DINNER · FREE NIGHT</span>
        <span class="body">Eat out, have something from the freezer, or pick a recipe.</span>
        <${Btn} size="sm" variant="secondary" style=${{ alignSelf: 'flex-start' }} onClick=${function () { nav.sheet('meal-swap', day + ':dinner'); }}>Pick a recipe<//></div>` : null}
      ${sum.notes.map(function (n) { return html`<div key=${n} class="banner tint-sunk" role="note"><span class="caption">${n}</span></div>`; })}
      <div class="stack" style=${{ gap: 8 }}>
        <${Btn} block icon="basket" onClick=${function () { nav.go('shopping'); }}>Shopping list<//>
        <div class="grid2">
          <${Btn} variant="secondary" icon="shuffle" onClick=${shuffle}>New week<//>
          <${Btn} variant="secondary" onClick=${function () { setFood({ pick: null }); nav.go('recipes'); }}>All recipes<//>
        </div>
        <${Btn} variant="quiet" size="sm" style=${{ alignSelf: 'center' }} onClick=${function () { nav.go('food-prefs'); }}>Food preferences<//>
      </div>
      <${Draft} />
      <${TabBar} active="plan" />
    </div>`;
  }

  /* ---------- M2 Recipe ---------- */
  function Recipe() {
    var s = useApp(), f = prefs(s), p = profileOf(s), open = f.open || { id: 'yoghurt-bowl' };
    var x = px(s, open.id), r = x.recipe, n = x.nutrition, safe = s.settings.safeMode;
    var week = weekOf(s);
    var planned = open.day != null && open.slot ? mealAt(week, open.day, open.slot) : null;
    var inPlan = planned && planned.recipe === r.id;
    var st = React.useState(inPlan && planned.cook ? planned.cook : r.slot === 'dinner' ? p.household : 1), portions = st[0], setPortions = st[1];
    var lines = x.lines.concat(x.topUp ? [{ i: x.topUp.i, g: x.topUp.g, topUp: true }] : []);
    var allergens = []; lines.forEach(function (l) { F.ingredient[l.i].allergens.forEach(function (a) { if (allergens.indexOf(a) < 0) allergens.push(a); }); });
    var swapped = {}; x.swaps.forEach(function (sw) { swapped[sw.to] = sw; });
    var why = F.reasons(x, p, week);
    var picking = f.pick;
    function use(dayIdx, slot) {
      set(function (s) { saveWeek(s, F.replaceMeal(weekOf(s), profileOf(s), dayIdx, slot, r.id)); s.food.pick = null; return s; });
      toast(x.name + ' is on for ' + F.DAYS[dayIdx] + '. Your shopping list is updated.');
      nav.reset('meals');
    }
    var veg = Math.floor(n.vegGrams / 80);
    return html`<div class="scr" style=${{ gap: 18 }}>
      <div class="topbar"><${Back} fallback="meals" /><span class=${'pill-tag ' + SLOT_TINT[r.slot]}>${SLOT_NAME[r.slot]}</span><span style=${{ width: 44 }}></span></div>
      <div class="stack" style=${{ gap: 6 }}>
        <h1 class="t-title">${x.name}</h1>
        <p class="body-lg muted">${r.blurb}</p>
        <div class="wrap">
          <span class="pill-tag tint-sunk">${r.handsOn} min hands-on${r.total > r.handsOn ? ', ' + r.total + ' total' : ''}</span>
          <span class="pill-tag tint-sunk">${r.washUp} to wash up</span>
          ${r.serves > 1 ? html`<span class="pill-tag tint-sunk">Makes ${r.serves}</span>` : null}
          <span class="pill-tag tint-sunk">${r.cuisine}</span>
        </div>
      </div>
      ${safe ? html`<div class="card" style=${{ gap: 6 }}>
          ${n.protein >= 20 ? html`<span class="row" style=${{ gap: 8 }}><${Icon} name="check" size=${18} style=${{ color: 'var(--sage-ink)' }} /><span class="strong">Protein-rich</span></span>` : null}
          ${veg ? html`<span class="row" style=${{ gap: 8 }}><${Icon} name="check" size=${18} style=${{ color: 'var(--sage-ink)' }} /><span class="strong">${veg === 1 ? 'A portion of veg' : veg + ' portions of veg'}</span></span>` : null}
        </div>`
        : html`<div class="grid3">
          ${[['Protein', n.protein + ' g'], ['Fibre', n.fibre + ' g'], p.conditions.indexOf('type-2-diabetes') >= 0 ? ['Carbs', n.carbs + ' g'] : ['Veg portions', String(veg)]].map(function (c) {
            return html`<div key=${c[0]} class="card tint-sunk" style=${{ padding: 12, gap: 2, alignItems: 'center', textAlign: 'center' }}><span class="t-heading">${c[1]}</span><span class="caption muted">${c[0]}</span></div>`;
          })}
        </div>`}
      ${safe ? null : html`<p class="caption muted" style=${{ marginTop: -8 }}>Per portion, approximate.</p>`}
      ${why.length ? html`<div class="card tint-sage" style=${{ gap: 6 }}>
        <span class="label">WHY IT SUITS YOU</span>
        ${why.map(function (w) { return html`<span key=${w} class="bullet"><span class="dot" style=${{ background: 'var(--on-pastel)' }}></span><span class="body">${w}</span></span>`; })}
      </div>` : null}
      <div class="stack" style=${{ gap: 8 }}>
        <div class="between"><h2 class="t-heading">Ingredients</h2>
          <div class="row" style=${{ gap: 6 }} role="group" aria-label="Portions">
            <button type="button" class="iconbtn" aria-label="Fewer portions" disabled=${portions <= 1} onClick=${function () { setPortions(Math.max(1, portions - 1)); }}>–</button>
            <span class="strong" aria-live="polite" style=${{ minWidth: 70, textAlign: 'center' }}>${portions} ${portions === 1 ? 'portion' : 'portions'}</span>
            <button type="button" class="iconbtn" aria-label="More portions" disabled=${portions >= 8} onClick=${function () { setPortions(Math.min(8, portions + 1)); }}><${Icon} name="plus" size=${18} /></button>
          </div>
        </div>
        <div class="list">${lines.map(function (l, i) {
          var ing = F.ingredient[l.i], sw = swapped[l.i];
          return html`<div key=${l.i + i} class="li" style=${{ alignItems: 'flex-start' }}>
            <span class="grow stack" style=${{ gap: 2 }}>
              <span class="strong">${ing.name}${l.optional ? html`<span class="muted" style=${{ fontWeight: 600 }}> (if you like)</span>` : null}</span>
              ${sw ? html`<span class="caption" style=${{ color: 'var(--sage-ink)' }}>Instead of ${F.ingredient[sw.from].name.toLowerCase()}, for ${sw.why}${sw.note ? '. ' + sw.note : ''}</span>` : null}
              ${l.topUp ? html`<span class="caption" style=${{ color: 'var(--sage-ink)' }}>${x.topUp.label}, to keep the protein up</span>` : null}
              ${ing.pantry ? html`<span class="caption muted">From the cupboard</span>` : null}
            </span>
            <span class="caption" style=${{ whiteSpace: 'nowrap', paddingTop: 2 }}>${F.quantity(l.i, l.g * portions)}</span>
          </div>`;
        })}</div>
        ${allergens.length ? html`<p class="caption muted">Contains ${allergens.map(function (a) { return F.LABELS.allergen[a].toLowerCase(); }).join(', ')}. Always check the labels, as products change.</p>` : html`<p class="caption muted">None of the 14 main allergens in these ingredients. Always check the labels, as products change.</p>`}
      </div>
      <div class="stack" style=${{ gap: 8 }}>
        <h2 class="t-heading">Method</h2>
        ${x.swaps.length ? html`<div class="card tint-sunk" style=${{ gap: 4, padding: '12px 14px' }}>
          <span class="label muted">MADE FOR YOU</span>
          ${x.swaps.map(function (sw) { return html`<p key=${sw.to} class="body">Use the ${F.plainName(sw.to)} where the method says ${F.plainName(sw.from)}.${sw.note && !/top-up/.test(sw.note) ? ' ' + sw.note + '.' : ''}</p>`; })}
        </div>` : null}
        ${r.steps.map(function (st, i) { return html`<div key=${i} class="row" style=${{ alignItems: 'flex-start' }}><span class="pill-tag tint-apricot" style=${{ width: 26, justifyContent: 'center', padding: 0, flex: 'none' }}>${i + 1}</span><p class="body grow">${st}</p></div>`; })}
        <p class="caption muted">${r.fridgeDays ? 'Keeps ' + r.fridgeDays + (r.fridgeDays === 1 ? ' day' : ' days') + ' in the fridge' : 'Best eaten fresh'}${r.freezes ? ' · Freezes' : ''}</p>
        ${r.storeCupboard ? html`<p class="caption muted"><span class="strong">From the store cupboard:</span> ${r.storeCupboard}</p>` : null}
      </div>
      <${Draft} />
      <div class="foot">
        ${picking ? html`<${Btn} block onClick=${function () { use(picking.day, picking.slot); }}>Use this for ${F.DAYS[picking.day]}<//>`
          : inPlan ? html`<${Btn} block variant="secondary" onClick=${function () { nav.sheet('meal-swap', open.day + ':' + open.slot); }}>Swap this meal<//>`
          : html`<${Btn} block onClick=${function () { nav.sheet('add-meal', r.id); }}>Add to my week<//>`}
      </div>
    </div>`;
  }

  /* ---------- M3 Recipes ---------- */
  function Recipes() {
    var s = useApp(), f = prefs(s), p = profileOf(s);
    var q = React.useState(''), query = q[0], setQuery = q[1];
    var sl = React.useState(f.pick ? f.pick.slot : 'all'), slot = sl[0], setSlot = sl[1];
    var co = React.useState(null), coll = co[0], setColl = co[1];
    var al = React.useState(false), all = al[0], setAll = al[1];
    var lib = F.library(p, { all: true, includeDrafts: true });
    var shown = lib.filter(function (x) {
      var r = x.recipe;
      if (slot !== 'all' && r.slot !== slot) return false;
      if (coll === 'quick' ? r.total > 10 : coll && r.collections.indexOf(coll) < 0) return false;
      if (query && (x.name + ' ' + r.blurb + ' ' + r.cuisine).toLowerCase().indexOf(query.toLowerCase()) < 0) return false;
      return all || x.ok;
    });
    var suits = lib.filter(function (x) { return x.ok; }).length;
    return html`<div class="scr" style=${{ gap: 16 }}>
      <div class="topbar"><${Back} fallback="meals" onClick=${function () { setFood({ pick: null }); nav.back('meals'); }} /><span class="caption muted">${suits} of ${lib.length} suit you</span><span style=${{ width: 44 }}></span></div>
      <h1 class="t-title">${f.pick ? 'Choose ' + SLOT_NAME[f.pick.slot].toLowerCase() + ' for ' + F.DAYS[f.pick.day] : 'Recipes'}</h1>
      <${L.TextField} id="recipe-search" label="Search recipes" placeholder="Try chilli, salmon or no-cook" value=${query} onChange=${function (e) { setQuery(e.target.value); }} />
      ${f.pick ? null : html`<div class="wrap" role="radiogroup" aria-label="Meal">${['all'].concat(SLOTS).map(function (k) {
        return html`<button key=${k} type="button" role="radio" aria-checked=${slot === k} class=${'choice sm' + (slot === k ? ' on' : '')} onClick=${function () { setSlot(k); }}>${k === 'all' ? 'All meals' : SLOT_NAME[k] + (k === 'snack' ? 's' : '')}</button>`;
      })}</div>`}
      <p class="label muted" style=${{ marginBottom: -8 }}>COLLECTIONS</p>
      <div class="wrap" role="group" aria-label="Collections">${F.COLLECTIONS.map(function (c) {
        return html`<button key=${c.id} type="button" class=${'choice sm' + (coll === c.id ? ' on' : '')} aria-pressed=${coll === c.id} onClick=${function () { setColl(coll === c.id ? null : c.id); }}>${c.label}</button>`;
      })}</div>
      <div class="stack" style=${{ gap: 10 }}>
        ${shown.length ? shown.map(function (x) {
          var r = x.recipe;
          return html`<button key=${r.id} type="button" class="card rowcard" style=${{ opacity: x.ok ? 1 : 0.6, alignItems: 'flex-start' }} onClick=${function () { openRecipe(r.id, f.pick || {}); }}>
            <span class=${'ico ' + SLOT_TINT[r.slot]} style=${{ width: 44, height: 44, borderRadius: 9999, display: 'grid', placeItems: 'center', flex: 'none' }}><${Icon} name="meal" size=${20} /></span>
            <span class="grow stack" style=${{ gap: 2 }}>
              <span class="strong">${x.name}</span>
              <span class="caption muted">${minutes(r)} · ${protein(s, x.nutrition.protein)}${x.swaps.length ? ' · adapted for you' : ''}</span>
              ${x.ok ? null : html`<span class="caption" style=${{ color: 'var(--rose-ink)' }}>Not for you: ${x.blocked.join(', ')}</span>`}
            </span>
          </button>`;
        }) : html`<p class="body muted">No recipes match. Try another search or clear a filter.</p>`}
      </div>
      <div class="li" style=${{ padding: '4px 0', border: 0 }}>
        <span class="grow body">Show recipes that don't suit me</span>
        <${Toggle} on=${all} label="Show recipes that don't suit me" onClick=${function () { setAll(!all); }} />
      </div>
      <${Draft} />
    </div>`;
  }

  /* ---------- M4 Shopping list ---------- */
  function Shopping() {
    var s = useApp(), f = prefs(s), p = profileOf(s), week = weekOf(s), list = F.shoppingList(week, p);
    var ticked = f.ticked || {};
    function tick(id) { setFood(function (f) { var t = Object.assign({}, f.ticked); if (t[id]) delete t[id]; else t[id] = true; return { ticked: t }; }); }
    var total = list.aisles.reduce(function (a, x) { return a + x.items.length; }, 0), done = list.aisles.reduce(function (a, x) { return a + x.items.filter(function (i) { return ticked[i.id]; }).length; }, 0);
    return html`<div class="scr" style=${{ gap: 16 }}>
      <div class="topbar"><${Back} fallback="meals" /><span class="caption muted">${done} of ${total} ticked</span><span style=${{ width: 44 }}></span></div>
      <div class="stack" style=${{ gap: 6 }}>
        <h1 class="t-title">Shopping list</h1>
        <p class="body muted">Everything for this week's meals, in aisle order, for ${p.household === 1 ? 'one' : p.household + ' people'} at dinner. Amounts are rounded up to what's sold.</p>
      </div>
      ${list.aisles.map(function (a) {
        return html`<div key=${a.aisle} class="stack" style=${{ gap: 8 }}>
          <p class="label muted">${a.aisle.toUpperCase()}</p>
          <div class="list">${a.items.map(function (it) {
            var on = !!ticked[it.id];
            return html`<button key=${it.id} type="button" class="li" role="checkbox" aria-checked=${on} onClick=${function () { tick(it.id); }} style=${{ alignItems: 'flex-start' }}>
              <span style=${{ width: 26, height: 26, flex: 'none', borderRadius: 8, marginTop: 1, display: 'grid', placeItems: 'center', background: on ? 'var(--sage-ink)' : 'transparent', boxShadow: on ? 'none' : 'inset 0 0 0 2px var(--ink-muted)', color: 'var(--surface-raised)' }}>${on ? html`<${Icon} name="check" size=${16} w=${2.6} />` : null}</span>
              <span class="grow stack" style=${{ gap: 2, opacity: on ? 0.55 : 1 }}>
                <span class="strong" style=${{ textDecoration: on ? 'line-through' : 'none' }}>${it.name}</span>
                <span class="caption muted">${it.detail ? it.detail + ' · ' : ''}${it.recipes.join(', ')}</span>
              </span>
              <span class="caption" style=${{ whiteSpace: 'nowrap', paddingTop: 2 }}>${it.label}</span>
            </button>`;
          })}</div>
        </div>`;
      })}
      ${list.pantry.length ? html`<div class="card tint-sunk" style=${{ gap: 6 }}>
        <span class="label muted">CHECK THE CUPBOARD</span>
        <span class="body">${list.pantry.join(', ')}</span>
      </div>` : null}
      ${list.batchNotes.map(function (n) { return html`<p key=${n} class="caption muted">${n}</p>`; })}
      <p class="caption muted">Products and prices vary. Always check labels for allergens. Sending this list to your supermarket comes next.</p>
      ${done ? html`<${Btn} variant="quiet" size="sm" style=${{ alignSelf: 'center' }} onClick=${function () { setFood({ ticked: {} }); }}>Untick everything<//>` : null}
    </div>`;
  }

  /* ---------- M5 Swap a meal, M6 Add to my week (sheets) ---------- */
  function SwapMeal() {
    var s = useApp(), parts = String(s.sheet.data || '0:dinner').split(':'), day = +parts[0], slot = parts[1];
    var p = profileOf(s), week = weekOf(s), current = mealAt(week, day, slot);
    var options = F.swapOptions(week, p, day, slot, { n: 3, includeDrafts: true, seed: prefs(s).seed });
    function choose(id) {
      set(function (s) { saveWeek(s, F.replaceMeal(weekOf(s), profileOf(s), day, slot, id)); s.sheet = null; return s; });
      toast('Swapped for ' + F.DAYS[day] + '. Your shopping list is updated.');
    }
    return html`<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="ms-title">
      <span class="grab"></span>
      <div class="between">
        <h1 id="ms-title" class="t-heading" style=${{ fontSize: 24, lineHeight: '30px' }}>${current && current.recipe ? 'Swap ' : 'Pick '}${F.DAYS[day]}'s ${SLOT_NAME[slot].toLowerCase()}</h1>
        <button type="button" class="iconbtn" aria-label="Close" onClick=${function () { nav.sheet(null); }}><${Icon} name="close" /></button>
      </div>
      ${current && current.recipe ? html`<div class="card tint-sunk" style=${{ padding: '12px 16px', gap: 2 }}><span class="caption muted">${current.kind === 'leftover' ? 'Leftovers, instead of' : 'Instead of'}</span><span class="strong">${px(s, current.recipe).name}</span></div>` : null}
      <p class="caption muted">Similar effort, enough protein, and suits your preferences.</p>
      <div class="stack" style=${{ gap: 8 }}>${options.map(function (x) {
        return html`<button key=${x.recipe.id} type="button" class="option" onClick=${function () { choose(x.recipe.id); }}>
          <span class=${'ico ' + SLOT_TINT[slot]} style=${{ width: 40, height: 40, borderRadius: 9999, display: 'grid', placeItems: 'center', flex: 'none' }}><${Icon} name="meal" size=${18} /></span>
          <span class="grow" style=${{ display: 'flex', flexDirection: 'column', gap: 2 }}><span style=${{ fontWeight: 800 }}>${x.name}</span><span class="caption muted">${minutes(x.recipe)} · ${protein(s, x.nutrition.protein)}</span></span>
        </button>`;
      })}</div>
      <${Btn} block variant="secondary" onClick=${function () { setFood({ pick: { day: day, slot: slot } }); nav.go('recipes'); }}>See all ${SLOT_NAME[slot].toLowerCase()} recipes<//>
    </div>`;
  }

  function AddMeal() {
    var s = useApp(), id = s.sheet.data, x = px(s, id), slot = x.recipe.slot, week = weekOf(s);
    function use(d) {
      set(function (s) { saveWeek(s, F.replaceMeal(weekOf(s), profileOf(s), d, slot, id)); s.sheet = null; return s; });
      toast(x.name + ' is on for ' + F.DAYS[d] + '. Your shopping list is updated.');
    }
    return html`<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="am-title">
      <span class="grab"></span>
      <div class="between">
        <h1 id="am-title" class="t-heading" style=${{ fontSize: 24, lineHeight: '30px' }}>Which day?</h1>
        <button type="button" class="iconbtn" aria-label="Close" onClick=${function () { nav.sheet(null); }}><${Icon} name="close" /></button>
      </div>
      <p class="caption muted">${x.name} replaces that day's ${SLOT_NAME[slot].toLowerCase()}.</p>
      <div class="list">${week.days.map(function (d, i) {
        var m = mealAt(week, i, slot);
        var now = m && m.recipe ? px(s, m.recipe).name : m && m.kind === 'takeaway' ? 'Takeaway night' : 'Nothing planned';
        return html`<${Row} key=${i} title=${d.name} sub=${now} onClick=${function () { use(i); }} />`;
      })}</div>
    </div>`;
  }

  /* ---------- S7 Food preferences, and the pickers onboarding shares ---------- */
  var DIETS = ['none', 'vegetarian', 'vegan', 'pescatarian', 'halal', 'kosher', 'veg-no-egg', 'jain'];
  var ALLERGENS = ['gluten', 'milk', 'eggs', 'peanuts', 'tree-nuts', 'sesame', 'soya', 'fish', 'crustaceans', 'molluscs', 'mustard', 'celery', 'lupin', 'sulphites'];
  var AVERSIONS = ['spicy', 'rich', 'strong-smells', 'meat', 'fish', 'eggs', 'dairy'];
  var KIT = ['hob', 'oven', 'air-fryer', 'microwave', 'kettle'];
  var CONDITIONS = ['type-2-diabetes', 'high-blood-pressure', 'reflux'];
  var TIMES = [[10, '10 min'], [15, '15 min'], [20, '20 min'], [30, '30 min']];

  // Choices works on labels; these map labels to ids and back.
  function Multi(p) {
    var labels = p.ids.map(function (id) { return p.names[id]; });
    return html`<${Choices} multi sm label=${p.label} options=${labels} value=${p.value.map(function (id) { return p.names[id]; })}
      onChange=${function (v) { p.onChange(p.ids.filter(function (id) { return v.indexOf(p.names[id]) >= 0; })); }} />`;
  }
  function One(p) {
    var labels = p.ids.map(function (id) { return p.names[id]; });
    return html`<${Choices} sm label=${p.label} options=${labels} value=${p.names[p.value]} onChange=${function (v) { p.onChange(p.ids[labels.indexOf(v)]); }} />`;
  }
  function GoalPicker() {
    var s = useApp(), f = prefs(s);
    var opts = [
      { id: 'steady', title: 'Hold steady', detail: 'Protein at every meal and a rhythm that keeps hunger predictable' },
      { id: 'strength', title: 'Build strength', detail: 'A little more protein, to go with your strength sessions' },
      { id: 'fuller', title: 'Feel fuller for longer', detail: 'More fibre and veg, and a snack at your hungriest time' }
    ];
    return html`<${Options} gap=${8} label="What food should do for you" style=${{ padding: '14px 16px' }} value=${f.goal} onChange=${function (v) { setFood({ goal: v, plan: null }); }} options=${opts} />`;
  }
  function DietPicker() {
    var s = useApp(), f = prefs(s);
    return html`<div class="stack" style=${{ gap: 16 }}>
      <div class="stack" style=${{ gap: 8 }}><p class="label">YOUR DIET</p>
        <${One} label="Diet" ids=${DIETS} names=${F.LABELS.diet} value=${f.diet} onChange=${function (v) { setFood({ diet: v, plan: null }); }} /></div>
      <div class="stack" style=${{ gap: 8 }}><p class="label">ALLERGIES</p>
        <${Multi} label="Allergies" ids=${ALLERGENS} names=${F.LABELS.allergen} value=${f.allergens} onChange=${function (v) { setFood({ allergens: v, plan: null }); }} />
        <div class="li" style=${{ padding: '4px 0', border: 0 }}><span class="grow body">Lactose intolerant (not an allergy)</span><${Toggle} on=${f.lactoseFree} label="Lactose intolerant" onClick=${function () { setFood({ lactoseFree: !f.lactoseFree, plan: null }); }} /></div>
        <p class="caption muted">Allergies are a hard filter on every ingredient. Always check labels too.</p></div>
      <div class="stack" style=${{ gap: 8 }}><p class="label">ANYTHING YOU CAN'T FACE AT THE MOMENT?</p>
        <${Multi} label="Foods you can't face" ids=${AVERSIONS} names=${F.LABELS.aversion} value=${f.aversions} onChange=${function (v) { setFood({ aversions: v, plan: null }); }} />
        <p class="caption muted">Common after the jab. We'll check in again in eight weeks.</p></div>
    </div>`;
  }
  function KitchenPicker() {
    var s = useApp(), f = prefs(s);
    var timeNames = {}; TIMES.forEach(function (t) { timeNames[t[0]] = t[1]; });
    var people = { 1: 'Just me', 2: '2', 3: '3', 4: '4', 5: '5 or more' };
    var nights = { 3: '3 nights', 4: '4 nights', 5: '5 nights' };
    return html`<div class="stack" style=${{ gap: 16 }}>
      <div class="stack" style=${{ gap: 8 }}><p class="label">YOUR KITCHEN</p>
        <${Multi} label="Kitchen kit" ids=${KIT} names=${F.LABELS.kit} value=${f.kit} onChange=${function (v) { setFood({ kit: v.length ? v : ['microwave'], plan: null }); }} /></div>
      <div class="stack" style=${{ gap: 8 }}><p class="label">LONGEST A WEEKDAY MEAL CAN TAKE</p>
        <${One} label="Time" ids=${TIMES.map(function (t) { return t[0]; })} names=${timeNames} value=${f.maxMinutes} onChange=${function (v) { setFood({ maxMinutes: v, plan: null }); }} /></div>
      <div class="stack" style=${{ gap: 8 }}><p class="label">HOW MANY EAT DINNER?</p>
        <${One} label="People at dinner" ids=${[1, 2, 3, 4, 5]} names=${people} value=${f.household} onChange=${function (v) { setFood({ household: v, plan: null }); }} /></div>
      <div class="stack" style=${{ gap: 8 }}><p class="label">DINNERS TO COOK A WEEK</p>
        <${One} label="Dinners to cook" ids=${[3, 4, 5]} names=${nights} value=${f.cookNights} onChange=${function (v) { setFood({ cookNights: v, plan: null }); }} />
        <p class="caption muted">The other nights are leftovers, a takeaway and a free night.</p></div>
    </div>`;
  }

  function FoodPrefs() {
    var s = useApp(), f = prefs(s);
    var cuisines = ['British', 'South Asian', 'Chinese', 'Thai', 'Japanese', 'Mexican', 'Italian', 'Mediterranean', 'Middle Eastern', 'Caribbean', 'West African', 'Eastern European', 'American'];
    var cn = {}; cuisines.forEach(function (c) { cn[c] = c; });
    var budget = { 1: 'Under £1.50', 2: 'Up to £2.50', 3: 'No limit' };
    return html`<div class="scr plain" style=${{ gap: 22 }}>
      <div class="topbar"><${Back} fallback="settings" /><span></span></div>
      <div class="stack" style=${{ gap: 6 }}><h1 class="t-title">Food preferences</h1><p class="body muted">Your meal plan and recipe swaps follow these. Changing them builds a fresh week.</p></div>
      ${s.settings.safeMode ? html`<div class="banner tint-sunk" role="note"><span class="caption">Safe mode is on, so meals are planned for holding steady and numbers stay hidden.</span></div>`
        : html`<div class="stack" style=${{ gap: 8 }}><p class="label">WHAT WOULD YOU LIKE FOOD TO DO FOR YOU?</p><${GoalPicker} /></div>`}
      <${DietPicker} />
      <${KitchenPicker} />
      <div class="stack" style=${{ gap: 8 }}><p class="label">ANY OF THESE?</p>
        <${Multi} label="Health" ids=${CONDITIONS} names=${F.LABELS.condition} value=${f.conditions} onChange=${function (v) { setFood({ conditions: v, plan: null }); }} />
        <p class="caption muted">These change which recipes we suggest, never your treatment. Pregnancy and kidney disease are handled in the safety questions.</p></div>
      <div class="stack" style=${{ gap: 8 }}><p class="label">CUISINES YOU'D LIKE MORE OF</p>
        <${Multi} label="Cuisines" ids=${cuisines} names=${cn} value=${f.cuisines} onChange=${function (v) { setFood({ cuisines: v, plan: null }); }} /></div>
      <div class="stack" style=${{ gap: 8 }}><p class="label">BUDGET PER PORTION</p>
        <${One} label="Budget" ids=${[1, 2, 3]} names=${budget} value=${f.budget} onChange=${function (v) { setFood({ budget: v, plan: null }); }} />
        <p class="caption muted">Estimates at 2026 prices. Your supermarket's price is the real one.</p></div>
      <${Btn} block onClick=${function () { nav.reset('meals'); }}>See my meals<//>
    </div>`;
  }

  /* ---------- O7b, O7c onboarding ---------- */
  function ObEating() {
    return html`<div class="scr plain">
      <${Skip} onClick=${function () { nav.go('ob-kitchen'); }} />
      <${Steps} n=${8} />
      <div class="stack">
        <h1 class="t-title">How you eat</h1>
        <p class="body muted">So every recipe we suggest works for you. You can change this any time in Settings.</p>
      </div>
      <${DietPicker} />
      <div class="foot"><${Btn} block onClick=${function () { nav.go('ob-kitchen'); }}>Continue<//></div>
    </div>`;
  }
  function ObKitchen() {
    return html`<div class="scr plain">
      <${Skip} onClick=${function () { nav.go('ob-consent'); }} />
      <${Steps} n=${9} />
      <div class="stack">
        <h1 class="t-title">Your kitchen and your week</h1>
        <p class="body muted">Meals are 20 minutes or less, with six ingredients or fewer. Tell us what you've got to work with.</p>
      </div>
      <${KitchenPicker} />
      <div class="foot"><${Btn} block onClick=${function () { nav.go('ob-consent'); }}>Continue<//></div>
    </div>`;
  }

  /* ---------- cards for Today and Plan ---------- */
  function TonightCard() {
    var s = useApp(), week = weekOf(s), m = week.days[TODAY_INDEX].dinner;
    if (m.kind === 'takeaway') return html`<${Takeaway} />`;
    if (!m.recipe) return html`<button type="button" class="card rowcard tint-sunk" onClick=${function () { nav.go('meals'); }}><span class="grow stack" style=${{ gap: 2 }}><span class="label muted">TONIGHT</span><span class="strong">A free night</span><span class="caption muted">Eat out, use the freezer or pick a recipe</span></span><${Icon} name="chevron" size=${20} /></button>`;
    var x = px(s, m.recipe);
    return html`<button type="button" class="card rowcard" onClick=${function () { openRecipe(m.recipe, { day: TODAY_INDEX, slot: 'dinner' }); }}>
      <span style=${{ width: 52, height: 52, borderRadius: 9999, background: 'var(--apricot)', display: 'grid', placeItems: 'center', color: 'var(--on-pastel)', flex: 'none' }}><${Icon} name="meal" size=${24} /></span>
      <span class="grow stack" style=${{ gap: 2 }}><span class="label muted">${m.kind === 'leftover' ? 'TONIGHT · LEFTOVERS' : 'TONIGHT'}</span><span style=${{ fontWeight: 800, fontSize: 16 }}>${x.name}</span><span class="caption muted">${m.kind === 'leftover' ? 'From ' + F.DAYS[m.from] : minutes(x.recipe) + ' · ' + protein(s, x.nutrition.protein)}</span></span>
      <${Icon} name="chevron" size=${20} />
    </button>`;
  }
  function PlanCard() {
    var s = useApp(), week = weekOf(s), cooks = week.days.filter(function (d) { return d.dinner.kind === 'cook'; }).length;
    return html`<button type="button" class="card rowcard tint-sky" onClick=${function () { nav.go('meals'); }}>
      <span class="grow stack" style=${{ gap: 2 }}><span class="label">MEALS THIS WEEK</span><span class="t-heading" style=${{ fontSize: 20 }}>${cooks} dinners, leftovers and a takeaway</span><span class="caption">Recipes, swaps and your shopping list</span></span>
      <${Icon} name="chevron" size=${20} />
    </button>`;
  }

  LP.food = { prefs: prefs, setFood: setFood, profileOf: profileOf, weekOf: weekOf, GoalPicker: GoalPicker, TonightCard: TonightCard, PlanCard: PlanCard, DEFAULTS: DEFAULTS };
  Object.assign(window.LP.screens, {
    meals: { c: Meals, id: 'M1', title: "This week's meals", group: 'Meals', tab: 'plan' },
    recipe: { c: Recipe, id: 'M2', title: 'Recipe', group: 'Meals' },
    recipes: { c: Recipes, id: 'M3', title: 'Recipes', group: 'Meals' },
    shopping: { c: Shopping, id: 'M4', title: 'Shopping list', group: 'Meals' },
    'food-prefs': { c: FoodPrefs, id: 'S7', title: 'Food preferences', group: 'Settings and account' },
    'ob-eating': { c: ObEating, id: 'O7b', title: 'How you eat', group: 'Onboarding' },
    'ob-kitchen': { c: ObKitchen, id: 'O7c', title: 'Your kitchen and your week', group: 'Onboarding' }
  });
  Object.assign(window.LP.sheets, { 'meal-swap': { c: SwapMeal, id: 'M5', title: 'Swap a meal' }, 'add-meal': { c: AddMeal, id: 'M6', title: 'Add to my week' } });
})();
