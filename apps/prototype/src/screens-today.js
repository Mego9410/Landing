/* Today (T1, first-day X2, dark X4 via theme), quick log and swap sheets (T2, T3, offline X3),
   your week (T4) and workouts (W1–W4). */
(function () {
  'use strict';
  var LP = window.LP, html = LP.html, L = LP.L, Icon = LP.Icon, nav = LP.nav, set = LP.set, useApp = LP.useApp, toast = LP.toast;
  var U = LP.ui, Btn = U.Btn, Back = U.Back, Choices = U.Choices, Options = U.Options, Art = U.Art, Row = U.Row, Avatar = U.Avatar, TabBar = U.TabBar, OfflineBanner = U.OfflineBanner;

  function toggleHabit(id, on) {
    set(function (s) {
      var was = !!s.habits.today[id];
      if (was === on) return s;
      s.habits.today[id] = on;
      s.habits.done[id] = Math.max(0, (s.habits.done[id] || 0) + (on ? 1 : -1));
      if (on) s.firstDay = false;
      return s;
    });
    if (on && navigator.vibrate) { try { navigator.vibrate(10); } catch (e) {} }
  }
  function nextSession(s) { return ['A', 'B'].find(function (k) { return !s.workouts.done[k]; }) || null; }
  function untilNext(week) {
    var p = LP.phaseOf(week), nextP = LP.PHASES[LP.PHASES.indexOf(p) + 1];
    if (!nextP) return 'Week ' + week + ' of 52';
    var n = nextP.from - week - 1;
    return n <= 0 ? nextP.name + ' starts next week' : n + (n === 1 ? ' week' : ' weeks') + ' until ' + nextP.name;
  }
  var TIPS = {
    day: { label: 'TIP FOR TODAY', text: 'Hunger often comes back mid-afternoon in the first weeks. Greek yoghurt with berries at 3pm takes the edge off.' },
    evening: { label: 'TIP FOR TONIGHT', text: 'Evenings can feel hungrier. A protein-first dinner and a short walk after often help.' }
  };

  /* T1 Today (X2 when it's the first day) */
  function Today() {
    var s = useApp();
    var week = LP.weekOf(s), phase = LP.phaseOf(week), protein = LP.proteinToday(s), target = 100;
    var tip = s.flags.evening ? TIPS.evening : TIPS.day;
    var nxt = nextSession(s), where = s.workouts.where === 'gym' ? 'at the gym' : 'at home';
    var first = s.firstDay;
    return html`<div class="scr" style=${{ gap: 24 }}>
      <div class="topbar">
        <div class="stack" style=${{ gap: 2 }}>
          <p class="caption muted">${LP.fmt.long(LP.TODAY)}</p>
          <h1 class="t-title">${first ? 'Welcome, ' + s.name : LP.greeting(s) + ', ' + s.name}</h1>
        </div>
        <${Avatar} />
      </div>
      <${OfflineBanner} />
      ${s.flags.weekSummary ? html`<button type="button" class="card rowcard tint-sage" onClick=${function () { nav.go('week-summary'); }}>
        <span class="grow" style=${{ display: 'flex', flexDirection: 'column' }}><span class="label">YOUR WEEK IS READY</span><span class="strong">Week ${week - 1} steady score: ${LP.lastScore(s)}</span></span><${Icon} name="chevron" size=${20} /></button>` : null}
      <div class="row">
        <${L.Chip} tone=${phase.tone} onClick=${function () { nav.go('week'); }}>Week ${week} · ${phase.name}<//>
        <span class="caption muted">${untilNext(week)}</span>
      </div>
      ${s.reset.active ? html`<button type="button" class="banner tint-butter" onClick=${function () { nav.go('reset-week'); }}><${Icon} name="reset" size=${20} /><span class="body grow">Reset week · ends ${LP.fmt.short(s.reset.ends)}</span><${Icon} name="chevron" size=${18} /></button>` : null}
      ${s.flags.drift && !s.reset.active ? html`<${L.NudgeCard} title="Things shifted a little this week" actionLabel="See what changed" onAction=${function () { nav.go('what-changed'); }}>A lighter week with simpler habits usually settles it.<//>` : null}
      ${first ? html`
        <div class="card hero" style=${{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <span style=${{ width: 84, height: 84, borderRadius: 9999, boxShadow: 'inset 0 0 0 10px var(--surface-sunk)', display: 'grid', placeItems: 'center', flex: 'none', fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600, color: 'var(--ink-muted)' }}>–</span>
          <span class="grow stack" style=${{ gap: 4 }}><span class="strong">Your first steady score arrives on Sunday</span><span class="caption muted">It builds from the habits and logs you add this week.</span></span>
        </div>
        <div class="card hero tint-apricot" style=${{ gap: 10 }}>
          <span class="label">START HERE</span>
          <p class="body-lg">Log your first meal's protein. It takes about ten seconds.</p>
          <${Btn} block style=${{ background: 'var(--surface-raised)', color: 'var(--ink)' }} onClick=${function () { nav.sheet('quicklog'); }}>Log my first meal<//>
        </div>` : html`
        <div class="card hero tint-apricot" style=${{ gap: 14 }}>
          <div class="between"><span class="label">PROTEIN TODAY</span><span class="caption">Target ${target} g</span></div>
          <div class="row" style=${{ alignItems: 'baseline', gap: 6 }}><span class="t-num-md">${protein} g</span><span class="body">${protein >= target ? 'reached today' : 'so far'}</span></div>
          <div class="meter" style=${{ background: 'var(--surface-raised)' }} role="progressbar" aria-label="Protein today" aria-valuemin="0" aria-valuemax=${target} aria-valuenow=${protein}><span style=${{ width: Math.min(100, protein / target * 100) + '%', background: 'var(--on-pastel)' }}></span></div>
          <${Btn} block icon="plus" style=${{ background: 'var(--surface-raised)', color: 'var(--ink)' }} onClick=${function () { nav.sheet('quicklog'); }}>Quick log<//>
        </div>`}
      <div class="stack">
        <div class="between">
          <h2 class="t-heading">${s.reset.active ? 'Your reset habits' : "This week's habits"}</h2>
          ${s.reset.active ? null : html`<${Btn} variant="quiet" size="sm" style=${{ padding: '0 4px' }} onClick=${function () { nav.sheet('swap'); }}>Swap one<//>`}
        </div>
        ${s.habits.ids.map(function (id) {
          return html`<${L.HabitCheck} key=${id} id=${'habit-' + id} label=${LP.HABITS[id].label} detail=${LP.habitDetail(s, id)} checked=${!!s.habits.today[id]} onChange=${function (on) { toggleHabit(id, on); }} />`;
        })}
      </div>
      ${first ? null : nxt ? html`<button type="button" class="card rowcard" onClick=${function () { set(function (s) { s.workouts.selected = nxt; return s; }); nav.go('session'); }}>
          <span style=${{ width: 52, height: 52, borderRadius: 9999, background: 'var(--sage)', display: 'grid', placeItems: 'center', color: 'var(--on-pastel)', flex: 'none' }}><${Icon} name="workout" size=${24} /></span>
          <span class="grow stack" style=${{ gap: 2 }}><span class="label muted">TODAY'S SESSION</span><span style=${{ fontWeight: 800, fontSize: 16 }}>${LP.SESSIONS[nxt].name} · ${where}</span><span class="caption muted">${s.workouts.where === 'gym' ? 30 : 25} minutes · 5 exercises</span></span>
          <${Icon} name="chevron" size=${20} />
        </button>` : html`<button type="button" class="card rowcard tint-sage" onClick=${function () { nav.go('sessions'); }}>
          <span style=${{ width: 52, height: 52, borderRadius: 9999, background: 'var(--on-pastel)', display: 'grid', placeItems: 'center', color: 'var(--sage)', flex: 'none' }}><${Icon} name="check" size=${24} /></span>
          <span class="grow stack" style=${{ gap: 2 }}><span class="label">THIS WEEK'S SESSIONS</span><span style=${{ fontWeight: 800, fontSize: 16 }}>Both done</span><span class="caption">Next ones arrive on Monday</span></span>
        </button>`}
      <${LP.food.TonightCard} />
      <div class="card tint-lilac" style=${{ gap: 6 }}>
        <span class="label">${tip.label}</span>
        <p class="body-lg">${tip.text}</p>
        <${Btn} variant="quiet" size="sm" style=${{ alignSelf: 'flex-start', padding: 0, color: 'var(--on-pastel)' }} onClick=${function () { nav.tab('coach'); }}>Ask the coach for more ideas<//>
      </div>
      <${TabBar} active="today" />
    </div>`;
  }

  /* T2 Quick log (X3 when offline). Opens over the current screen. */
  var MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  function QuickLog() {
    var s = useApp();
    var safe = s.settings.safeMode;
    var todayW = (s.weights.find(function (w) { return w.date === LP.TODAY; }) || {}).kg;
    var defMeal = MEALS.find(function (m) { return !s.protein[m]; }) || 'Snack';
    var st = React.useState({ weight: todayW ? String(todayW) : '', protein: '', meal: defMeal, hunger: 3, note: '' }), f = st[0], setF = st[1];
    var er = React.useState({}), errs = er[0], setErrs = er[1];
    function upd(k, v) { var n = Object.assign({}, f); n[k] = v; setF(n); var e = Object.assign({}, errs); delete e[k]; setErrs(e); }
    function save() {
      var e = {}, w = parseFloat(f.weight), g = f.protein === '' ? null : parseFloat(f.protein);
      if (!safe && f.weight !== '' && !(w >= 35 && w <= 300)) e.weight = 'That doesn’t look right. Check for a missing decimal point, like 78.4.';
      if (g != null && !(g >= 0 && g <= 150)) e.protein = 'That looks high for one meal. Check the number and try again.';
      setErrs(e);
      if (Object.keys(e).length) return;
      set(function (s) {
        if (!safe && f.weight !== '' && w) {
          s.weights = s.weights.filter(function (x) { return x.date !== LP.TODAY; });
          s.weights.unshift({ date: LP.TODAY, kg: Math.round(w * 10) / 10, source: 'Logged by you' });
        }
        if (g != null) {
          s.protein[f.meal] = Math.round(g);
          if (f.meal === 'Breakfast' && g >= 25 && s.habits.ids.indexOf('protein') >= 0 && !s.habits.today.protein) { s.habits.today.protein = true; s.habits.done.protein = (s.habits.done.protein || 0) + 1; }
        }
        s.hunger = s.hunger.filter(function (x) { return x.date !== LP.TODAY; });
        s.hunger.unshift({ date: LP.TODAY, value: f.hunger });
        if (f.note.trim()) s.cravings.unshift({ date: LP.TODAY, text: f.note.trim() });
        s.firstDay = false; s.sheet = null;
        return s;
      });
      toast(s.flags.offline ? 'Saved on this phone. It syncs when you’re back online.' : 'Saved to today.');
    }
    return html`<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="ql-title">
      <span class="grab"></span>
      <div class="between">
        <div class="stack" style=${{ gap: 0 }}><h1 id="ql-title" class="t-heading" style=${{ fontSize: 24, lineHeight: '30px' }}>Quick log</h1><span class="caption muted">Today · updates today's entry</span></div>
        <button type="button" class="iconbtn" aria-label="Close" onClick=${function () { nav.sheet(null); }}><${Icon} name="close" /></button>
      </div>
      ${s.flags.offline ? html`<div class="banner" style=${{ background: 'var(--surface-sunk)' }}><${Icon} name="offline" size=${18} /><span class="caption">You're offline. We'll save this on your phone and sync it when you're back online.</span></div>` : null}
      <div class="row" style=${{ gap: 12, alignItems: 'flex-start' }}>
        ${safe ? null : html`<div style=${{ flex: 1, minWidth: 0 }}><${L.TextField} id="ql-weight" label="Weight" suffix=${s.settings.units === 'st' ? 'kg' : 'kg'} inputMode="decimal" value=${f.weight} error=${errs.weight} onChange=${function (e) { upd('weight', e.target.value); }} /></div>`}
        <div style=${{ flex: 1, minWidth: 0 }}><${L.TextField} id="ql-protein" label="Protein, this meal" suffix="g" inputMode="numeric" placeholder="30" value=${f.protein} error=${errs.protein} onChange=${function (e) { upd('protein', e.target.value); }} /></div>
      </div>
      <${Choices} sm label="Meal" options=${MEALS} value=${f.meal} onChange=${function (v) { upd('meal', v); }} />
      <div class="stack" style=${{ gap: 8 }}>
        <span class="label">How hungry are you right now?</span>
        <${L.HungerScale} value=${f.hunger} onChange=${function (n) { upd('hunger', n); }} />
      </div>
      <${L.TextField} id="ql-note" label="Cravings note (optional)" placeholder="e.g. wanted something sweet after lunch" value=${f.note} onChange=${function (e) { upd('note', e.target.value); }} />
      <${Btn} block onClick=${save}>Save<//>
    </div>`;
  }

  /* T3 Swap a habit */
  function SwapHabit() {
    var s = useApp();
    var replacing = s.habits.ids[2];
    var st = React.useState('walk'), pick = st[0], setPick = st[1];
    var opts = LP.SWAPS.filter(function (o) { return s.habits.ids.indexOf(o.id) < 0; });
    function choose() {
      set(function (s) {
        var old = s.habits.ids[2];
        s.habits.swappedFrom = s.habits.swappedFrom || old;
        s.habits.ids[2] = pick; s.habits.done[pick] = 0; delete s.habits.today[old];
        s.sheet = null; return s;
      });
      toast('Swapped for this week: ' + LP.HABITS[pick].label + '.');
    }
    return html`<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="sw-title">
      <span class="grab"></span>
      <div class="between">
        <h1 id="sw-title" class="t-heading" style=${{ fontSize: 24, lineHeight: '30px' }}>Swap a habit</h1>
        <button type="button" class="iconbtn" aria-label="Close" onClick=${function () { nav.sheet(null); }}><${Icon} name="close" /></button>
      </div>
      <div class="card tint-sunk" style=${{ padding: '12px 16px', gap: 2 }}>
        <span class="caption muted">Replacing, for this week only</span>
        <span class="strong">${LP.HABITS[replacing].label}</span>
      </div>
      <${Options} gap=${8} label="Swap options" value=${pick} onChange=${setPick} options=${opts} />
      <${Btn} block onClick=${choose}>Choose this one<//>
    </div>`;
  }

  /* T4 Your week (the Sunday summary) */
  function WeekSummary() {
    var s = useApp();
    var week = LP.weekOf(s), score = LP.lastScore(s), delta = LP.scoreDelta(s);
    function close() { set(function (s) { s.flags.weekSummary = false; return s; }); nav.reset('today'); }
    return html`<div class="scr plain" style=${{ gap: 22 }}>
      <div class="topbar"><${Back} icon="close" label="Close" onClick=${close} /><span class="pill-tag tint-sky">Week ${week - 1} done</span></div>
      <div class="stack center" style=${{ gap: 16 }}>
        <h1 class="t-title">Your week, settled</h1>
        <${L.ScoreRing} score=${s.settings.safeMode ? s.scoreSafe : score} size=${184} />
        <p class="body-lg">Habits carried you this week.${s.settings.safeMode ? '' : ' Your score is ' + (delta >= 0 ? 'up ' + delta : 'down ' + -delta) + ' on last week.'}</p>
      </div>
      <div class="grid3">
        <div class="card" style=${{ padding: 14, gap: 2 }}><span class="t-num-md">13/15</span><span class="caption muted">habit days</span></div>
        <div class="card" style=${{ padding: 14, gap: 2 }}><span class="t-num-md">2/2</span><span class="caption muted">workouts</span></div>
        <div class="card" style=${{ padding: 14, gap: 2 }}><span class="t-num-md">3.4</span><span class="caption muted">avg hunger</span></div>
      </div>
      <div class="card tint-sunk" style=${{ gap: 10 }}>
        <span class="label">NEXT WEEK'S HABITS</span>
        <div class="wrap">${s.habits.ids.map(function (id, i) { return html`<${L.Chip} key=${id} tone=${['apricot', 'sage', 'lilac'][i]}>${LP.HABITS[id].label}<//>`; })}</div>
      </div>
      <div class="foot">
        <${Btn} block onClick=${close}>Start week ${week}<//>
        <${Btn} variant="quiet" size="sm" style=${{ alignSelf: 'center' }} onClick=${function () { set(function (s) { s.flags.weekSummary = false; return s; }); nav.reset('progress'); }}>See my progress<//>
      </div>
    </div>`;
  }

  /* W1 This week's sessions */
  function Sessions() {
    var s = useApp();
    var week = LP.weekOf(s), home = s.workouts.where !== 'gym', nxt = nextSession(s);
    function line(k) { return home ? (k === 'B' ? '25 minutes · dumbbells or water bottles' : '25 minutes · a chair and a resistance band') : (k === 'B' ? '30 minutes · dumbbells and a cable machine' : '30 minutes · leg press and cable row'); }
    function open(k) { set(function (s) { s.workouts.selected = k; return s; }); nav.go('session'); }
    return html`<div class="scr">
      <div class="topbar"><${Back} /><span class="caption muted">Week ${week}</span><span style=${{ width: 44 }}></span></div>
      <div class="stack">
        <h1 class="t-title">This week's sessions</h1>
        <p class="body muted">Two short strength sessions. Muscle helps you hold steady.</p>
      </div>
      <div class="seg" role="group" aria-label="Where you train">
        <button type="button" class=${home ? 'on' : ''} aria-pressed=${home} onClick=${function () { set(function (s) { s.workouts.where = 'home'; return s; }); }}>At home</button>
        <button type="button" class=${home ? '' : 'on'} aria-pressed=${!home} onClick=${function () { set(function (s) { s.workouts.where = 'gym'; return s; }); }}>At the gym</button>
      </div>
      ${['A', 'B'].map(function (k) {
        var S = LP.SESSIONS[k], done = s.workouts.done[k];
        if (done) return html`<button key=${k} type="button" class="card rowcard tint-sage" onClick=${function () { open(k); }}>
          <span style=${{ width: 44, height: 44, borderRadius: 9999, background: 'var(--on-pastel)', color: 'var(--sage)', display: 'grid', placeItems: 'center', flex: 'none' }}><${Icon} name="check" /></span>
          <span class="grow stack" style=${{ gap: 0 }}><span style=${{ fontWeight: 800, fontSize: 16 }}>${S.name}</span><span class="caption">Done ${done} · ${home ? 24 : 29} minutes</span></span></button>`;
        var isNext = k === nxt;
        return html`<button key=${k} type="button" class="card rowcard" style=${{ boxShadow: isNext ? 'inset 0 0 0 2px var(--apricot), var(--shadow-sm)' : 'var(--shadow-sm)' }} onClick=${function () { open(k); }}>
          <span style=${{ width: 44, height: 44, borderRadius: 9999, background: isNext ? 'var(--apricot)' : 'var(--surface-sunk)', color: 'var(--on-pastel)', display: 'grid', placeItems: 'center', flex: 'none' }}><${Icon} name="workout" /></span>
          <span class="grow stack" style=${{ gap: 0 }}><span style=${{ fontWeight: 800, fontSize: 16 }}>${S.name}</span><span class="caption muted">${line(k)}</span></span>
          ${isNext ? html`<span class="pill-tag tint-apricot">Today</span>` : null}</button>`;
      })}
      <div class="card tint-sunk rowcard">
        <span style=${{ width: 44, height: 44, borderRadius: 9999, background: 'var(--surface-raised)', display: 'grid', placeItems: 'center', flex: 'none', color: 'var(--ink-muted)' }}><${Icon} name="lock" /></span>
        <span class="grow stack" style=${{ gap: 0 }}><span class="strong">Extra session</span><span class="caption muted">${week >= 9 ? 'Optional this phase · coming soon in the prototype' : 'Unlocks in Settle, week 9'}</span></span>
      </div>
      <${TabBar} active="today" />
    </div>`;
  }

  /* W2 Session overview */
  function SessionOverview() {
    var s = useApp();
    var k = s.workouts.selected || nextSession(s) || 'B', S = LP.SESSIONS[k], home = s.workouts.where !== 'gym';
    function start() { set(function (s) { s.workouts.active = { id: k, move: 0, set: 1, paused: false }; return s; }); nav.go('in-session'); }
    return html`<div class="scr plain" style=${{ gap: 18 }}>
      <div class="topbar"><${Back} fallback="sessions" /></div>
      <div class="stack">
        <p class="eyebrow">WEEK ${LP.weekOf(s)} · SESSION ${k === 'A' ? 1 : 2} OF 2</p>
        <h1 class="t-title">${S.name}</h1>
        <div class="wrap">
          <${L.Chip}>${home ? 25 : 30} minutes<//>
          <${L.Chip}>${home ? 'At home' : 'At the gym'}<//>
          <${L.Chip}>${home ? 'Dumbbells or water bottles' : 'Dumbbells and cables'}<//>
        </div>
      </div>
      <div class="card tint-sky" style=${{ padding: '12px 16px', flexDirection: 'row', gap: 10, alignItems: 'center' }}><${Icon} name="clock" size=${20} /><span class="body">Starts with a 3-minute warm-up</span></div>
      <div class="list">
        ${S.moves.map(function (m, i) {
          return html`<div key=${m.name} class="li">
            <span style=${{ width: 56, height: 46, borderRadius: 12, background: 'var(--sky)', overflow: 'hidden', flex: 'none' }} aria-hidden="true"><${LP.demo.Thumb} id=${m.anim} who=${LP.demo.whoFor(s, k + '-w' + LP.weekOf(s))} /></span>
            <span class="grow strong">${m.name}</span><span class="caption muted">${m.sets} × ${m.reps}</span></div>`;
        })}
      </div>
      <p class="caption muted">Go at your own pace. Stop if anything hurts.</p>
      <div class="foot">
        ${s.workouts.done[k] ? html`<p class="caption muted" style=${{ textAlign: 'center' }}>You did this one on ${s.workouts.done[k]}. You can do it again any time.</p>` : null}
        <${Btn} block onClick=${start}>Start session<//>
      </div>
    </div>`;
  }

  /* W3 In session */
  function InSession() {
    var s = useApp();
    var a = s.workouts.active || { id: 'B', move: 0, set: 1, paused: false };
    var S = LP.SESSIONS[a.id], m = S.moves[a.move];
    var es = React.useState(false), easy = es[0], setEasy = es[1];
    var dp = LP.demo.prefs(s), who = LP.demo.whoFor(s, a.id + '-w' + LP.weekOf(s));
    function finish() {
      set(function (s) {
        var id = s.workouts.active ? s.workouts.active.id : 'B';
        var first = !s.workouts.done[id];
        s.workouts.done[id] = 'Monday'; s.workouts.active = null; s.workouts.justDone = id;
        var hid = s.habits.ids.find(function (x) { return LP.HABITS[x].kind === 'sessions'; });
        if (hid && first) { s.habits.done[hid] = (s.habits.done[hid] || 0) + 1; s.habits.today[hid] = true; }
        return s;
      });
      nav.go('session-done', { replace: true });
    }
    function nextSet() {
      if (a.set < m.sets) return set(function (s) { s.workouts.active.set++; return s; });
      if (a.move < S.moves.length - 1) return set(function (s) { s.workouts.active.move++; s.workouts.active.set = 1; return s; });
      finish();
    }
    function skip() { if (a.move < S.moves.length - 1) set(function (s) { s.workouts.active.move++; s.workouts.active.set = 1; return s; }); else finish(); }
    return html`<div class="scr plain" style=${{ gap: 18 }}>
      <${U.Skip} label="Finish session" onClick=${finish} />
      <div class="topbar">
        <button type="button" class="iconbtn" aria-label="End session" onClick=${function () { set(function (s) { s.workouts.active = null; return s; }); nav.back('session'); }}><${Icon} name="close" /></button>
        <div class="steps"><span style=${{ width: ((a.move + 1) / S.moves.length * 100) + '%', background: 'var(--sage-ink)' }}></span></div>
        <span class="caption muted">${a.move + 1} of ${S.moves.length}</span>
      </div>
      <div style=${{ height: 250, borderRadius: 'var(--radius-lg)', background: 'var(--sky)', position: 'relative', overflow: 'hidden', flex: 'none' }}>
        <${LP.demo.Motion} id=${easy && m.easier ? m.easier : m.anim} who=${who} paused=${a.paused} still=${dp.still} ghost=${dp.ghost} label=${m.name + ', shown by ' + LP.demo.nameOf(who)} />
        ${a.paused ? html`<span class="label" style=${{ position: 'absolute', top: 12, left: 14, color: 'var(--on-pastel)' }}>Paused</span>` : null}
        <span class="ld-chip" style=${{ position: 'absolute', top: 10, right: 10, background: 'var(--surface-raised)', color: 'var(--ink)' }}>${LP.demo.nameOf(who)}</span>
      </div>
      <div class="stack" style=${{ gap: 4 }}>
        <h1 class="t-title">${easy && m.easier ? m.name + ', easier' : m.name}</h1>
        <p class="body muted">${m.cue}</p>
        ${m.easier ? html`<button type="button" class="linkish" style=${{ alignSelf: 'flex-start', marginTop: 4, fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3 }} onClick=${function () { setEasy(!easy); }}>${easy ? 'Show the full version' : 'Show an easier version'}</button>` : null}
      </div>
      <div class="row" style=${{ gap: 10 }}>
        <div class="card" style=${{ flex: 1, alignItems: 'center', padding: 14, gap: 0 }}><span class="t-num-md">${a.set}/${m.sets}</span><span class="caption muted">set</span></div>
        <div class="card" style=${{ flex: 1, alignItems: 'center', padding: 14, gap: 0, textAlign: 'center' }}><span class="t-num-md" style=${{ fontSize: m.reps.length > 3 ? 18 : 32, lineHeight: '36px' }}>${m.reps}</span><span class="caption muted">reps</span></div>
        <div class="card tint-butter" style=${{ flex: 1, alignItems: 'center', padding: 14, gap: 0 }}><span class="t-num-md">0:45</span><span class="caption">rest next</span></div>
      </div>
      <div class="foot">
        <${Btn} block disabled=${a.paused} onClick=${nextSet}>${a.set === m.sets && a.move === S.moves.length - 1 ? 'Finish session' : 'Done with this set'}<//>
        <div class="row">
          <${Btn} variant="secondary" size="sm" style=${{ flex: 1 }} onClick=${skip}>Skip exercise<//>
          <${Btn} variant="secondary" size="sm" icon=${a.paused ? 'play' : 'pause'} style=${{ flex: 1 }} onClick=${function () { set(function (s) { if (s.workouts.active) s.workouts.active.paused = !s.workouts.active.paused; return s; }); }}>${a.paused ? 'Resume' : 'Pause'}<//>
        </div>
      </div>
    </div>`;
  }

  /* W4 Session done */
  function SessionDone() {
    var s = useApp();
    var both = LP.sessionsDone(s) >= 2;
    return html`<div class="scr plain">
      <${Art} height=${260} shapes=${[
        { left: -20, right: -20, bottom: 0, height: 80, background: 'var(--sage)' },
        { left: 60, top: 50, width: 14, height: 14, background: 'var(--lilac)' },
        { right: 70, top: 36, width: 22, height: 22, background: 'var(--sky)' }]}>
        <span style=${{ position: 'absolute', left: '50%', marginLeft: -50, bottom: 80, width: 100, height: 100, borderRadius: 9999, background: 'var(--apricot)', display: 'grid', placeItems: 'center', color: 'var(--on-pastel)', animation: 'rise .5s ease-out' }}><${Icon} name="check" size=${44} w=${2.4} /></span>
      <//>
      <div class="stack center">
        <h1 class="t-display" style=${{ fontSize: 36, lineHeight: '40px' }}>Session done</h1>
        <p class="body-lg">${both ? "That's both strength sessions this week. Your muscles thank you." : 'One down, one to go this week. Nicely done.'}</p>
      </div>
      <div class="card" style=${{ gap: 12 }}>
        <span class="label">HOW DID THAT FEEL?</span>
        <${Choices} label="How it felt" options=${['Too easy', 'Just right', 'Tough']} value=${s.workouts.feel || 'Just right'} onChange=${function (v) { set(function (s) { s.workouts.feel = v; return s; }); }} />
        <span class="caption muted">We use this to adjust next week's sessions.</span>
      </div>
      <div class="foot"><${Btn} block onClick=${function () { nav.reset('today'); }}>Back to Today<//></div>
    </div>`;
  }

  Object.assign(window.LP.screens = window.LP.screens || {}, {
    today: { c: Today, id: 'T1', title: 'Today', group: 'Today', tab: 'today' },
    'week-summary': { c: WeekSummary, id: 'T4', title: 'Your week', group: 'Today' },
    sessions: { c: Sessions, id: 'W1', title: "This week's sessions", group: 'Workouts', tab: 'today' },
    session: { c: SessionOverview, id: 'W2', title: 'Session overview', group: 'Workouts' },
    'in-session': { c: InSession, id: 'W3', title: 'In session', group: 'Workouts' },
    'session-done': { c: SessionDone, id: 'W4', title: 'Session done', group: 'Workouts' }
  });
  window.LP.sheets = Object.assign(window.LP.sheets || {}, { quicklog: { c: QuickLog, id: 'T2', title: 'Quick log' }, swap: { c: SwapHabit, id: 'T3', title: 'Swap a habit' } });
})();
