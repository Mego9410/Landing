/* Exercise demos: the movement cast (packages/motion via src/motion.js), the picker used in onboarding and settings,
   and the live animation used in sessions. */
(function () {
  'use strict';
  var LP = window.LP, html = LP.html, set = LP.set, M = window.LandingMotion;
  var Toggle = LP.ui.Toggle;

  var DEFAULTS = { who: 'mix', still: false, ghost: true };
  function prefs(s) { return Object.assign({}, DEFAULTS, s.demos || {}); }
  function setPrefs(patch) { set(function (s) { s.demos = Object.assign({}, DEFAULTS, s.demos || {}, patch); return s; }); }
  /* "Mix it up" gives each session its own person, the same every time that session is opened that week. */
  function whoFor(s, key) { var p = prefs(s); return p.who === 'mix' ? M.mixFor(key) : p.who; }
  function nameOf(id) { var c = M.cast.find(function (c) { return c.id === id; }); return c ? c.name : ''; }

  /* A live loop. Paused, Reduce Motion or the still-pictures setting show still frames. */
  function Motion(p) {
    var ref = React.useRef(null), ctl = React.useRef(null);
    var opts = { id: p.id, who: p.who, paused: !!p.paused, still: !!p.still, ghost: !!p.ghost, label: p.label };
    React.useEffect(function () {
      if (!ref.current || !M) return;
      ctl.current = M.mount(ref.current, opts);
      return function () { ctl.current.destroy(); ctl.current = null; };
    }, []);
    React.useEffect(function () { if (ctl.current) ctl.current.update(opts); }, [p.id, p.who, p.paused, p.still, p.ghost]);
    return html`<svg ref=${ref} style=${Object.assign({ display: 'block', width: '100%', height: '100%' }, p.style)}></svg>`;
  }
  /* A still of an exercise's starting position, for lists. */
  function Thumb(p) {
    return html`<span aria-hidden="true" style=${Object.assign({ display: 'block', width: '100%', height: '100%' }, p.style)} dangerouslySetInnerHTML=${{ __html: M ? M.stillSvg(p.id, p.who) : '' }}></span>`;
  }
  function Portrait(p) {
    return html`<span aria-hidden="true" style=${{ display: 'block', width: '100%', height: '100%' }} dangerouslySetInnerHTML=${{ __html: M ? M.portraitSvg(p.who) : '' }}></span>`;
  }

  /* The six people as a grid of cards, plus the Mix it up switch. */
  function CastPicker(p) {
    var compact = !!p.compact, value = p.value;
    return html`<div class="stack" style=${{ gap: 12 }}>
      <div role="group" aria-label="Who shows you the moves" style=${{ display: 'grid', gridTemplateColumns: 'repeat(' + (compact ? 6 : 3) + ', minmax(0, 1fr))', gap: compact ? 6 : 10 }}>
        ${M.cast.map(function (c) {
          var on = value === c.id;
          return html`<button key=${c.id} type="button" class="castpick" aria-pressed=${on} aria-label=${c.name}
            onClick=${function () { p.onChange(c.id); }}
            style=${{ boxShadow: on ? 'inset 0 0 0 3px var(--apricot-ink)' : 'var(--shadow-sm)' }}>
            <span style=${{ display: 'block', height: compact ? 64 : 112, background: on ? 'var(--apricot)' : 'var(--sky)' }}><${Portrait} who=${c.id} /></span>
            <span style=${{ display: 'block', padding: compact ? '4px 0 6px' : '8px 0 10px', fontSize: compact ? 11 : 15, fontWeight: 800 }}>${c.name}</span>
          </button>`;
        })}
      </div>
      <div class="li card" style=${{ padding: '12px 16px', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <span class="grow stack" style=${{ gap: 2 }}><span class="strong">Mix it up</span><span class="caption muted">A different person each session</span></span>
        <${Toggle} on=${value === 'mix'} label="Mix it up" onClick=${function () { p.onChange(value === 'mix' ? (p.last || 'grace') : 'mix'); }} />
      </div>
    </div>`;
  }

  LP.demo = { prefs: prefs, setPrefs: setPrefs, whoFor: whoFor, nameOf: nameOf, Motion: Motion, Thumb: Thumb, Portrait: Portrait, CastPicker: CastPicker };
})();
