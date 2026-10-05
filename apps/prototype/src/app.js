/* App shell: phone frame, routing rules, tab bar, sheets, toast and the test panel. */
(function () {
  'use strict';
  var LP = window.LP, html = LP.html, L = LP.L, nav = LP.nav, set = LP.set, useApp = LP.useApp, toast = LP.toast;
  var SCREENS = LP.screens, SHEETS = LP.sheets;
  var PRE_APP = { 'Entry and sign-in': 1, Onboarding: 1, Paywall: 1 };

  // Which screen actually shows for a route, given the state (lapsed subscription, a new phase to introduce).
  function resolve(s, name) {
    if (!SCREENS[name]) return 'launch';
    var meta = SCREENS[name];
    if (meta.tab && s.sub.status === 'lapsed') return 'lapsed';
    if (name === 'today') { var p = LP.phaseOf(LP.weekOf(s)); if (p.key !== 'land' && !s.phaseSeen[p.key]) return 'new-phase'; }
    return name;
  }

  /* ---------- test panel actions ---------- */
  function load(fn) { var t = LP.get().theme; set(function () { var s = fn(); s.theme = t; return s; }); }
  var START = {
    fresh: function () { load(LP.blankState); nav.reset('launch'); toast('Fresh install. Tap the logo to begin.'); },
    demo: function () { load(function () { return LP.demoState(6); }); nav.reset('today'); },
    firstDay: function () {
      load(function () {
        var s = LP.demoState(6);
        s.firstDay = true; s.protein = {}; s.hunger = []; s.workouts.done = {}; s.coach = { introSeen: false, messages: [] };
        s.habits.done = { protein: 0, strength: 0, pause: 0 }; s.habits.today = {};
        s.weights = s.weights.filter(function (w) { return w.date === LP.TODAY; });
        return s;
      });
      nav.reset('today');
    },
    onboarding: function () { load(function () { var s = LP.blankState(); s.auth = { signedIn: true, email: 'hannah.r@example.com', method: 'apple' }; s.nav.stack = ['ob-status']; return s; }); nav.reset('ob-status'); }
  };
  function setFlag(k, v) { set(function (s) { s.flags[k] = v; return s; }); }
  function setDrift(on) {
    set(function (s) {
      if (on && !s.flags.drift) {
        s.flags.driftBackup = s.weights.map(function (w) { return [w.date, w.kg]; });
        s.weights.forEach(function (w) { var n = LP.daysBetween(w.date, LP.TODAY); if (n >= 0 && n < 12) w.kg = Math.round((w.kg + (12 - n) * 0.12) * 10) / 10; });
      }
      if (!on && s.flags.drift && s.flags.driftBackup) {
        var map = {}; s.flags.driftBackup.forEach(function (r) { map[r[0]] = r[1]; });
        s.weights.forEach(function (w) { if (map[w.date] != null) w.kg = map[w.date]; });
        s.flags.driftBackup = null;
      }
      s.flags.drift = on; return s;
    });
  }
  function setWeek(w) {
    set(function (s) {
      var before = LP.phaseOf(LP.weekOf(s)).key;
      LP.setWeek(s, w);
      var after = LP.phaseOf(w).key;
      if (after !== before && after !== 'land') s.phaseSeen[after] = false;
      if (s.reset.active) s.reset = { active: false, ends: null, saved: null };
      return s;
    });
    nav.reset('today');
  }
  function jump(name) {
    var s = LP.get(), meta = SCREENS[name];
    if (!PRE_APP[meta.group] && !s.onboarded) load(function () { return LP.demoState(6); });
    if (name === 'coach') set(function (s) { s.coach.introSeen = true; return s; });
    if (name === 'new-phase') set(function (s) { var p = LP.phaseOf(LP.weekOf(s)); if (p.key === 'land') LP.setWeek(s, 9); s.phaseSeen.settle = false; return s; });
    if (name === 'lapsed') set(function (s) { s.sub.status = 'lapsed'; return s; });
    if (name === 'in-session') set(function (s) { s.workouts.active = s.workouts.active || { id: 'B', move: 1, set: 2, paused: false }; return s; });
    if (name === 'week-summary') setFlag('weekSummary', true);
    nav.reset(name);
  }
  function openSheet(name) {
    if (!LP.get().onboarded) load(function () { return LP.demoState(6); });
    var s = LP.get();
    if (resolve(s, s.nav.stack[s.nav.stack.length - 1]) !== 'today' && name !== 'weighin') nav.reset('today');
    if (name === 'weighin') { nav.reset('history'); nav.sheet('weighin', LP.weightsSorted(LP.get())[0].date); return; }
    nav.sheet(name);
  }
  function applyTheme(t) { var r = document.documentElement; if (t === 'light' || t === 'dark') r.setAttribute('data-theme', t); else r.removeAttribute('data-theme'); }

  function Pbtn(p) { return html`<button type="button" class=${'pbtn' + (p.on ? ' on' : '') + (p.warn ? ' warn' : '')} aria-pressed=${p.on == null ? null : !!p.on} onClick=${p.onClick}>${p.children}</button>`; }
  function Panel(p) {
    var s = useApp();
    var cur = p.current, week = LP.weekOf(s);
    var groups = {};
    Object.keys(SCREENS).forEach(function (k) { var m = SCREENS[k]; (groups[m.group] = groups[m.group] || []).push(k); });
    return html`<aside class=${'panel' + (p.open ? ' open' : '')} aria-label="Test panel">
      <div class="between"><h2>Test panel</h2>${p.open ? html`<button type="button" class="pbtn" onClick=${p.onClose}>Close</button>` : null}</div>
      <p class="note">Prototype controls. Nothing here is part of the app. Your changes save in this browser.</p>
      <section><h3>Start from</h3><div class="pbtns">
        <${Pbtn} onClick=${START.fresh}>Fresh install<//>
        <${Pbtn} onClick=${START.onboarding}>Onboarding<//>
        <${Pbtn} onClick=${START.firstDay}>First day<//>
        <${Pbtn} onClick=${START.demo}>Hannah, week 6<//>
      </div></section>
      <section><h3>Plan week</h3>
        <div class="prow"><label for="tp-week">Week ${week} · ${LP.phaseOf(week).name}</label>
          <select id="tp-week" value=${week} onChange=${function (e) { setWeek(+e.target.value); }}>
            ${Array.from({ length: 52 }, function (_, i) { return html`<option key=${i} value=${i + 1}>Week ${i + 1}</option>`; })}
          </select></div>
        <div class="pbtns">${[1, 6, 8, 9, 27].map(function (w) { return html`<${Pbtn} key=${w} on=${week === w} onClick=${function () { setWeek(w); }}>${w === 9 ? 'Week 9 (Settle)' : w === 27 ? 'Week 27 (Steady)' : 'Week ' + w}<//>`; })}</div>
      </section>
      <section><h3>States</h3><div class="pbtns">
        <${Pbtn} on=${s.settings.safeMode} onClick=${function () { set(function (s) { s.settings.safeMode = !s.settings.safeMode; return s; }); }}>Safe mode<//>
        <${Pbtn} on=${s.flags.drift} onClick=${function () { setDrift(!s.flags.drift); }}>Drift nudge<//>
        <${Pbtn} on=${s.reset.active} onClick=${function () { nav.reset('reset-week'); }}>Reset week<//>
        <${Pbtn} on=${s.flags.offline} onClick=${function () { setFlag('offline', !s.flags.offline); }}>Offline<//>
        <${Pbtn} on=${s.flags.evening} onClick=${function () { setFlag('evening', !s.flags.evening); }}>Evening<//>
        <${Pbtn} on=${s.flags.weekSummary} onClick=${function () { setFlag('weekSummary', !s.flags.weekSummary); }}>Week summary ready<//>
      </div></section>
      <section><h3>Subscription</h3><div class="pbtns">
        ${[['none', 'None'], ['trial', 'Free trial'], ['active', 'Paid'], ['lapsed', 'Ended']].map(function (o) { return html`<${Pbtn} key=${o[0]} on=${s.sub.status === o[0]} onClick=${function () { set(function (s) { s.sub.status = o[0]; return s; }); }}>${o[1]}<//>`; })}
      </div></section>
      <section><h3>Theme</h3><div class="pbtns">
        ${[['system', 'Match device'], ['light', 'Light'], ['dark', 'Dark']].map(function (o) { return html`<${Pbtn} key=${o[0]} on=${s.theme === o[0]} onClick=${function () { set(function (s) { s.theme = o[0]; return s; }); }}>${o[1]}<//>`; })}
      </div></section>
      <section><h3>Open a sheet</h3><div class="pbtns">
        <${Pbtn} onClick=${function () { openSheet('quicklog'); }}>T2 Quick log<//>
        <${Pbtn} onClick=${function () { openSheet('swap'); }}>T3 Swap a habit<//>
        <${Pbtn} onClick=${function () { openSheet('weighin'); }}>Edit a weigh-in<//>
      </div></section>
      <section><h3>Jump to a screen</h3>
        ${Object.keys(groups).map(function (g) {
          return html`<details key=${g} open=${groups[g].indexOf(cur) >= 0}>
            <summary>${g}</summary>
            <div class="screens">${groups[g].map(function (k) { var m = SCREENS[k]; return html`<button key=${k} type="button" class=${k === cur ? 'on' : ''} onClick=${function () { jump(k); if (p.onClose) p.onClose(); }}><span>${m.title}</span><code>${m.id}</code></button>`; })}</div>
          </details>`;
        })}
      </section>
      <section><h3>Data</h3><div class="pbtns"><${Pbtn} warn onClick=${START.fresh}>Clear everything<//></div></section>
    </aside>`;
  }

  function App() {
    var s = useApp();
    var po = React.useState(false), panelOpen = po[0], setPanelOpen = po[1];
    var route = s.nav.stack[s.nav.stack.length - 1];
    var name = resolve(s, route), meta = SCREENS[name], Screen = meta.c;
    var sheet = s.sheet && SHEETS[s.sheet.name];
    React.useEffect(function () { applyTheme(s.theme); }, [s.theme]);
    React.useEffect(function () {
      try { if (location.hash.slice(1) !== name) history.replaceState(null, '', '#' + name); } catch (e) {}
      document.title = meta.title === 'Launch' ? 'Landing Prototype' : meta.title + ' · Landing Prototype';
    }, [name]);
    React.useEffect(function () {
      function onKey(e) { if (e.key === 'Escape' && LP.get().sheet) nav.sheet(null); }
      window.addEventListener('keydown', onKey);
      return function () { window.removeEventListener('keydown', onKey); };
    }, []);
    var tab = meta.tab || (name === 'lapsed' ? null : null);
    return html`<div class="proto">
      <main class="device" aria-label="Landing app">
        <div class="viewport"><div class="screen-enter" key=${name + ':' + s.nav.stack.length} style=${{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}><${Screen} /></div></div>
        ${tab ? html`<div class="tabslot"><${L.TabBar} active=${tab} onChange=${nav.tab} /></div>` : null}
        ${sheet ? html`<div class="sheet-layer"><button type="button" class="dim" aria-label="Close" onClick=${function () { nav.sheet(null); }}></button><${sheet.c} key=${s.sheet.name + (s.sheet.data || '')} /></div>` : null}
        ${s.toast ? html`<div class=${'toast' + (tab ? '' : ' low')} role="status">${s.toast}</div>` : null}
      </main>
      <${Panel} current=${name} open=${panelOpen} onClose=${panelOpen ? function () { setPanelOpen(false); } : null} />
      <button type="button" class="panel-fab" aria-expanded=${panelOpen} onClick=${function () { setPanelOpen(!panelOpen); }}>${panelOpen ? 'Close' : 'Test panel'}</button>
    </div>`;
  }

  // Open the screen named in the link, if any (for example …/index.html#progress).
  (function () {
    try {
      var h = location.hash.slice(1);
      if (h && SCREENS[h] && h !== LP.get().nav.stack[LP.get().nav.stack.length - 1]) jump(h);
    } catch (e) {}
  })();
  ReactDOM.createRoot(document.getElementById('root')).render(html`<${App} />`);
})();
