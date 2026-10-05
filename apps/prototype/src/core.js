/* Landing prototype core: state, dummy data, navigation and shared UI pieces.
   Plain scripts, no build: React, ReactDOM, window.Landing (the design system bundle)
   and htm are globals loaded before this file. */
(function () {
  'use strict';
  var h = React.createElement;
  var html = htm.bind(h);
  var L = window.Landing;

  /* ---------- assets (the build swaps these for data URIs) ---------- */
  var ASSETS = Object.assign({
    mark: '../../packages/design-system/assets/Logos/landing-mark.svg',
    lockup: '../../packages/design-system/assets/Logos/landing-lockup.svg'
  }, window.LANDING_ASSETS || {});

  /* ---------- icons: the design system's 2px rounded line set plus the screens' extras ---------- */
  var ICON = {
    back: '<path d="M15 5l-7 7 7 7"/>',
    chevron: '<path d="M9 5l7 7-7 7"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    workout: '<path d="M7 8v8M17 8v8M4 10.5v3M20 10.5v3M7 12h10"/>',
    heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
    coach: '<path d="M7 4.5h10a3 3 0 0 1 3 3v5.5a3 3 0 0 1-3 3h-5.5L7.5 19.5V16H7a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3z"/>',
    progress: '<path d="M4 19.5h16"/><path d="M5 15l4.5-4.5 3.5 3 6-6"/>',
    drift: '<path d="M4 19.5h16"/><path d="M5 15l4.5-3 3.5 1.5 6-4"/>',
    hunger: '<path d="M4 11.5h16c0 4.4-3.6 8-8 8s-8-3.6-8-8z"/>',
    protein: '<circle cx="12" cy="12" r="4"/><path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21"/>',
    doc: '<path d="M7 3.5h7l4 4v13H7z"/><path d="M14 3.5v4h4"/>',
    list: '<path d="M7 3.5h7l4 4v13H7z"/><path d="M14 3.5v4h4M9.5 13h6M9.5 16.5h6"/>',
    send: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="3"/><path d="M4.5 7.5l7.5 5.5 7.5-5.5"/>',
    globe: '<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.5 2.5 2.5 13.5 0 16M12 4c-2.5 2.5-2.5 13.5 0 16"/>',
    lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="3"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
    trash: '<path d="M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12"/>',
    today: '<circle cx="12" cy="12" r="4"/><path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21M5.6 5.6l1.1 1.1M17.3 17.3l1.1 1.1M5.6 18.4l1.1-1.1M17.3 6.7l1.1-1.1"/>',
    plan: '<path d="M6 18.5c0-4 3-5 6-6.5s6-2.5 6-6.5"/><circle cx="6" cy="19" r="1.6"/><circle cx="18" cy="5" r="1.6"/>',
    clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 2.5"/>',
    offline: '<path d="M4 9a12 12 0 0 1 16 0M7 12.5a7.5 7.5 0 0 1 10 0M10 16a3 3 0 0 1 4 0"/><path d="M3 3l18 18"/>',
    reset: '<path d="M5 12a7 7 0 1 0 2.1-5"/><path d="M5 4.5V8h3.5"/>',
    pause: '<path d="M9 6v12M15 6v12"/>',
    play: '<path d="M8 5.5v13l10-6.5z"/>'
  };
  function Icon(p) {
    return h('svg', { width: p.size || 22, height: p.size || 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: p.w || 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, style: p.style, dangerouslySetInnerHTML: { __html: ICON[p.name] || '' } });
  }

  /* ---------- dates: the prototype runs on a fixed "today", as the designs do ---------- */
  var DAY = 864e5;
  var TODAY = '2026-10-05';
  var DOW = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function d(iso) { var p = iso.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function iso(dt) { return dt.toISOString().slice(0, 10); }
  function addDays(isoStr, n) { return iso(new Date(d(isoStr).getTime() + n * DAY)); }
  function daysBetween(a, b) { return Math.round((d(b) - d(a)) / DAY); }
  var fmt = {
    long: function (s) { var x = d(s); return DOW[x.getUTCDay()] + ' ' + x.getUTCDate() + ' ' + MON[x.getUTCMonth()]; },
    short: function (s) { var x = d(s); return DOW[x.getUTCDay()].slice(0, 3) + ' ' + x.getUTCDate() + ' ' + MON[x.getUTCMonth()].slice(0, 3); },
    dayMonth: function (s) { var x = d(s); return x.getUTCDate() + ' ' + MON[x.getUTCMonth()]; },
    dmy: function (s) { var x = d(s); return x.getUTCDate() + ' ' + MON[x.getUTCMonth()].slice(0, 3) + ' ' + x.getUTCFullYear(); },
    full: function (s) { var x = d(s); return x.getUTCDate() + ' ' + MON[x.getUTCMonth()] + ' ' + x.getUTCFullYear(); }
  };

  /* ---------- plan content ---------- */
  var PHASES = [
    { key: 'land', name: 'Land', from: 1, to: 8, tone: 'sky', focus: 'Appetite returning, protein at every meal, two strength sessions.', reveal: 'protein at every meal, two strength sessions' },
    { key: 'settle', name: 'Settle', from: 9, to: 26, tone: 'sage', focus: 'Meal structure, eating out, handling cravings, a third session.', reveal: 'meal structure, eating out, cravings' },
    { key: 'steady', name: 'Steady', from: 27, to: 52, tone: 'lilac', focus: 'Your own routines, fewer prompts, monthly check-ins.', reveal: 'your own routines, fewer prompts' }
  ];
  function phaseOf(week) { return PHASES.find(function (p) { return week <= p.to; }) || PHASES[2]; }

  // Each habit: kind 'days' counts days out of 5, 'sessions' counts strength sessions out of 2, 'plain' has a fixed note.
  var HABITS = {
    protein: { label: 'Protein at breakfast', kind: 'days', target: 5, note: '25 g or more' },
    strength: { label: 'Two strength sessions', kind: 'sessions', target: 2, note: '25 minutes at home' },
    pause: { label: 'Pause before seconds', kind: 'plain', target: 5, note: 'Wait 10 minutes, then decide' },
    walk: { label: 'Walk after dinner', kind: 'days', target: 5, note: '10 minutes' },
    plate: { label: 'Plate up once', kind: 'plain', target: 5, note: 'Serve in the kitchen, not at the table' },
    table: { label: 'Eat at the table', kind: 'plain', target: 5, note: 'Screens off for one meal a day' },
    water: { label: 'Water before dinner', kind: 'plain', target: 5, note: 'One glass while you cook' },
    proteinAll: { label: 'Protein at every meal', kind: 'days', target: 5, note: 'A palm-sized portion' },
    strength3: { label: 'Three strength sessions', kind: 'sessions', target: 3, note: 'The third one is optional' },
    mealplan: { label: 'Plan the week’s meals', kind: 'plain', target: 1, note: 'Ten minutes on Sunday' },
    ownRoutine: { label: 'Your own routine', kind: 'days', target: 5, note: 'The habits that stuck, your way' },
    resetProtein: { label: 'Protein at one meal a day', kind: 'plain', target: 7, note: 'Any meal you like' },
    resetWalk: { label: 'A 15-minute walk', kind: 'plain', target: 7, note: 'After the meal you’re hungriest at' },
    resetTable: { label: 'Eat dinner at the table', kind: 'plain', target: 7, note: 'Screens off, plate up once' }
  };
  var SWAPS = [
    { id: 'plate', title: 'Plate up once', detail: 'Serve in the kitchen, not at the table' },
    { id: 'walk', title: 'Ten-minute walk after dinner', detail: 'Helps the evening wind down' },
    { id: 'table', title: 'Eat at the table', detail: 'Screens off for one meal a day' },
    { id: 'water', title: 'Water before dinner', detail: 'One glass while you cook' }
  ];
  function habitsForWeek(week) {
    var p = phaseOf(week).key;
    if (p === 'land') return ['protein', 'strength', 'pause'];
    if (p === 'settle') return ['proteinAll', 'strength3', 'mealplan'];
    return ['ownRoutine', 'strength', 'pause'];
  }
  var LESSONS = {
    land: { title: 'Why protein matters more now', week: 'Protein first', blurb: 'As appetite returns, building meals around protein keeps you fuller and protects muscle.' },
    settle: { title: 'Meals that hold you steady', week: 'A rhythm for meals', blurb: 'Regular meals with protein and fibre make hunger easier to predict and plan around.' },
    steady: { title: 'Making it yours', week: 'Your own routines', blurb: 'The habits that stuck are now yours. Fewer prompts, same steady ground.' }
  };

  var SESSIONS = {
    A: { name: 'Strength A', moves: [
      { name: 'Sit to stand', anim: 'squat-2', sets: 3, reps: '10', cue: 'Sit back to a chair, stand tall, control the way down.' },
      { name: 'Wall press-up', anim: 'push-1', sets: 3, reps: '10', cue: 'Hands at shoulder height, body straight, lower slowly.' },
      { name: 'Step-up', anim: 'lunge-3', sets: 3, reps: '8 each leg', cue: 'Use a stair, push through the front heel.' },
      { name: 'Overhead band pull-apart', anim: 'pulldown-1', sets: 3, reps: '12', cue: 'Arms up, band taut. Pull it apart and down behind your head.' },
      { name: 'Side plank', anim: 'rotation-5', easier: 'rotation-3', sets: 2, reps: '20 seconds each side', cue: 'Knees down if you need, hips lifted.' }
    ] },
    B: { name: 'Strength B', moves: [
      { name: 'Goblet squat', anim: 'squat-4', sets: 3, reps: '10', cue: 'Hold the weight at your chest, sit between your heels, stand tall.' },
      { name: 'Glute bridge', anim: 'hinge-1', sets: 3, reps: '12', cue: 'Feet flat, push through your heels, squeeze at the top for a second.' },
      { name: 'Counter press-up', anim: 'push-2', sets: 3, reps: '8', cue: 'Hands on a worktop, body in one line. Lower your chest, press away.' },
      { name: 'One-arm row', anim: 'row-4', sets: 3, reps: '10 each arm', cue: 'Hand on a chair or bench, back flat. Pull the weight to your hip.' },
      { name: 'Dead bug', anim: 'core-2', sets: 2, reps: '8 each side', cue: 'Low back pressed down, reach opposite arm and leg away slowly.' }
    ] }
  };

  /* ---------- weight data ---------- */
  // The last eight entries match the weigh-in history design; earlier days follow the trend the progress design draws.
  var RECENT = [['2026-10-05', 78.4, 'Apple Health · 7:42'], ['2026-10-04', 78.6, 'Logged by you'], ['2026-10-03', 78.3, 'Apple Health · 8:10'], ['2026-10-02', 78.7, 'Apple Health · 7:35'], ['2026-10-01', 78.5, 'Apple Health · 7:50'], ['2026-09-30', 78.9, 'Logged by you'], ['2026-09-29', 78.6, 'Apple Health · 7:44'], ['2026-09-28', 78.8, 'Apple Health · 7:39']];
  function seedWeights() {
    var out = RECENT.map(function (r) { return { date: r[0], kg: r[1], source: r[2] }; });
    for (var i = 8; i < 95; i++) {
      // since the last injection: a gentle wobble near the lowest weight; before it: still coming down on the jab
      var v = i <= 35 ? 79.3 - 0.026 * (35 - i) + 0.22 * Math.sin(i * 1.1) + 0.12 * Math.sin(i * 0.37)
        : 78.2 + (i - 35) * 0.07 + 0.2 * Math.sin(i * 0.9);
      out.push({ date: addDays(TODAY, -i), kg: Math.round(v * 10) / 10, source: i % 4 === 1 ? 'Logged by you' : 'Apple Health · 7:' + (30 + (i * 7) % 29) });
    }
    return out;
  }
  function seedHunger() {
    var vals = [5, 3, 4, 4, 3, 4, 3, 3, 4, 4, 3, 4, 4, 3];
    return vals.map(function (v, i) { return { date: addDays(TODAY, -i), value: v }; });
  }

  /* ---------- state ---------- */
  var KEY = 'landing-prototype-v1';
  function freshOnboarding() {
    return { status: 'stopped', lastInjection: '2026-08-31', startWeight: '96.2', lowestWeight: '78.0', todayWeight: '78.4', height: '168',
      screening: [null, null, null, null, null], level: 'Some', days: '2', place: 'At home', proteinFreq: 'Some meals', hungryTimes: ['Afternoon', 'Evening'],
      consent: false, appleHealth: false, reminderTime: 'Afternoon · 15:30', remindersOn: false };
  }
  function blankState() {
    return {
      v: 1,
      auth: { signedIn: false, email: 'hannah.r@example.com', method: null },
      name: 'Hannah', surname: 'R.',
      onboarded: false,
      ob: freshOnboarding(),
      sub: { status: 'none', plan: 'yearly', trialEnds: '2026-10-12' },
      firstDay: false,
      habits: { ids: ['protein', 'strength', 'pause'], done: { protein: 0, strength: 0, pause: 0 }, today: {}, swappedFrom: null },
      reset: { active: false, ends: null, saved: null },
      protein: {},
      weights: [],
      hunger: [],
      cravings: [],
      workouts: { where: 'home', done: {}, feel: null, active: null },
      lessonsRead: {},
      phaseSeen: { land: true },
      flags: { drift: false, offline: false, weekSummary: false },
      coach: { introSeen: false, messages: [] },
      settings: { units: 'kg', height: 'cm', safeMode: false, appleHealth: false,
        reminders: { habit: true, score: true, weigh: false, trial: true }, tipsEmail: false },
      scores: { 2: 64, 3: 70, 4: 72, 5: 78 },
      scoreSafe: 82,
      nav: { stack: ['launch'] },
      sheet: null,
      theme: 'system'
    };
  }
  function demoState(week) {
    var s = blankState();
    s.auth = { signedIn: true, email: 'hannah.r@example.com', method: 'apple' };
    s.onboarded = true;
    s.sub = { status: 'trial', plan: 'yearly', trialEnds: '2026-10-12' };
    s.ob.consent = true; s.ob.appleHealth = true; s.ob.remindersOn = true;
    s.settings.appleHealth = true;
    s.weights = seedWeights();
    s.hunger = seedHunger();
    s.protein = { Breakfast: 30, Lunch: 34 };
    s.habits = { ids: ['protein', 'strength', 'pause'], done: { protein: 4, strength: 1, pause: 2 }, today: { protein: true }, swappedFrom: null };
    s.workouts.done = { A: 'Thursday' };
    s.coach = { introSeen: true, messages: [
      { from: 'you', text: 'Should I go back on a lower dose?' },
      { from: 'coach', redirect: true, text: 'That’s a decision for your prescriber, so I can’t help with doses. I can make a one-page summary of your trend and habits to take with you.', pack: true },
      { from: 'you', text: 'Yes please. And a quick high-protein lunch?' },
      { from: 'coach', text: 'Greek yoghurt, berries and a handful of nuts gets you about 30 g in two minutes. Want a savoury one too?' }
    ] };
    s.nav = { stack: ['today'] };
    if (week && week !== 6) setWeek(s, week);
    return s;
  }
  // Moving to a week means moving the last-injection date, as changing it in Your details would.
  function setWeek(s, week) {
    s.ob.lastInjection = addDays(TODAY, -((week - 1) * 7));
    var ids = habitsForWeek(week);
    s.habits = { ids: ids, done: {}, today: {}, swappedFrom: null };
    ids.forEach(function (id) { s.habits.done[id] = 0; });
    for (var p of PHASES) if (week >= p.from && p.key !== 'land') s.phaseSeen[p.key] = s.phaseSeen[p.key] || false;
    return s;
  }

  function load() {
    try { var raw = localStorage.getItem(KEY); if (raw) { var s = JSON.parse(raw); if (s && s.v === 1) return Object.assign(blankState(), s, { sheet: null }); } } catch (e) {}
    return blankState();
  }
  var state = load();
  var listeners = new Set();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function set(fn) {
    var next = typeof fn === 'function' ? fn(clone(state)) : Object.assign(clone(state), fn);
    state = next || state; save();
    listeners.forEach(function (l) { l(); });
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function useApp() { return React.useSyncExternalStore(function (l) { listeners.add(l); return function () { listeners.delete(l); }; }, function () { return state; }); }

  /* ---------- derived values ---------- */
  function weekOf(s) { return Math.max(1, Math.min(52, Math.floor(daysBetween(s.ob.lastInjection, TODAY) / 7) + 1)); }
  function weightsSorted(s) { return s.weights.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }); }
  function avg7(s, endIso) {
    var end = endIso || TODAY, vals = s.weights.filter(function (w) { var n = daysBetween(w.date, end); return n >= 0 && n < 7; }).map(function (w) { return w.kg; });
    if (!vals.length) return null;
    return Math.round(vals.reduce(function (a, b) { return a + b; }, 0) / vals.length * 10) / 10;
  }
  function steadyZone(s) { var lo = parseFloat(s.ob.lowestWeight) || 78; return [lo, Math.round(lo * 1.02 * 10) / 10]; }
  function proteinToday(s) { return Object.keys(s.protein).reduce(function (a, k) { return a + (+s.protein[k] || 0); }, 0); }
  function habitDetail(s, id) {
    var H = HABITS[id], n = s.habits.done[id] || 0;
    if (H.kind === 'days') return H.note + ' · ' + n + ' of ' + H.target + ' days';
    if (H.kind === 'sessions') return n + ' of ' + H.target + ' done';
    return H.note;
  }
  function habitDays(s) { var t = 0; s.habits.ids.forEach(function (id) { t += Math.min(s.habits.done[id] || 0, HABITS[id].target); }); return t; }
  function habitTarget(s) { var t = 0; s.habits.ids.forEach(function (id) { t += HABITS[id].target; }); return t; }
  function sessionsDone(s) { return Object.keys(s.workouts.done).length; }
  function lastScore(s) { var w = weekOf(s) - 1; return s.scores[w] || s.scores[5]; }
  function scoreDelta(s) { var w = weekOf(s) - 1; var a = s.scores[w] || s.scores[5], b = s.scores[w - 1] || s.scores[4]; return a - b; }
  function fmtWeight(s, kg) {
    if (kg == null || isNaN(kg)) return '–';
    if (s.settings.units === 'st') { var lb = Math.round(kg * 2.20462); return Math.floor(lb / 14) + ' st ' + (lb % 14) + ' lb'; }
    return (Math.round(kg * 10) / 10).toFixed(1) + ' kg';
  }
  function greeting(s) { return s.flags.evening ? 'Good evening' : 'Good afternoon'; }

  /* ---------- actions ---------- */
  var toastTimer;
  function toast(text) {
    set(function (s) { s.toast = text; return s; });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { set(function (s) { s.toast = null; return s; }); }, 3200);
  }
  var TAB_ROOT = { today: 'today', plan: 'plan', progress: 'progress', coach: 'coach' };
  var nav = {
    go: function (name, opts) {
      set(function (s) {
        if (opts && opts.replace) s.nav.stack[s.nav.stack.length - 1] = name; else s.nav.stack.push(name);
        if (s.nav.stack.length > 40) s.nav.stack = s.nav.stack.slice(-40);
        s.sheet = null; return s;
      });
      scrollTop();
    },
    reset: function (name) { set(function (s) { s.nav.stack = [name]; s.sheet = null; return s; }); scrollTop(); },
    back: function (fallback) {
      set(function (s) {
        if (s.nav.stack.length > 1) s.nav.stack.pop(); else s.nav.stack = [fallback || 'today'];
        s.sheet = null; return s;
      });
      scrollTop();
    },
    tab: function (key) { nav.reset(TAB_ROOT[key]); },
    sheet: function (name, data) { set(function (s) { s.sheet = name ? { name: name, data: data || null } : null; return s; }); }
  };
  function scrollTop() { requestAnimationFrame(function () { var v = document.querySelector('.viewport'); if (v) v.scrollTop = 0; }); }

  /* ---------- shared UI ---------- */
  function Back(p) { return html`<button type="button" class=${'iconbtn' + (p.solid ? '' : ' flat')} aria-label=${p.label || 'Back'} onClick=${p.onClick || function () { nav.back(p.fallback); }}><${Icon} name=${p.icon || 'back'} /></button>`; }
  function Steps(p) {
    return html`<div class="topbar">
      <${Back} fallback=${p.backTo} onClick=${p.onBack} />
      <div class="steps" role="progressbar" aria-valuemin="1" aria-valuemax="9" aria-valuenow=${p.n} aria-label=${'Step ' + p.n + ' of 9'}><span style=${{ width: Math.round(p.n / 9 * 100) + '%' }}></span></div>
      <span class="caption muted">${p.n} of 9</span>
    </div>`;
  }
  function Skip(p) { return html`<button type="button" class="skip" onClick=${p.onClick} title="Prototype only: fill this step with dummy answers and move on">${p.label || 'Skip'} ›</button>`; }
  function Avatar(p) { var s = useApp(); return html`<button type="button" class="avatar" aria-label="Settings" onClick=${function () { nav.go('settings'); }}>${s.name.charAt(0)}</button>`; }
  function Btn(p) {
    var v = p.variant || 'primary', size = p.size || 'md';
    var cls = 'ld-btn ld-btn--' + v + ' ld-btn--' + size + (p.block ? ' ld-btn--block' : '') + (p.className ? ' ' + p.className : '');
    return html`<button type="button" class=${cls} style=${p.style} disabled=${p.disabled} onClick=${p.onClick}>${p.icon ? html`<${Icon} name=${p.icon} size=${20} w=${2.2} />` : null}${p.children}</button>`;
  }
  function Row(p) {
    var inner = html`${p.icon ? html`<span class=${'ico ' + (p.tint || 'tint-sky')}><${Icon} name=${p.icon} size=${18} /></span>` : null}
      <span class="grow" style=${{ display: 'flex', flexDirection: 'column' }}><span style=${{ fontWeight: p.sub ? 800 : 700 }}>${p.title}</span>${p.sub ? html`<span class="caption muted">${p.sub}</span>` : null}</span>
      ${p.value != null ? html`<span class="caption" style=${{ color: p.valueColor || 'var(--ink-muted)' }}>${p.value}</span>` : null}
      ${p.right || null}
      ${p.onClick && p.chevron !== false ? html`<${Icon} name="chevron" size=${18} />` : null}`;
    return p.onClick ? html`<button type="button" class="li" onClick=${p.onClick}>${inner}</button>` : html`<div class="li">${inner}</div>`;
  }
  function Choices(p) {
    return html`<div class="wrap" role=${p.multi ? 'group' : 'radiogroup'} aria-label=${p.label}>${p.options.map(function (o) {
      var on = p.multi ? (p.value || []).indexOf(o) >= 0 : p.value === o;
      return html`<button key=${o} type="button" class=${'choice' + (p.sm ? ' sm' : '') + (on ? ' on' : '')} style=${p.style} role=${p.multi ? null : 'radio'} aria-checked=${p.multi ? null : on} aria-pressed=${p.multi ? on : null}
        onClick=${function () { if (!p.multi) return p.onChange(o); var v = (p.value || []).slice(); var i = v.indexOf(o); if (i >= 0) v.splice(i, 1); else v.push(o); p.onChange(v); }}>${o}</button>`;
    })}</div>`;
  }
  function Options(p) {
    return html`<div class="stack" style=${{ gap: p.gap || 10 }} role="radiogroup" aria-label=${p.label}>${p.options.map(function (o) {
      var on = p.value === o.id;
      return html`<button key=${o.id} type="button" role="radio" aria-checked=${on} class=${'option' + (on ? ' sel' : '')} style=${p.style} onClick=${function () { p.onChange(o.id); }}>
        <span class="radio"></span>
        <span class="grow" style=${{ display: 'flex', flexDirection: 'column', gap: 2 }}><span style=${{ fontWeight: 800 }}>${o.title}</span>${o.detail ? html`<span class="caption" style=${{ opacity: .8 }}>${o.detail}</span>` : null}</span>
      </button>`;
    })}</div>`;
  }
  function Toggle(p) { return html`<button type="button" class=${'toggle' + (p.on ? ' on' : '')} role="switch" aria-checked=${!!p.on} aria-label=${p.label} onClick=${p.onClick}></button>`; }
  // The app shell draws the tab bar fixed to the phone frame (see app.js); screens only declare which tab they belong to.
  function TabBar() { return null; }
  function Art(p) {
    return html`<div class="art" aria-hidden="true" style=${{ height: p.height }}>${p.shapes.map(function (sh, i) { return html`<span key=${i} style=${sh}></span>`; })}${p.children}</div>`;
  }
  function OfflineBanner() {
    var s = useApp();
    if (!s.flags.offline) return null;
    return html`<div class="banner" style=${{ background: 'var(--surface-sunk)' }} role="status"><span class="dot" style=${{ background: 'var(--ink-muted)' }}></span><span class="caption">You're offline. Logs save on this phone and sync later.</span></div>`;
  }

  window.LP = {
    h: h, html: html, L: L, ASSETS: ASSETS, Icon: Icon, ICON: ICON,
    TODAY: TODAY, addDays: addDays, daysBetween: daysBetween, fmt: fmt,
    PHASES: PHASES, phaseOf: phaseOf, HABITS: HABITS, SWAPS: SWAPS, habitsForWeek: habitsForWeek, LESSONS: LESSONS, SESSIONS: SESSIONS,
    blankState: blankState, demoState: demoState, setWeek: setWeek, seedWeights: seedWeights, seedHunger: seedHunger,
    get: function () { return state; }, set: set, useApp: useApp, toast: toast, nav: nav,
    weekOf: weekOf, weightsSorted: weightsSorted, avg7: avg7, steadyZone: steadyZone, proteinToday: proteinToday,
    habitDetail: habitDetail, habitDays: habitDays, habitTarget: habitTarget, sessionsDone: sessionsDone, lastScore: lastScore, scoreDelta: scoreDelta,
    fmtWeight: fmtWeight, greeting: greeting,
    ui: { Back: Back, Steps: Steps, Skip: Skip, Avatar: Avatar, Btn: Btn, Row: Row, Choices: Choices, Options: Options, Toggle: Toggle, TabBar: TabBar, Art: Art, OfflineBanner: OfflineBanner }
  };
})();
