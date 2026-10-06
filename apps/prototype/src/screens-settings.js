/* Settings and account (S1–S11). */
(function () {
  'use strict';
  var LP = window.LP, html = LP.html, L = LP.L, Icon = LP.Icon, nav = LP.nav, set = LP.set, useApp = LP.useApp, toast = LP.toast;
  var U = LP.ui, Btn = U.Btn, Back = U.Back, Choices = U.Choices, Row = U.Row, Toggle = U.Toggle;

  function Head(p) { return html`<div class="topbar"><${Back} fallback=${p.back || 'settings'} label=${p.label} />${p.right || null}</div>`; }
  function subLine(s) {
    if (s.sub.status === 'trial') return 'free trial ends ' + LP.fmt.dayMonth(s.sub.trialEnds).replace(/ (\w{3})\w*$/, ' $1');
    if (s.sub.status === 'lapsed') return 'subscription ended';
    if (s.sub.status === 'active') return s.sub.plan === 'yearly' ? 'yearly plan' : 'monthly plan';
    return 'no subscription';
  }

  function Settings() {
    var s = useApp();
    var week = LP.weekOf(s), r = s.settings.reminders, on = ['habit', 'score', 'weigh', 'trial'].filter(function (k) { return r[k]; }).length;
    return html`<div class="scr plain" style=${{ gap: 18 }}>
      <${Head} back="today" label="Back" />
      <h1 class="t-title">Settings</h1>
      <button type="button" class="card rowcard" onClick=${function () { nav.go('details'); }}>
        <span class="avatar" style=${{ width: 52, height: 52, fontSize: 22 }} aria-hidden="true">${s.name.charAt(0)}</span>
        <span class="grow" style=${{ display: 'flex', flexDirection: 'column' }}><span style=${{ fontWeight: 800, fontSize: 16 }}>${s.name} ${s.surname}</span><span class="caption muted">Week ${week} · ${LP.phaseOf(week).name} · ${subLine(s)}</span></span>
        <${Icon} name="chevron" size=${18} />
      </button>
      <div class="stack" style=${{ gap: 8 }}>
        <p class="label muted">YOUR PLAN</p>
        <div class="list">
          <${Row} title="Your details" onClick=${function () { nav.go('details'); }} />
          <${Row} title="Subscription" value=${s.sub.status === 'none' ? 'None' : s.sub.plan === 'yearly' ? 'Yearly' : 'Monthly'} onClick=${function () { nav.go('subscription'); }} />
        </div>
      </div>
      <div class="stack" style=${{ gap: 8 }}>
        <p class="label muted">APP</p>
        <div class="list">
          <${Row} title="Reminders" value=${on ? on + ' on' : 'Off'} onClick=${function () { nav.go('reminders'); }} />
          <${Row} title="Apple Health" value=${s.settings.appleHealth ? 'Connected' : 'Not connected'} valueColor=${s.settings.appleHealth ? 'var(--sage-ink)' : null} onClick=${function () { nav.go('health'); }} />
          <${Row} title="Units" value=${(s.settings.units === 'kg' ? 'kg' : 'st, lb') + ', ' + (s.settings.height === 'cm' ? 'cm' : 'ft, in')} onClick=${function () { nav.go('units'); }} />
          <${Row} title="Exercise demos" value=${LP.demo.prefs(s).who === 'mix' ? 'Mix it up' : LP.demo.nameOf(LP.demo.prefs(s).who)} onClick=${function () { nav.go('demos'); }} />
        </div>
      </div>
      <div class="stack" style=${{ gap: 8 }}>
        <p class="label muted">SUPPORT AND PRIVACY</p>
        <div class="list">
          <${Row} title="Support and safe mode" value=${s.settings.safeMode ? 'On' : 'Off'} onClick=${function () { nav.go('support'); }} />
          <${Row} title="Privacy and data" onClick=${function () { nav.go('privacy'); }} />
          <${Row} title="Legal" onClick=${function () { nav.go('legal'); }} />
        </div>
      </div>
      <div class="row" style=${{ justifyContent: 'space-between' }}>
        <${Btn} variant="secondary" size="sm" onClick=${function () { set(function (s) { s.auth.signedIn = false; return s; }); nav.reset('welcome'); toast('Signed out. Your plan is saved for when you sign back in.'); }}>Sign out<//>
        <${Btn} variant="quiet" size="sm" style=${{ color: 'var(--rose-ink)' }} onClick=${function () { nav.go('delete'); }}>Delete account<//>
      </div>
      <p class="caption muted" style=${{ textAlign: 'center' }}>Landing 1.0 (1) · prototype</p>
    </div>`;
  }

  var STATUS = { stopped: "I've stopped", soon: 'Stopping soon', on: 'Still on it' };
  function Details() {
    var s = useApp();
    var st = React.useState({ status: s.ob.status, lastInjection: s.ob.lastInjection, startWeight: s.ob.startWeight, lowestWeight: s.ob.lowestWeight, height: s.ob.height, days: s.ob.days }), f = st[0], setF = st[1];
    function upd(k, v) { var n = Object.assign({}, f); n[k] = v; setF(n); }
    function save() {
      var before = LP.weekOf(s);
      set(function (s) {
        Object.assign(s.ob, f);
        var after = LP.weekOf(s);
        if (after !== before) LP.setWeek(s, after);
        return s;
      });
      var after = LP.weekOf(LP.get());
      nav.back('settings');
      toast(after !== before ? 'Saved. You’re now in week ' + after + ' of your plan.' : 'Saved.');
    }
    var rev = {}; Object.keys(STATUS).forEach(function (k) { rev[STATUS[k]] = k; });
    return html`<div class="scr plain" style=${{ gap: 16 }}>
      <${Head} right=${html`<${Btn} variant="quiet" size="sm" onClick=${save}>Save<//>`} />
      <h1 class="t-title">Your details</h1>
      <div class="stack" style=${{ gap: 8 }}>
        <p class="label">WHERE YOU ARE WITH YOUR JAB</p>
        <${Choices} label="Where you are with your jab" options=${Object.values(STATUS)} value=${STATUS[f.status]} onChange=${function (v) { upd('status', rev[v]); }} />
      </div>
      <${L.TextField} id="d-last" label="Last injection" type="date" max=${f.status === 'stopped' ? LP.TODAY : undefined} value=${f.lastInjection} onChange=${function (e) { if (e.target.value) upd('lastInjection', e.target.value); }} />
      <div class="grid2">
        <${L.TextField} id="d-start" label="Weight at start" suffix="kg" inputMode="decimal" value=${f.startWeight} onChange=${function (e) { upd('startWeight', e.target.value); }} />
        <${L.TextField} id="d-low" label="Lowest weight" suffix="kg" inputMode="decimal" value=${f.lowestWeight} onChange=${function (e) { upd('lowestWeight', e.target.value); }} />
        <${L.TextField} id="d-height" label="Height" suffix="cm" inputMode="numeric" value=${f.height} onChange=${function (e) { upd('height', e.target.value); }} />
        <${L.TextField} id="d-days" label="Training days" suffix="a week" inputMode="numeric" value=${f.days} onChange=${function (e) { upd('days', e.target.value); }} />
      </div>
      <p class="caption muted">Changing your last injection date moves you to a different week of the plan.</p>
    </div>`;
  }

  function Subscription() {
    var s = useApp();
    var st = s.sub.status, yearly = s.sub.plan === 'yearly';
    var tag = st === 'trial' ? 'Free trial' : st === 'active' ? 'Active' : st === 'lapsed' ? 'Ended' : 'None';
    var text = st === 'trial' ? 'Your trial ends on ' + LP.fmt.long(s.sub.trialEnds) + '. Then £69.99 a year, renewing each October.'
      : st === 'active' ? (yearly ? '£69.99 a year, renewing each October.' : '£12.99 a month, renewing on the 5th.')
      : st === 'lapsed' ? 'Your subscription has ended. Your plan and logs are safe.' : 'You don’t have a subscription yet.';
    return html`<div class="scr plain">
      <${Head} />
      <h1 class="t-title">Subscription</h1>
      <div class="card hero tint-apricot" style=${{ gap: 8 }}>
        <div class="between"><span class="t-heading">${yearly ? 'Yearly' : 'Monthly'}</span><span class="pill-tag" style=${{ background: 'var(--surface-raised)', color: 'var(--ink)' }}>${tag}</span></div>
        <p class="body">${text}</p>
      </div>
      <div class="list">
        <${Row} title=${yearly ? 'Switch to monthly' : 'Switch to yearly'} value=${yearly ? '£12.99' : '£69.99'} onClick=${function () { set(function (s) { s.sub.plan = yearly ? 'monthly' : 'yearly'; return s; }); nav.go('paywall'); }} />
        <${Row} title="Restore purchases" onClick=${function () { toast('Purchases restored. Your subscription is up to date.'); }} />
      </div>
      <p class="caption muted">Payments and cancellations are handled by the App Store. If you cancel, your plan and logs stay safe until you come back.</p>
      <div class="foot"><${Btn} block variant="secondary" onClick=${function () { toast('In the app this opens your App Store subscriptions.'); }}>Manage in the App Store<//></div>
    </div>`;
  }

  function Reminders() {
    var s = useApp();
    var defs = [['habit', 'Daily habit nudge', 'Every day at ' + (s.ob.reminderTime.split('· ')[1] || '15:30')], ['score', 'Your week is ready', 'Sundays at 18:00'], ['weigh', 'Weigh-in reminder', 'Mondays at 7:30'], ['trial', 'Trial ending', 'Two days before you are charged']];
    return html`<div class="scr plain">
      <${Head} />
      <div class="stack"><h1 class="t-title">Reminders</h1><p class="body muted">Kind, short and never about a number on the scales.</p></div>
      <div class="list">
        ${defs.map(function (d) {
          var on = s.settings.reminders[d[0]];
          return html`<div key=${d[0]} class="li" style=${{ alignItems: 'flex-start' }}>
            <span class="grow stack" style=${{ gap: 2 }}><span class="strong">${d[1]}</span><span class="caption muted">${on ? d[2] : 'Off'}</span></span>
            <${Toggle} on=${on} label=${d[1]} onClick=${function () { set(function (s) { s.settings.reminders[d[0]] = !on; return s; }); }} /></div>`;
        })}
      </div>
      <p class="caption muted">Weigh-in reminders are off unless you turn them on, and they never show a weight on your lock screen.</p>
    </div>`;
  }

  function Health() {
    var s = useApp();
    var on = s.settings.appleHealth;
    function connect(v) { set(function (s) { s.settings.appleHealth = v; if (v && s.weights.length < 8) { var have = {}; s.weights.forEach(function (w) { have[w.date] = 1; }); LP.seedWeights().forEach(function (w) { if (!have[w.date]) s.weights.push(w); }); } return s; }); toast(v ? 'Connected. Weigh-ins and workouts now come in from Apple Health.' : 'Disconnected from Apple Health.'); }
    return html`<div class="scr plain">
      <${Head} />
      <h1 class="t-title">Apple Health</h1>
      ${on ? html`<div class="card tint-sage rowcard" style=${{ gap: 12 }}>
          <span style=${{ width: 40, height: 40, borderRadius: 9999, background: 'var(--on-pastel)', color: 'var(--sage)', display: 'grid', placeItems: 'center', flex: 'none' }}><${Icon} name="check" size=${20} /></span>
          <span class="grow stack" style=${{ gap: 0 }}><span class="strong">Connected</span><span class="caption">Last synced today at 7:42</span></span></div>`
        : html`<div class="card tint-sunk rowcard" style=${{ gap: 12 }}>
          <span style=${{ width: 40, height: 40, borderRadius: 9999, background: 'var(--rose)', color: 'var(--on-pastel)', display: 'grid', placeItems: 'center', flex: 'none' }}><${Icon} name="heart" size=${20} /></span>
          <span class="grow stack" style=${{ gap: 0 }}><span class="strong">Not connected</span><span class="caption muted">Connect to bring in weigh-ins, steps and workouts</span></span></div>`}
      <div class="list">
        <${Row} title="Weight" value=${on ? 'Reading' : 'Off'} />
        <${Row} title="Steps" value=${on ? 'Reading' : 'Off'} />
        <${Row} title="Workouts" value=${on ? 'Reading and saving' : 'Off'} />
      </div>
      <p class="caption muted">To change what Landing can see, open the Health app, then Sharing, then Apps.</p>
      <div class="foot">
        ${on ? html`<${Btn} block onClick=${function () { toast('Synced. Nothing new since 7:42.'); }}>Sync now<//>
          <${Btn} block variant="secondary" onClick=${function () { connect(false); }}>Disconnect<//>`
          : html`<${Btn} block onClick=${function () { connect(true); }}>Connect Apple Health<//>`}
      </div>
    </div>`;
  }

  function Units() {
    var s = useApp();
    function setU(k, v) { set(function (s) { s.settings[k] = v; return s; }); }
    return html`<div class="scr plain">
      <${Head} />
      <h1 class="t-title">Units</h1>
      <div class="card" style=${{ gap: 12 }}>
        <span class="label">WEIGHT</span>
        <div class="seg" role="group" aria-label="Weight unit">
          <button type="button" class=${s.settings.units === 'kg' ? 'on' : ''} aria-pressed=${s.settings.units === 'kg'} onClick=${function () { setU('units', 'kg'); }}>Kilograms</button>
          <button type="button" class=${s.settings.units === 'st' ? 'on' : ''} aria-pressed=${s.settings.units === 'st'} onClick=${function () { setU('units', 'st'); }}>Stones and pounds</button>
        </div>
        <span class="caption muted">Shown as ${LP.fmtWeight(s, 78.4)}</span>
      </div>
      <div class="card" style=${{ gap: 12 }}>
        <span class="label">HEIGHT</span>
        <div class="seg" role="group" aria-label="Height unit">
          <button type="button" class=${s.settings.height === 'cm' ? 'on' : ''} aria-pressed=${s.settings.height === 'cm'} onClick=${function () { setU('height', 'cm'); }}>Centimetres</button>
          <button type="button" class=${s.settings.height === 'ft' ? 'on' : ''} aria-pressed=${s.settings.height === 'ft'} onClick=${function () { setU('height', 'ft'); }}>Feet and inches</button>
        </div>
      </div>
      <p class="caption muted">Protein is always shown in grams.</p>
    </div>`;
  }

  function Demos() {
    var s = useApp(), D = LP.demo, p = D.prefs(s);
    var lr = React.useState(p.who === 'mix' ? 'grace' : p.who), last = lr[0], setLast = lr[1];
    var who = p.who === 'mix' ? D.whoFor(s, 'preview') : p.who;
    function pick(v) { if (v !== 'mix') setLast(v); D.setPrefs({ who: v }); }
    var rows = [['still', 'Still pictures', 'Show the start and end positions instead of a moving loop'], ['ghost', 'Starting outline', 'A faint outline of where each move begins']];
    return html`<div class="scr plain" style=${{ gap: 18 }}>
      <${Head} />
      <h1 class="t-title">Exercise demos</h1>
      <div style=${{ height: 220, borderRadius: 'var(--radius-lg)', background: 'var(--sky)', overflow: 'hidden', position: 'relative', flex: 'none' }}>
        <${D.Motion} id="squat-2" who=${who} still=${p.still} ghost=${p.ghost} />
        <span class="ld-chip" style=${{ position: 'absolute', left: 12, top: 12, background: 'var(--surface-raised)', color: 'var(--ink)' }}>${p.who === 'mix' ? 'Mix it up · today ' + D.nameOf(who) : D.nameOf(who) + ' · sit to stand'}</span>
      </div>
      <div class="stack" style=${{ gap: 8 }}>
        <p class="label muted">WHO SHOWS YOU THE MOVES</p>
        <${D.CastPicker} compact value=${p.who} last=${last} onChange=${pick} />
      </div>
      <div class="list">
        ${rows.map(function (r) {
          return html`<div key=${r[0]} class="li" style=${{ alignItems: 'flex-start' }}>
            <span class="grow stack" style=${{ gap: 2 }}><span class="strong">${r[1]}</span><span class="caption muted">${r[2]}</span></span>
            <${Toggle} on=${p[r[0]]} label=${r[1]} onClick=${function () { var o = {}; o[r[0]] = !p[r[0]]; D.setPrefs(o); }} /></div>`;
        })}
      </div>
      <p class="caption muted">Changes apply from your next exercise. Everyone does the same moves and gets the same cues.</p>
    </div>`;
  }

  function Support() {
    var s = useApp();
    var on = s.settings.safeMode;
    return html`<div class="scr plain">
      <${Head} />
      <h1 class="t-title">Support and safe mode</h1>
      <div class="card hero tint-sky" style=${{ gap: 10 }}>
        <div class="between"><span class="t-heading">Safe mode</span><${Toggle} on=${on} label="Safe mode" onClick=${function () { set(function (s) { s.settings.safeMode = !on; return s; }); toast(on ? 'Safe mode is off. Weight is shown again.' : 'Safe mode is on. Weight is hidden.'); }} /></div>
        <p class="body">Hides weight targets and the weight chart, and builds your score from habits and hunger only. Turn it on any time you'd rather not see the numbers.</p>
      </div>
      <div class="stack" style=${{ gap: 8 }}>
        <p class="label muted">TALK TO SOMEONE</p>
        <div class="list">
          <${Row} title="Beat" sub="UK eating disorder charity" onClick=${function () { toast('In the app this opens Beat’s website: beateatingdisorders.org.uk'); }} />
          <${Row} title="Your GP or prescriber" sub="For anything about your health or medication" onClick=${function () { toast('In the app this explains how to book with your GP or prescriber.'); }} />
        </div>
      </div>
      <div class="stack" style=${{ gap: 8 }}>
        <p class="label muted">HELP WITH THE APP</p>
        <div class="card" style=${{ gap: 2 }}><span class="strong">Email us</span><span class="body muted">help@[YOUR DOMAIN] · we reply within 2 working days</span></div>
      </div>
    </div>`;
  }

  function Privacy() {
    var s = useApp();
    var wd = React.useState(false), withdraw = wd[0], setWithdraw = wd[1];
    return html`<div class="scr plain" style=${{ gap: 16 }}>
      <${Head} />
      <h1 class="t-title">Privacy and data</h1>
      <div class="stack" style=${{ gap: 8 }}>
        <p class="label muted">YOUR PERMISSIONS</p>
        <div class="list">
          <${Row} title="Health data" sub="Given 5 Oct 2026 · needed for your plan" right=${html`<${Btn} variant="quiet" size="sm" style=${{ padding: '0 4px' }} onClick=${function () { setWithdraw(true); }}>Withdraw<//>`} />
          <${Row} title="Apple Health" sub=${s.settings.appleHealth ? 'Given 5 Oct 2026' : 'Not given'} right=${html`<${Btn} variant="quiet" size="sm" style=${{ padding: '0 4px' }} onClick=${function () { nav.go('health'); }}>Manage<//>`} />
          <${Row} title="Tips by email" sub=${s.settings.tipsEmail ? 'Given today' : 'Not given'} right=${html`<${Btn} variant="quiet" size="sm" style=${{ padding: '0 4px' }} onClick=${function () { set(function (s) { s.settings.tipsEmail = !s.settings.tipsEmail; return s; }); }}>${s.settings.tipsEmail ? 'Turn off' : 'Turn on'}<//>`} />
        </div>
      </div>
      ${withdraw ? html`<div class="card tint-butter" style=${{ gap: 10 }} role="status">
        <p class="body">Without this permission Landing can't keep your logs, so your plan stops. Your data is deleted after 30 days unless you agree again.</p>
        <div class="row"><${Btn} variant="secondary" size="sm" style=${{ flex: 1 }} onClick=${function () { setWithdraw(false); toast('In the app this withdraws consent and pauses your plan.'); }}>Withdraw anyway<//><${Btn} size="sm" style=${{ flex: 1 }} onClick=${function () { setWithdraw(false); }}>Keep it<//></div>
      </div>` : null}
      <div class="card" style=${{ gap: 8 }}>
        <span class="strong">Download a copy of your data</span>
        <span class="caption muted">Every weigh-in, log, habit and score, as a file you can keep.</span>
        <${Btn} variant="secondary" size="sm" style=${{ alignSelf: 'flex-start' }} onClick=${function () { toast('In the app this prepares a file of ' + s.weights.length + ' weigh-ins and all your logs.'); }}>Export my data<//>
      </div>
      <p class="caption muted">To run Landing we use Supabase (storage), RevenueCat (subscriptions), Anthropic (coach), PostHog (anonymous usage) and Sentry (crash reports). None of them may use your data for advertising.</p>
      <div class="foot"><${Btn} variant="quiet" size="sm" style=${{ alignSelf: 'center', color: 'var(--rose-ink)' }} onClick=${function () { nav.go('delete'); }}>Delete my account and data<//></div>
    </div>`;
  }

  function Delete() {
    var ts = React.useState(''), typed = ts[0], setTyped = ts[1];
    var ready = typed.trim().toUpperCase() === 'DELETE';
    return html`<div class="scr plain">
      <${Head} />
      <h1 class="t-title">Delete your account</h1>
      <div class="card hero tint-rose" style=${{ gap: 8 }}>
        <span class="label">THIS REMOVES, FOR GOOD</span>
        <p class="body">Every weigh-in, food and hunger log, habit, workout and score</p>
        <p class="body">Your plan and your coach conversations</p>
        <p class="body">Your consent records and account</p>
      </div>
      <p class="body muted">It can't be undone. If you might come back, export your data first. Deleting doesn't cancel an App Store subscription.</p>
      <${L.TextField} id="confirm-delete" label="Type DELETE to confirm" autoComplete="off" placeholder="DELETE" value=${typed} onChange=${function (e) { setTyped(e.target.value); }} />
      <div class="foot">
        <${Btn} block variant="danger" disabled=${!ready} onClick=${function () { nav.reset('deleted'); }}>Delete everything<//>
        <${Btn} block variant="secondary" onClick=${function () { nav.reset('settings'); }}>Keep my account<//>
      </div>
    </div>`;
  }

  function Deleted() {
    return html`<div class="scr plain" style=${{ justifyContent: 'center' }}>
      <div aria-hidden="true" style=${{ position: 'relative', height: 140, flex: 'none' }}>
        <span style=${{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 40, borderRadius: 9999, background: 'var(--surface-sunk)' }}></span>
        <span style=${{ position: 'absolute', left: '50%', marginLeft: -40, bottom: 40, width: 80, height: 80, borderRadius: 9999, background: 'var(--apricot)', opacity: .6 }}></span>
      </div>
      <div class="stack center">
        <h1 class="t-title">Your account is deleted</h1>
        <p class="body-lg muted">Every log, score and setting has been removed. If you subscribed, cancel it in the App Store so you're not charged again.</p>
        <p class="body">Thank you for trusting us with part of your journey.</p>
      </div>
      <div class="foot" style=${{ marginTop: 32 }}><${Btn} block onClick=${function () { var t = LP.get().theme; set(function () { var b = LP.blankState(); b.theme = t; return b; }); nav.reset('launch'); }}>Close<//></div>
    </div>`;
  }

  function Legal() {
    return html`<div class="scr plain">
      <${Head} />
      <h1 class="t-title">Legal</h1>
      <div class="card hero tint-sky" style=${{ gap: 8 }}>
        <span class="label">WHAT LANDING IS</span>
        <p class="body">Landing is a general wellness app that helps adults build nutrition, activity and eating-habit routines to maintain a healthy weight. It does not diagnose, treat or monitor any medical condition, and it does not give advice about medication, doses or stopping treatment. Decisions about medication are for your prescriber.</p>
      </div>
      <div class="list">
        ${['Terms of use', 'Privacy policy', 'Open-source licences'].map(function (t) { return html`<${Row} key=${t} title=${t} onClick=${function () { toast('In the app this opens the ' + t.toLowerCase() + '.'); }} />`; })}
      </div>
      <p class="caption muted">[YOUR COMPANY NAME] · registered with the ICO</p>
    </div>`;
  }

  Object.assign(window.LP.screens, {
    settings: { c: Settings, id: 'S1', title: 'Settings', group: 'Settings and account' },
    details: { c: Details, id: 'S2', title: 'Your details', group: 'Settings and account' },
    subscription: { c: Subscription, id: 'S3', title: 'Subscription', group: 'Settings and account' },
    reminders: { c: Reminders, id: 'S4', title: 'Reminders', group: 'Settings and account' },
    health: { c: Health, id: 'S5', title: 'Apple Health', group: 'Settings and account' },
    units: { c: Units, id: 'S6', title: 'Units', group: 'Settings and account' },
    demos: { c: Demos, id: 'S6b', title: 'Exercise demos', group: 'Settings and account' },
    support: { c: Support, id: 'S7', title: 'Support and safe mode', group: 'Settings and account' },
    privacy: { c: Privacy, id: 'S8', title: 'Privacy and data', group: 'Settings and account' },
    delete: { c: Delete, id: 'S9', title: 'Delete account', group: 'Settings and account' },
    deleted: { c: Deleted, id: 'S10', title: 'Account deleted', group: 'Settings and account' },
    legal: { c: Legal, id: 'S11', title: 'Legal', group: 'Settings and account' }
  });
})();
