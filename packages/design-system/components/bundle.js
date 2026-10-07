/* @ds-bundle: {"format":4,"namespace":"Steadie","components":[{"name":"Button"},{"name":"Chip"},{"name":"Card"},{"name":"HabitCheck"},{"name":"ScoreRing"},{"name":"HungerScale"},{"name":"NudgeCard"},{"name":"CoachBubble"},{"name":"TextField"},{"name":"TabBar"}]} */
(function () {
  var React = window.React, h = React.createElement;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  function omit(o, keys) { var r = {}; for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k) && keys.indexOf(k) < 0) r[k] = o[k]; return r; }
  function svg(paths, size) {
    return h('svg', { viewBox: '0 0 24 24', width: size || 24, height: size || 24, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, dangerouslySetInnerHTML: { __html: paths } });
  }
  var ICONS = {
    today: '<circle cx="12" cy="12" r="4"/><path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21M5.6 5.6l1.1 1.1M17.3 17.3l1.1 1.1M5.6 18.4l1.1-1.1M17.3 6.7l1.1-1.1"/>',
    plan: '<path d="M6 18.5c0-4 3-5 6-6.5s6-2.5 6-6.5"/><circle cx="6" cy="19" r="1.6"/><circle cx="18" cy="5" r="1.6"/>',
    progress: '<path d="M4 19.5h16"/><path d="M5 15l4.5-4.5 3.5 3 6-6"/>',
    coach: '<path d="M7 4.5h10a3 3 0 0 1 3 3v5.5a3 3 0 0 1-3 3h-5.5L7.5 19.5V16H7a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    reset: '<path d="M5 12a7 7 0 1 0 2.1-5"/><path d="M5 4.5V8h3.5"/>'
  };

  function Button(p) {
    var rest = omit(p, ['variant', 'size', 'block', 'icon', 'className', 'children']);
    return h('button', Object.assign({ type: 'button' }, rest, {
      className: cx('ld-btn', 'ld-btn--' + (p.variant || 'primary'), 'ld-btn--' + (p.size || 'md'), p.block && 'ld-btn--block', p.className)
    }), p.icon && ICONS[p.icon] ? svg(ICONS[p.icon], 20) : null, p.children);
  }

  function Chip(p) {
    var cls = cx('ld-chip', 'ld-chip--' + (p.tone || 'neutral'), p.selected && 'is-selected', p.className);
    if (p.onClick) return h('button', { type: 'button', className: cls, onClick: p.onClick, 'aria-pressed': !!p.selected }, p.children);
    return h('span', { className: cls }, p.children);
  }

  function Card(p) {
    var rest = omit(p, ['tone', 'hero', 'className', 'children']);
    return h('div', Object.assign({}, rest, { className: cx('ld-card', 'ld-card--' + (p.tone || 'raised'), p.hero && 'ld-card--hero', p.className) }), p.children);
  }

  function HabitCheck(p) {
    var id = p.id || ('hc-' + String(p.label).replace(/\W+/g, '-').toLowerCase());
    return h('label', { className: cx('ld-habit', p.checked && 'is-done'), htmlFor: id },
      h('input', { id: id, type: 'checkbox', className: 'ld-habit__input', checked: !!p.checked, onChange: function (e) { p.onChange && p.onChange(e.target.checked); } }),
      h('span', { className: 'ld-habit__box', 'aria-hidden': true }, svg(ICONS.check, 18)),
      h('span', { className: 'ld-habit__text' },
        h('span', { className: 'ld-habit__label' }, p.label),
        p.detail ? h('span', { className: 'ld-habit__detail' }, p.detail) : null));
  }

  function ScoreRing(p) {
    var size = p.size || 168, stroke = Math.round(size / 11), r = (size - stroke) / 2, c = 2 * Math.PI * r;
    var score = Math.max(0, Math.min(100, Math.round(p.score || 0)));
    return h('div', { className: 'ld-score', style: { width: size, height: size }, role: 'img', 'aria-label': (p.label || 'Steady score') + ': ' + score + ' out of 100' },
      h('svg', { width: size, height: size, viewBox: '0 0 ' + size + ' ' + size, 'aria-hidden': true },
        h('circle', { className: 'ld-score__track', cx: size / 2, cy: size / 2, r: r, strokeWidth: stroke, fill: 'none' }),
        h('circle', { className: 'ld-score__arc', cx: size / 2, cy: size / 2, r: r, strokeWidth: stroke, fill: 'none', strokeLinecap: 'round', strokeDasharray: c, strokeDashoffset: c * (1 - score / 100), transform: 'rotate(-90 ' + size / 2 + ' ' + size / 2 + ')' })),
      h('div', { className: 'ld-score__center' },
        h('span', { className: 'ld-score__num' }, score),
        h('span', { className: 'ld-score__label' }, p.label || 'Steady score')));
  }

  function HungerScale(p) {
    var v = p.value;
    return h('div', { className: 'ld-hunger', role: 'radiogroup', 'aria-label': p.label || 'Hunger, 1 to 5' },
      h('div', { className: 'ld-hunger__row' }, [1, 2, 3, 4, 5].map(function (n) {
        return h('button', { key: n, type: 'button', role: 'radio', 'aria-checked': v === n, className: cx('ld-hunger__dot', v === n && 'is-selected'), onClick: function () { p.onChange && p.onChange(n); } }, n);
      })),
      h('div', { className: 'ld-hunger__ends' }, h('span', null, p.lowLabel || 'Very hungry'), h('span', null, p.highLabel || 'Comfortably full')));
  }

  function NudgeCard(p) {
    return h('div', { className: 'ld-nudge', role: 'status' },
      h('span', { className: 'ld-nudge__icon' }, svg(ICONS.reset, 22)),
      h('div', { className: 'ld-nudge__body' },
        h('p', { className: 'ld-nudge__title' }, p.title),
        p.children ? h('p', { className: 'ld-nudge__text' }, p.children) : null,
        p.actionLabel ? h('div', { className: 'ld-nudge__actions' }, h(Button, { variant: 'secondary', size: 'sm', onClick: p.onAction }, p.actionLabel)) : null));
  }

  function CoachBubble(p) {
    var from = p.from || 'coach';
    return h('div', { className: cx('ld-bubble-row', 'ld-bubble-row--' + from) },
      h('div', { className: cx('ld-bubble', 'ld-bubble--' + from, p.redirect && 'ld-bubble--redirect') },
        p.redirect ? h('span', { className: 'ld-bubble__tag' }, 'For your prescriber') : null,
        p.children));
  }

  function TextField(p) {
    var id = p.id || ('tf-' + String(p.label).replace(/\W+/g, '-').toLowerCase());
    var rest = omit(p, ['label', 'hint', 'error', 'suffix', 'id', 'className']);
    return h('div', { className: cx('ld-field', p.error && 'has-error', p.className) },
      h('label', { className: 'ld-field__label', htmlFor: id }, p.label),
      h('div', { className: 'ld-field__control' },
        h('input', Object.assign({ id: id, className: 'ld-field__input', 'aria-invalid': !!p.error, 'aria-describedby': (p.hint || p.error) ? id + '-msg' : undefined }, rest)),
        p.suffix ? h('span', { className: 'ld-field__suffix' }, p.suffix) : null),
      (p.error || p.hint) ? h('p', { id: id + '-msg', className: p.error ? 'ld-field__error' : 'ld-field__hint' }, p.error || p.hint) : null);
  }

  var TABS = [{ key: 'today', label: 'Today' }, { key: 'plan', label: 'Plan' }, { key: 'progress', label: 'Progress' }, { key: 'coach', label: 'Coach' }];
  function TabBar(p) {
    var items = p.items || TABS, active = p.active || items[0].key;
    return h('nav', { className: 'ld-tabbar', 'aria-label': 'Main' }, items.map(function (t) {
      var on = t.key === active;
      return h('button', { key: t.key, type: 'button', className: cx('ld-tab', on && 'is-active', 'ld-tab--' + t.key), 'aria-current': on ? 'page' : undefined, onClick: function () { p.onChange && p.onChange(t.key); } },
        h('span', { className: 'ld-tab__pill' }, svg(ICONS[t.key] || ICONS.today, 22)),
        h('span', { className: 'ld-tab__label' }, t.label));
    }));
  }

  window.Steadie = Object.assign(window.Steadie || {}, { Button: Button, Chip: Chip, Card: Card, HabitCheck: HabitCheck, ScoreRing: ScoreRing, HungerScale: HungerScale, NudgeCard: NudgeCard, CoachBubble: CoachBubble, TextField: TextField, TabBar: TabBar });
})();
