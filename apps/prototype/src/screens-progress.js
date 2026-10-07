/* Plan (PL1–PL4), Progress (PR1–PR6, safe mode X1) and Coach (C1–C2). */
(function () {
  'use strict';
  var LP = window.LP, html = LP.html, L = LP.L, Icon = LP.Icon, nav = LP.nav, set = LP.set, useApp = LP.useApp, toast = LP.toast;
  var U = LP.ui, Btn = U.Btn, Back = U.Back, Choices = U.Choices, Art = U.Art, Row = U.Row, Avatar = U.Avatar, TabBar = U.TabBar;

  /* ---------- Plan ---------- */
  function Plan() {
    var s = useApp();
    var week = LP.weekOf(s), phase = LP.phaseOf(week), lesson = LP.LESSONS[phase.key];
    return html`<div class="scr">
      <div class="topbar">
        <div class="stack" style=${{ gap: 2 }}><p class="caption muted">Week ${week} of 52</p><h1 class="t-title">Your plan</h1></div>
        <${Avatar} />
      </div>
      <button type="button" class="card hero tint-apricot" style=${{ gap: 6 }} onClick=${function () { nav.go('week'); }}>
        <span class="label">THIS WEEK</span>
        <span class="t-heading" style=${{ fontSize: 22 }}>${s.reset.active ? 'Reset week' : lesson.week}</span>
        <span class="body">${s.lessonsRead[week] ? 'Lesson read · three habits and two sessions' : 'Lesson, three habits and two sessions'}</span>
      </button>
      <${LP.food.PlanCard} />
      ${LP.PHASES.map(function (p) {
        var weeks = []; for (var w = p.from; w <= p.to; w++) weeks.push(w);
        return html`<div key=${p.key} class="card" style=${{ gap: 12 }}>
          <div class="between">
            <div class="row" style=${{ gap: 10 }}><span class="dot" style=${{ background: 'var(--' + p.tone + '-ink)' }}></span><span class="t-heading">${p.name}</span></div>
            <span class="caption muted">Weeks ${p.from}–${p.to}</span>
          </div>
          <p class="body muted">${p.focus}</p>
          <div style=${{ display: 'grid', gridTemplateColumns: 'repeat(9, minmax(0, 1fr))', gap: 6 }}>
            ${weeks.map(function (w) {
              var st = w < week ? { background: 'var(--sage-ink)' } : w === week ? { background: 'var(--apricot)', boxShadow: '0 0 0 2px var(--apricot-ink)' } : { background: 'var(--surface-sunk)', boxShadow: 'inset 0 0 0 1.5px var(--line)' };
              return html`<span key=${w} title=${'Week ' + w} role="img" aria-label=${'Week ' + w + (w < week ? ', done' : w === week ? ', this week' : ', coming up')} style=${Object.assign({ display: 'block', aspectRatio: '1', borderRadius: 9999 }, st)}></span>`;
            })}
          </div>
        </div>`;
      })}
      <div class="row caption muted" style=${{ gap: 14 }}>
        <span class="row" style=${{ gap: 6 }}><span class="dot" style=${{ background: 'var(--sage-ink)' }}></span>Done</span>
        <span class="row" style=${{ gap: 6 }}><span class="dot" style=${{ background: 'var(--apricot)', boxShadow: '0 0 0 2px var(--apricot-ink)' }}></span>This week</span>
        <span class="row" style=${{ gap: 6 }}><span class="dot" style=${{ background: 'var(--surface-sunk)', boxShadow: 'inset 0 0 0 1.5px var(--line)' }}></span>Coming up</span>
      </div>
      <${TabBar} active="plan" />
    </div>`;
  }

  function Week() {
    var s = useApp();
    var week = LP.weekOf(s), phase = LP.phaseOf(week), lesson = LP.LESSONS[phase.key];
    function toggle(id, on) {
      set(function (s) { if (!!s.habits.today[id] === on) return s; s.habits.today[id] = on; s.habits.done[id] = Math.max(0, (s.habits.done[id] || 0) + (on ? 1 : -1)); return s; });
    }
    return html`<div class="scr">
      <div class="topbar"><${Back} fallback="plan" /><${L.Chip} tone=${phase.tone}>${phase.name} · week ${week}<//><span style=${{ width: 44 }}></span></div>
      <div class="stack">
        <h1 class="t-display" style=${{ fontSize: 36, lineHeight: '40px' }}>${lesson.week}</h1>
        <p class="body-lg muted">${lesson.blurb}</p>
      </div>
      <button type="button" class="card rowcard tint-lilac" onClick=${function () { nav.go('lesson'); }}>
        <span class="grow stack" style=${{ gap: 2 }}><span class="label">THIS WEEK'S LESSON</span><span style=${{ fontWeight: 800, fontSize: 16 }}>${lesson.title}</span><span class="caption">${s.lessonsRead[week] ? 'Read · 3 minute read' : '3 minute read'}</span></span>
        ${s.lessonsRead[week] ? html`<span class="pill-tag" style=${{ background: 'var(--surface-raised)', color: 'var(--ink)' }}>Read</span>` : html`<${Icon} name="chevron" size=${20} />`}
      </button>
      <div class="stack">
        <div class="between"><h2 class="t-heading">Habits</h2>${s.reset.active ? null : html`<${Btn} variant="quiet" size="sm" style=${{ padding: '0 4px' }} onClick=${function () { nav.sheet('swap'); }}>Swap one<//>`}</div>
        ${s.habits.ids.map(function (id) { return html`<${L.HabitCheck} key=${id} id=${'wk-' + id} label=${LP.HABITS[id].label} detail=${LP.habitDetail(s, id)} checked=${!!s.habits.today[id]} onChange=${function (on) { toggle(id, on); }} />`; })}
      </div>
      <div class="stack">
        <h2 class="t-heading">Sessions</h2>
        <div class="list">
          ${['A', 'B'].map(function (k) {
            var done = s.workouts.done[k];
            return html`<${Row} key=${k} icon=${done ? 'check' : 'workout'} tint=${done ? 'tint-sage' : 'tint-apricot'} title=${LP.SESSIONS[k].name} value=${done ? 'Done' : (s.workouts.where === 'gym' ? '30 min' : '25 min')}
              onClick=${function () { set(function (s) { s.workouts.selected = k; return s; }); nav.go(done ? 'sessions' : 'session'); }} />`;
          })}
        </div>
      </div>
      <${TabBar} active="plan" />
    </div>`;
  }

  var LESSON_BODY = {
    land: { paras: ['As your appetite comes back, meals built around protein tend to keep you fuller for longer, so hunger feels easier to handle.', 'Protein also helps your body hold on to muscle. Muscle is part of what you worked for, and strength sessions plus protein help you keep it.'],
      tries: ['A palm-sized portion at each meal: eggs, Greek yoghurt, chicken, fish, tofu, beans or lentils.', "Start with breakfast. It's the meal most people miss."] },
    settle: { paras: ['In Settle, regular meals do a lot of quiet work. When you know roughly when you’ll next eat, hunger is easier to sit with.', 'Structure is not a rule book. It’s a rough rhythm you can bend for a meal out or a busy day.'],
      tries: ['Three meals at roughly the same times on five days this week.', 'Have a plan for the hungriest time of day, like a protein snack ready to go.'] },
    steady: { paras: ['By now, the habits that worked are yours. Steady is about keeping them with fewer reminders.', 'Check in once a month. If things shift, a reset week is always there.'],
      tries: ['Pick the two habits that matter most to you and keep them.', 'Put a monthly check-in in your calendar.'] }
  };
  function Lesson() {
    var s = useApp();
    var week = LP.weekOf(s), phase = LP.phaseOf(week), lesson = LP.LESSONS[phase.key], body = LESSON_BODY[phase.key];
    return html`<div class="scr plain" style=${{ gap: 18 }}>
      <div class="topbar"><${Back} fallback="week" /><span class="caption muted">3 minute read</span></div>
      <div aria-hidden="true" style=${{ position: 'relative', height: 120, borderRadius: 'var(--radius-lg)', background: 'var(--lilac)', overflow: 'hidden', flex: 'none' }}>
        <span style=${{ position: 'absolute', left: 30, bottom: -40, width: 110, height: 110, borderRadius: 9999, background: 'var(--apricot)' }}></span>
        <span style=${{ position: 'absolute', right: 40, top: 24, width: 120, height: 40, borderRadius: 9999, background: 'var(--surface-raised)', opacity: .7 }}></span>
      </div>
      <div class="stack" style=${{ gap: 6 }}><p class="eyebrow">WEEK ${week} · ${phase.name.toUpperCase()}</p><h1 class="t-title">${lesson.title}</h1></div>
      ${body.paras.map(function (p) { return html`<p key=${p} class="body-lg">${p}</p>`; })}
      <div class="card tint-sky" style=${{ gap: 8 }}>
        <span class="label">TRY THIS WEEK</span>
        ${body.tries.map(function (t) { return html`<p key=${t} class="body">${t}</p>`; })}
      </div>
      <div class="foot"><${Btn} block onClick=${function () { set(function (s) { s.lessonsRead[week] = true; return s; }); nav.back('week'); toast('Lesson marked as read.'); }}>${s.lessonsRead[week] ? 'Done' : 'Mark as read'}<//></div>
    </div>`;
  }

  var NEW_PHASE = {
    settle: { title: 'Welcome to Settle', text: "You've landed. The next 18 weeks are about making these routines feel normal.", items: ['Meal structure that fits your week', 'Eating out without overthinking it', 'A plan for cravings', 'A third strength session, if you want it'] },
    steady: { title: 'Welcome to Steady', text: 'Six months in. From here the routines are yours, with fewer prompts and a check-in each month.', items: ['Fewer daily nudges', 'Monthly check-ins', 'Reset weeks whenever you want one'] }
  };
  function NewPhase() {
    var s = useApp();
    var week = LP.weekOf(s), phase = LP.phaseOf(week), key = phase.key === 'land' ? 'settle' : phase.key, c = NEW_PHASE[key];
    function start() { set(function (s) { s.phaseSeen[key] = true; return s; }); nav.reset('plan'); }
    return html`<div class="scr plain tint-sage-bg">
      <div class="topbar"><span class="pill-tag" style=${{ background: 'var(--surface-raised)', color: 'var(--ink)' }}>Week ${week}</span></div>
      <div aria-hidden="true" style=${{ position: 'relative', height: 170, flex: 'none' }}>
        <span style=${{ position: 'absolute', left: -40, right: -40, bottom: 0, height: 60, borderRadius: 9999, background: 'var(--surface-raised)', opacity: .55 }}></span>
        <span style=${{ position: 'absolute', left: '50%', marginLeft: -48, bottom: 60, width: 96, height: 96, borderRadius: 9999, background: 'var(--apricot)', animation: 'rise .6s ease-out' }}></span>
      </div>
      <div class="stack"><h1 class="t-display">${c.title}</h1><p class="body-lg">${c.text}</p></div>
      <div class="card" style=${{ gap: 10 }}>
        <span class="label muted">WHAT'S NEW</span>
        ${c.items.map(function (t) { return html`<div key=${t} class="row"><span class="dot" style=${{ background: 'var(--sage-ink)' }}></span><span class="body">${t}</span></div>`; })}
      </div>
      <div class="foot"><${Btn} block style=${{ background: 'var(--on-pastel)', color: 'var(--sage)' }} onClick=${start}>Start ${key === 'settle' ? 'Settle' : 'Steady'}<//></div>
    </div>`;
  }

  /* ---------- Progress ---------- */
  // 7-day average for each day in the range, oldest first.
  function trend(s, days) {
    var out = [];
    for (var i = days - 1; i >= 0; i--) { var day = LP.addDays(LP.TODAY, -i), a = LP.avg7(s, day); if (a != null) out.push({ i: days - 1 - i, v: a }); }
    return out;
  }
  function TrendChart(p) {
    var s = p.s, days = p.days, W = 310, H = 170, base = 150;
    var pts = trend(s, days), zone = LP.steadyZone(s);
    if (pts.length < 2) return html`<div class="card tint-sunk" style=${{ height: 120, alignItems: 'center', justifyContent: 'center' }}><span class="caption muted">Your trend appears after a few weigh-ins.</span></div>`;
    var vals = pts.map(function (q) { return q.v; }).concat(zone);
    var lo = Math.floor((Math.min.apply(null, vals) - 0.6) * 2) / 2, hi = Math.ceil((Math.max.apply(null, vals) + 0.6) * 2) / 2;
    function Y(v) { return base - (v - lo) / (hi - lo) * 140; }
    function X(i) { return 5 + i / (days - 1) * 300; }
    var d = pts.map(function (q, k) { return (k ? 'L' : 'M') + X(q.i).toFixed(1) + ' ' + Y(q.v).toFixed(1); }).join(' ');
    var last = pts[pts.length - 1], bandTop = Y(zone[1]), bandBot = Y(zone[0]);
    return html`<svg viewBox=${'0 0 ' + W + ' ' + H} width="100%" height=${H} role="img" aria-label=${p.label} style=${{ display: 'block' }}>
      <rect x="0" y=${bandTop.toFixed(1)} width=${W} height=${(bandBot - bandTop).toFixed(1)} rx="10" style=${{ fill: 'var(--sage)' }}></rect>
      <text x="8" y=${(bandTop + 15).toFixed(1)} style=${{ fill: 'var(--sage-ink)', font: '700 11px var(--font-body)' }}>Your steady zone</text>
      <line x1="0" x2=${W} y1=${base} y2=${base} style=${{ stroke: 'var(--line)' }}></line>
      <path d=${d} style=${{ fill: 'none', stroke: 'var(--ink)', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}></path>
      <circle cx=${X(last.i).toFixed(1)} cy=${Y(last.v).toFixed(1)} r="6" style=${{ fill: 'var(--apricot)', stroke: 'var(--ink)', strokeWidth: 2 }}></circle>
      <text x="0" y="166" style=${{ fill: 'var(--ink-muted)', font: '600 11px var(--font-body)' }}>${p.startLabel}</text>
      <text x=${W} y="166" text-anchor="end" style=${{ fill: 'var(--ink-muted)', font: '600 11px var(--font-body)' }}>Today</text>
    </svg>`;
  }
  function Tiles(p) {
    var s = p.s, hd = LP.habitDays(s), ht = LP.habitTarget(s), sd = LP.sessionsDone(s);
    return html`<div class="grid2">
      <div class="card" style=${{ gap: 8 }}><span class="label muted">HABITS</span><span class="t-num-md">${hd}/${ht}</span><div class="meter"><span style=${{ width: (ht ? Math.round(hd / ht * 100) : 0) + '%' }}></span></div></div>
      <div class="card" style=${{ gap: 8 }}><span class="label muted">WORKOUTS</span><span class="t-num-md">${sd}/2</span><div class="meter"><span style=${{ width: Math.min(100, sd / 2 * 100) + '%' }}></span></div></div>
    </div>`;
  }
  function Progress() {
    var s = useApp();
    var rs = React.useState('30'), range = rs[0], setRange = rs[1];
    var safe = s.settings.safeMode;
    var since = Math.max(8, LP.daysBetween(s.ob.lastInjection, LP.TODAY) + 1);
    var days = range === 'since' ? since : +range;
    var nowAvg = LP.avg7(s), zone = LP.steadyZone(s), inZone = nowAvg != null && nowAvg <= zone[1];
    var score = safe ? s.scoreSafe : LP.lastScore(s), delta = LP.scoreDelta(s);
    if (safe) {
      var hun = s.hunger.slice(0, 7).reverse();
      return html`<div class="scr">
        <div class="topbar"><h1 class="t-title">Progress</h1><${Avatar} /></div>
        <button type="button" class="banner tint-sky" onClick=${function () { nav.go('support'); }}><${Icon} name="lock" size=${18} /><span class="body grow">Safe mode is on. Weight is hidden.</span><span class="caption">Change</span></button>
        <button type="button" class="card hero rowcard" style=${{ gap: 16 }} onClick=${function () { nav.go('score'); }}>
          <${L.ScoreRing} score=${score} size=${112} label="This week" />
          <span class="grow stack" style=${{ gap: 4 }}><span class="label muted">STEADY SCORE</span><span class="body" style=${{ fontWeight: 700 }}>Built from your habits and hunger.</span><span class="caption" style=${{ color: 'var(--sage-ink)' }}>Your steadiest week yet</span></span>
        </button>
        <div class="card hero" style=${{ gap: 12 }}>
          <div class="between"><h2 class="t-heading">Hunger this week</h2><span class="caption muted" style=${{ textAlign: 'right' }}>1 very hungry · 5 comfortably full</span></div>
          <div style=${{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 8, alignItems: 'end', height: 120 }} role="img" aria-label=${'Hunger ratings for the last ' + hun.length + ' days'}>
            ${hun.map(function (x) { return html`<div key=${x.date} style=${{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
              <span style=${{ display: 'block', width: '100%', borderRadius: 9999, background: 'var(--sky)', boxShadow: 'inset 0 0 0 2px var(--sky-ink)', height: x.value * 18 }}></span>
              <span class="caption muted">${LP.fmt.short(x.date).charAt(0)}</span></div>`; })}
          </div>
        </div>
        <${Tiles} s=${s} />
        <${TabBar} active="progress" />
      </div>`;
    }
    return html`<div class="scr">
      <div class="topbar"><h1 class="t-title">Progress</h1><${Avatar} /></div>
      ${s.flags.drift && !s.reset.active ? html`<${L.NudgeCard} title="Things shifted a little this week" actionLabel="See what changed" onAction=${function () { nav.go('what-changed'); }}>That's common around week 10. A lighter week usually settles it.<//>` : null}
      <button type="button" class="card hero rowcard" style=${{ gap: 16 }} onClick=${function () { nav.go('score'); }}>
        <${L.ScoreRing} score=${score} size=${112} label="This week" />
        <span class="grow stack" style=${{ gap: 4 }}>
          <span class="label muted">STEADY SCORE</span>
          <span class="body" style=${{ fontWeight: 700 }}>Habits carried you this week.</span>
          <span class="caption" style=${{ color: 'var(--sage-ink)' }}>${delta >= 0 ? 'Up ' + delta + ' on last week' : 'A little lower than last week'}</span>
          <span class="caption muted">How it's worked out ›</span>
        </span>
      </button>
      <div class="card hero" style=${{ gap: 14 }}>
        <div class="between"><h2 class="t-heading">Weight trend</h2><span class="caption muted">7-day average</span></div>
        <div class="seg" role="group" aria-label="Time range">
          ${[['30', '30 days'], ['90', '90 days'], ['since', 'Since stopping']].map(function (r) { return html`<button key=${r[0]} type="button" class=${range === r[0] ? 'on' : ''} aria-pressed=${range === r[0]} onClick=${function () { setRange(r[0]); }}>${r[1]}</button>`; })}
        </div>
        <${TrendChart} s=${s} days=${days} startLabel=${range === 'since' ? 'Last injection' : days + ' days ago'} label=${'Weight, 7-day average, last ' + days + ' days' + (inZone ? ', inside your steady zone' : ', a little above your steady zone')} />
        <div class="between">
          <span class="t-num-md">${LP.fmtWeight(s, nowAvg).replace(/ kg$/, '')}${s.settings.units === 'st' ? null : html` <span class="body muted">kg</span>`}</span>
          <span class=${'pill-tag ' + (inZone ? 'tint-sage' : 'tint-butter')}>${inZone ? 'Inside your steady zone' : 'A little above your zone'}</span>
        </div>
      </div>
      <${Tiles} s=${s} />
      <div class="list">
        <${Row} icon="list" title="Weigh-in history" onClick=${function () { nav.go('history'); }} />
        <${Row} icon="doc" title="Prescriber pack" onClick=${function () { nav.go('pack'); }} />
      </div>
      <${TabBar} active="progress" />
    </div>`;
  }

  function Score() {
    var s = useApp();
    var safe = s.settings.safeMode, week = LP.weekOf(s);
    var parts = safe ? [
      { name: 'Habits', weight: '67% of your score', value: 86, note: '13 of 15 habit days and both strength sessions' },
      { name: 'Hunger', weight: '33% of your score', value: 74, note: 'Steadier than your first month' }
    ] : [
      { name: 'Weight stability', weight: '40% of your score', value: 85, note: 'Inside your steady zone on 6 of 7 days' },
      { name: 'Habits', weight: '40% of your score', value: 80, note: '13 of 15 habit days and both strength sessions' },
      { name: 'Hunger', weight: '20% of your score', value: 60, note: 'A little hungrier in the evenings than your first month' }];
    return html`<div class="scr plain">
      <div class="topbar"><${Back} fallback="progress" /><span class="caption muted">Week ${week - 1}</span><span style=${{ width: 44 }}></span></div>
      <div class="stack center" style=${{ gap: 14 }}>
        <${L.ScoreRing} score=${safe ? s.scoreSafe : LP.lastScore(s)} size=${150} />
        <h1 class="t-title">About your score</h1>
        <p class="body muted">It rewards steady habits, not weight loss. ${safe ? 'In safe mode, two parts make it up.' : 'Three parts make it up.'}</p>
      </div>
      <div class="stack">
        ${parts.map(function (p) { return html`<div key=${p.name} class="card" style=${{ gap: 8 }}>
          <div class="between"><span class="strong">${p.name}</span><span class="caption muted">${p.weight}</span></div>
          <div class="row"><div class="meter grow"><span style=${{ width: p.value + '%' }}></span></div><span class="t-heading" style=${{ width: 36, textAlign: 'right' }}>${p.value}</span></div>
          <span class="caption muted">${p.note}</span></div>`; })}
      </div>
    </div>`;
  }

  function WhatChanged() {
    return html`<div class="scr plain">
      <div class="topbar"><${Back} fallback="progress" /></div>
      <${L.NudgeCard} title="Things shifted a little this week">That's common around week 10. Nothing has gone wrong.<//>
      <div class="stack">
        <h1 class="t-heading">What we noticed</h1>
        <div class="list">
          <${Row} icon="drift" tint="tint-butter" title="Your 7-day average has drifted up a little" />
          <${Row} icon="hunger" tint="tint-sky" title="Evenings have felt hungrier" />
          <${Row} icon="protein" tint="tint-apricot" title="Fewer protein breakfasts than last week" />
        </div>
      </div>
      <div class="card tint-sage" style=${{ gap: 6 }}>
        <span class="label">WHAT TENDS TO HELP</span>
        <p class="body">A reset week: three simpler habits for seven days. It's never about eating less.</p>
      </div>
      <div class="foot">
        <${Btn} block onClick=${function () { nav.go('reset-week'); }}>Start a reset week<//>
        <${Btn} variant="quiet" size="sm" style=${{ alignSelf: 'center' }} onClick=${function () { nav.back('progress'); }}>Not now<//>
      </div>
    </div>`;
  }

  var RESET_IDS = ['resetProtein', 'resetWalk', 'resetTable'];
  function ResetWeek() {
    var s = useApp();
    var active = s.reset.active, ends = active ? s.reset.ends : LP.addDays(LP.TODAY, 7);
    function start() {
      set(function (s) {
        s.reset = { active: true, ends: LP.addDays(LP.TODAY, 7), saved: s.habits };
        s.habits = { ids: RESET_IDS.slice(), done: {}, today: {}, swappedFrom: null };
        RESET_IDS.forEach(function (id) { s.habits.done[id] = 0; });
        return s;
      });
      nav.reset('today'); toast('Reset week started. Your plan picks up again on ' + LP.fmt.short(LP.addDays(LP.TODAY, 7)) + '.');
    }
    function end() {
      set(function (s) { if (s.reset.saved) s.habits = s.reset.saved; s.reset = { active: false, ends: null, saved: null }; s.flags.drift = false; return s; });
      nav.reset('today'); toast('Reset week ended. Back to your plan.');
    }
    return html`<div class="scr plain">
      <div class="topbar"><${Back} fallback="today" /><span class="pill-tag tint-butter">7 days · ends ${LP.fmt.short(ends)}</span></div>
      <div class="stack">
        <h1 class="t-title">Your reset week</h1>
        <p class="body-lg muted">Simpler habits for seven days. Your plan picks up where it left off afterwards.</p>
      </div>
      <div class="stack">
        ${RESET_IDS.map(function (id) {
          var on = active && !!s.habits.today[id];
          return html`<${L.HabitCheck} key=${id} id=${'rs-' + id} label=${LP.HABITS[id].label} detail=${LP.HABITS[id].note} checked=${on}
            onChange=${function (v) { if (!active) return; set(function (s) { s.habits.today[id] = v; s.habits.done[id] = Math.max(0, (s.habits.done[id] || 0) + (v ? 1 : -1)); return s; }); }} />`;
        })}
      </div>
      <div class="card tint-sunk" style=${{ flexDirection: 'row', gap: 10, alignItems: 'center' }}><${Icon} name="workout" size=${20} /><span class="body">Strength sessions stay as they are.</span></div>
      <div class="foot">
        ${active ? html`<${Btn} block variant="secondary" onClick=${end}>End reset week early<//>` : html`<${Btn} block onClick=${start}>Start reset week<//>`}
      </div>
    </div>`;
  }

  function History() {
    var s = useApp();
    var ms = React.useState(14), shown = ms[0], setShown = ms[1];
    var list = LP.weightsSorted(s);
    return html`<div class="scr plain" style=${{ gap: 16 }}>
      <div class="topbar"><${Back} fallback="progress" /><button type="button" class="iconbtn" aria-label="Add a weigh-in" onClick=${function () { nav.sheet('quicklog'); }}><${Icon} name="plus" /></button></div>
      <div class="stack" style=${{ gap: 4 }}>
        <h1 class="t-title">Weigh-in history</h1>
        <p class="caption muted">Tap an entry to edit or delete it. One entry a day; the latest wins.</p>
      </div>
      ${list.length ? html`<div class="list">
        ${list.slice(0, shown).map(function (e) {
          return html`<button key=${e.date} type="button" class="li" onClick=${function () { nav.sheet('weighin', e.date); }}>
            <span class="grow" style=${{ display: 'flex', flexDirection: 'column' }}><span class="strong">${LP.fmt.short(e.date)}</span><span class="caption muted">${e.source}</span></span>
            <span style=${{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>${LP.fmtWeight(s, e.kg)}</span>
            <${Icon} name="chevron" size=${18} /></button>`;
        })}
      </div>` : html`<div class="card tint-sunk"><p class="body">No weigh-ins yet. Add one with the plus button, or connect Apple Health.</p></div>`}
      ${list.length > shown ? html`<${Btn} variant="secondary" size="sm" style=${{ alignSelf: 'center' }} onClick=${function () { setShown(shown + 30); }}>Show older entries<//>` : null}
    </div>`;
  }

  function WeighInSheet() {
    var s = useApp();
    var date = s.sheet && s.sheet.data, entry = s.weights.find(function (w) { return w.date === date; }) || { kg: '' };
    var st = React.useState(String(entry.kg)), val = st[0], setVal = st[1];
    var er = React.useState(null), err = er[0], setErr = er[1];
    var cf = React.useState(false), confirm = cf[0], setConfirm = cf[1];
    function save() {
      var v = parseFloat(val);
      if (!(v >= 35 && v <= 300)) { setErr('That doesn’t look right. Check for a missing decimal point, like 78.4.'); return; }
      set(function (s) { var w = s.weights.find(function (x) { return x.date === date; }); if (w) { w.kg = Math.round(v * 10) / 10; w.source = 'Edited by you'; } s.sheet = null; return s; });
      toast('Weigh-in updated.');
    }
    function del() { set(function (s) { s.weights = s.weights.filter(function (x) { return x.date !== date; }); s.sheet = null; return s; }); toast('Weigh-in deleted.'); }
    return html`<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="wi-title">
      <span class="grab"></span>
      <div class="between">
        <div class="stack" style=${{ gap: 0 }}><h1 id="wi-title" class="t-heading" style=${{ fontSize: 24, lineHeight: '30px' }}>${date ? LP.fmt.long(date) : 'Weigh-in'}</h1><span class="caption muted">${entry.source || ''}</span></div>
        <button type="button" class="iconbtn" aria-label="Close" onClick=${function () { nav.sheet(null); }}><${Icon} name="close" /></button>
      </div>
      <${L.TextField} id="wi-kg" label="Weight" suffix="kg" inputMode="decimal" value=${val} error=${err} onChange=${function (e) { setVal(e.target.value); setErr(null); }} />
      <${Btn} block onClick=${save}>Save<//>
      ${confirm ? html`<div class="card tint-rose" style=${{ gap: 10 }}><p class="body">Delete this weigh-in? Your trend will be worked out without it.</p>
          <div class="row"><${Btn} variant="danger" size="sm" style=${{ flex: 1 }} onClick=${del}>Delete<//><${Btn} variant="secondary" size="sm" style=${{ flex: 1 }} onClick=${function () { setConfirm(false); }}>Keep it<//></div></div>`
        : html`<${Btn} variant="quiet" size="sm" style=${{ alignSelf: 'center', color: 'var(--rose-ink)' }} onClick=${function () { setConfirm(true); }}>Delete this weigh-in<//>`}
    </div>`;
  }

  function Pack() {
    var s = useApp();
    var rs = React.useState('Last 4 weeks'), range = rs[0], setRange = rs[1];
    var week = LP.weekOf(s), full = Math.max(1, week - 1);
    var weeks = range === 'Last 4 weeks' ? Math.min(4, full) : full;
    var hdTotal = weeks * 15, hd = Math.round(hdTotal * 0.85), sess = weeks * 2;
    var days = range === 'Last 4 weeks' ? 28 : range === 'Last 12 weeks' ? 84 : Math.max(8, LP.daysBetween(s.ob.lastInjection, LP.TODAY) + 1);
    var pts = []; for (var i = days - 1; i >= 0; i -= Math.max(1, Math.floor(days / 14))) { var a = LP.avg7(s, LP.addDays(LP.TODAY, -i)); if (a != null) pts.push(a); }
    var zone = LP.steadyZone(s), lo = Math.min.apply(null, pts.concat(zone)) - 0.5, hi = Math.max.apply(null, pts.concat(zone)) + 0.5;
    function Y(v) { return 66 - (v - lo) / (hi - lo) * 62; }
    var path = pts.map(function (v, k) { return (k ? 'L' : 'M') + (4 + k / Math.max(1, pts.length - 1) * 292).toFixed(1) + ' ' + Y(v).toFixed(1); }).join(' ');
    var rowsA = [['Name', s.name + ' ' + s.surname], ['Last injection', LP.fmt.dmy(s.ob.lastInjection)], ['Weight at start', s.ob.startWeight + ' kg'], ['Lowest weight', s.ob.lowestWeight + ' kg'], ['7-day average now', LP.avg7(s) != null ? LP.avg7(s).toFixed(1) + ' kg' : '–']];
    var rowsB = [['Habit days completed', hd + ' of ' + hdTotal], ['Strength sessions', sess + ' of ' + sess]];
    function grid(rows) { return html`<div style=${{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '6px 12px' }}>${rows.map(function (r) { return [html`<span key=${r[0] + 'k'} style=${{ color: '#6A6371' }}>${r[0]}</span>`, html`<span key=${r[0] + 'v'} style=${{ fontWeight: 700 }}>${r[1]}</span>`]; })}</div>`; }
    return html`<div class="scr plain" style=${{ gap: 16 }}>
      <div class="topbar"><${Back} fallback="progress" /></div>
      <div class="stack" style=${{ gap: 6 }}>
        <h1 class="t-title">Prescriber pack</h1>
        <p class="body muted">A one-page summary to share at your next appointment. It shows your trend and habits only, never recommendations.</p>
      </div>
      <${Choices} sm label="Time range" options=${['Last 4 weeks', 'Last 12 weeks', 'Since stopping']} value=${range} onChange=${setRange} />
      <div style=${{ background: '#FFFFFF', color: '#2E2A33', borderRadius: 12, boxShadow: 'var(--shadow-lg)', padding: 18, display: 'flex', flexDirection: 'column', gap: 12, fontSize: 12, lineHeight: '16px' }}>
        <div class="between"><img src=${LP.ASSETS.lockup} alt="steadie" style=${{ width: 92, height: 25 }} /><span style=${{ fontWeight: 700, color: '#6A6371' }}>${LP.fmt.dmy(LP.TODAY)}</span></div>
        <div style=${{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600 }}>Summary for your prescriber</div>
        ${grid(rowsA)}
        <svg viewBox="0 0 300 70" width="100%" height="70" role="img" aria-label=${'Weight trend, ' + range.toLowerCase()}>
          <rect x="0" y=${Y(zone[1]).toFixed(1)} width="300" height=${(Y(zone[0]) - Y(zone[1])).toFixed(1)} rx="6" fill="#CDE3D2"></rect>
          <path d=${path} fill="none" stroke="#2E2A33" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
        ${grid(rowsB)}
        <div style=${{ borderTop: '1px solid #E6DED5', paddingTop: 8, color: '#6A6371' }}>Made with Steadie, a general wellness app. It records habits only and gives no medical advice.</div>
      </div>
      <div class="foot"><${Btn} block onClick=${function () { toast('In the app this opens the iPhone share sheet with the PDF.'); }}>Share PDF<//></div>
    </div>`;
  }

  /* ---------- Coach ---------- */
  var MED = /\b(dose|doses|dosage|taper|tapering|restart|re-start|go back on|come off|stop(ping)? (the |my )?(jab|injection|medication|meds)|medication|meds|mounjaro|wegovy|ozempic|saxenda|tirzepatide|semaglutide|liraglutide|mg)\b/i;
  function reply(text, s) {
    if (MED.test(text)) return { redirect: true, pack: true, text: 'That’s a decision for your prescriber, so I can’t help with doses. I can make a one-page summary of your trend and habits to take with you.' };
    var t = text.toLowerCase();
    if (/savoury|savory|lunch/.test(t)) return { text: 'A tuna and bean salad, or cottage cheese on rye with tomatoes. Both get you 25 to 30 g with almost no cooking.' };
    if (/breakfast/.test(t)) return { text: 'Eggs on toast, Greek yoghurt with seeds, or porridge made with milk and a scoop of protein. All three get you past 25 g.' };
    if (/hungry|hunger|tonight|craving|snack|sweet/.test(t)) return { text: 'Evening hunger is common now your appetite is back. Have the protein on your plate first, then wait ten minutes before deciding on more. If you still want something, a yoghurt or a boiled egg is a good bridge.' };
    if (/out|restaurant|holiday|party|weekend|takeaway/.test(t)) return { text: 'Have a look at the menu before you go and pick a protein-first main. Enjoy the meal. One evening out won’t undo a steady week.' };
    if (/workout|strength|exercise|gym|session|sore/.test(t)) return { text: 'Two short sessions a week is plenty right now. If a session feels like too much, do the first three moves and call it done.' };
    if (/bad day|hard day|struggl|guilt|rubbish|awful|give up|failed/.test(t)) return { text: 'Hard days happen to everyone, and nothing is undone by one of them. Pick the smallest habit you can manage this evening and leave the rest for tomorrow.' };
    if (/weight|scale|gain|heavier/.test(t)) return s.settings.safeMode ? { text: 'Let’s keep the focus on routines. Which habit felt easiest this week? We can build from that one.' } : { text: 'Day-to-day weight moves with water, salt and sleep. Your 7-day average is the number to watch, and the steady zone is there so small changes don’t worry you.' };
    if (/thank/.test(t)) return { text: 'Any time. I’m here whenever you want ideas or a hand with a tricky day.' };
    return { text: 'I can help with high-protein meal ideas, planning for meals out, and getting through harder days. What would help most right now?' };
  }
  function MeetCoach() {
    function start() { set(function (s) { s.coach.introSeen = true; return s; }); nav.reset('coach'); }
    return html`<div class="scr">
      <div aria-hidden="true" style=${{ position: 'relative', height: 150, flex: 'none' }}>
        <span style=${{ position: 'absolute', left: 0, top: 10, width: 200, height: 96, borderRadius: '32px 32px 32px 10px', background: 'var(--lilac)' }}></span>
        <span style=${{ position: 'absolute', right: 0, top: 70, width: 150, height: 64, borderRadius: '28px 28px 10px 28px', background: 'var(--surface-raised)', boxShadow: 'var(--shadow-sm)' }}></span>
        ${[28, 52, 76].map(function (x, i) { return html`<span key=${x} style=${{ position: 'absolute', left: x, top: 46, width: 14, height: 14, borderRadius: 9999, background: 'var(--on-pastel)', opacity: .7 - i * .2 }}></span>`; })}
      </div>
      <div class="stack"><h1 class="t-title">Meet your coach</h1><p class="body-lg muted">Ask anything about habits, food and getting through a tricky day.</p></div>
      <div class="card tint-lilac" style=${{ gap: 8 }}>
        <span class="label">GOOD AT</span>
        <p class="body">High-protein swaps and quick meal ideas</p>
        <p class="body">Planning for meals out, holidays and busy weeks</p>
        <p class="body">Talking through cravings and harder days</p>
      </div>
      <div class="card tint-sky" style=${{ gap: 6 }}>
        <span class="label">NEVER</span>
        <p class="body">Advice on medication, doses, or stopping and restarting. That's always for your prescriber.</p>
      </div>
      <p class="caption muted">Replies are written by AI and can be wrong. Check anything important with a professional.</p>
      <${Btn} block onClick=${start}>Start chatting<//>
      <${TabBar} active="coach" />
    </div>`;
  }
  function Coach() {
    var s = useApp();
    var ts = React.useState(''), text = ts[0], setText = ts[1];
    var ty = React.useState(false), typing = ty[0], setTyping = ty[1];
    var endRef = React.useRef(null);
    React.useEffect(function () { if (endRef.current) endRef.current.scrollIntoView({ block: 'end' }); }, [s.coach.messages.length, typing]);
    if (!s.coach.introSeen) return html`<${MeetCoach} />`;
    function send(msg) {
      var m = (msg || text).trim(); if (!m) return;
      setText('');
      set(function (s) { s.coach.messages.push({ from: 'you', text: m }); return s; });
      setTyping(true);
      setTimeout(function () { setTyping(false); var r = reply(m, LP.get()); set(function (s) { s.coach.messages.push(Object.assign({ from: 'coach' }, r)); return s; }); }, 900);
    }
    var chips = ['Savoury lunch ideas', "I'm hungry tonight", 'Eating out this weekend'];
    return html`<div class="scr" style=${{ gap: 14 }}>
      <div class="topbar">
        <div class="row"><span style=${{ width: 40, height: 40, borderRadius: 9999, background: 'var(--lilac)', display: 'grid', placeItems: 'center', color: 'var(--on-pastel)' }}><${Icon} name="coach" size=${20} /></span><h1 class="t-heading" style=${{ fontSize: 22 }}>Coach</h1></div>
        <${Avatar} />
      </div>
      <div class="chat" aria-live="polite">
        ${s.coach.messages.length ? null : html`<p class="caption muted" style=${{ textAlign: 'center' }}>Ask about food, habits or a hard day.</p>`}
        ${s.coach.messages.map(function (m, i) {
          return html`<${React.Fragment} key=${i}>
            <${L.CoachBubble} from=${m.from} redirect=${!!m.redirect}>${m.text}<//>
            ${m.pack ? html`<button type="button" class="card tint-sunk" style=${{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: '10px 14px', maxWidth: 300 }} onClick=${function () { nav.go('pack'); }}>
              <${Icon} name="doc" size=${18} /><span class="grow" style=${{ fontWeight: 800, fontSize: 14 }}>Open prescriber pack</span></button>` : null}
          <//>`;
        })}
        ${typing ? html`<div class="typing" aria-label="Coach is typing"><span></span><span></span><span></span></div>` : null}
        <div ref=${endRef} style=${{ scrollMarginBottom: 220 }}></div>
      </div>
      <form class="composer" onSubmit=${function (e) { e.preventDefault(); send(); }}>
        <div class="row" style=${{ gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
          ${chips.map(function (c) { return html`<${L.Chip} key=${c} tone="lilac" onClick=${function () { send(c); }}>${c}<//>`; })}
        </div>
        <div class="composer-row">
          <label for="coach-msg" class="sr-only">Message</label>
          <input id="coach-msg" autoComplete="off" placeholder="Ask about food, habits or a hard day" value=${text} onInput=${function (e) { setText(e.target.value); }} />
          <button type="submit" class="iconbtn" aria-label="Send" style=${{ background: 'var(--apricot)', boxShadow: 'none', color: 'var(--on-pastel)' }}><${Icon} name="send" size=${20} w=${2.2} /></button>
        </div>
      </form>
      <${TabBar} active="coach" />
    </div>`;
  }

  Object.assign(window.LP.screens, {
    plan: { c: Plan, id: 'PL1', title: 'Your plan', group: 'Plan', tab: 'plan' },
    week: { c: Week, id: 'PL2', title: 'Week detail', group: 'Plan', tab: 'plan' },
    lesson: { c: Lesson, id: 'PL3', title: 'Lesson', group: 'Plan' },
    'new-phase': { c: NewPhase, id: 'PL4', title: 'New phase', group: 'Plan' },
    progress: { c: Progress, id: 'PR1', title: 'Progress', group: 'Progress', tab: 'progress' },
    score: { c: Score, id: 'PR2', title: 'About your score', group: 'Progress' },
    'what-changed': { c: WhatChanged, id: 'PR3', title: 'What changed', group: 'Progress' },
    'reset-week': { c: ResetWeek, id: 'PR4', title: 'Your reset week', group: 'Progress' },
    history: { c: History, id: 'PR5', title: 'Weigh-in history', group: 'Progress' },
    pack: { c: Pack, id: 'PR6', title: 'Prescriber pack', group: 'Progress' },
    coach: { c: Coach, id: 'C1–C2', title: 'Coach', group: 'Coach', tab: 'coach' }
  });
  window.LP.sheets.weighin = { c: WeighInSheet, id: 'PR5', title: 'Edit a weigh-in' };
})();
