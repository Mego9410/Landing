/* Entry and sign-in (A1–A4), onboarding (O1–O12) and paywall (P1–P3). */
(function () {
  'use strict';
  var LP = window.LP, html = LP.html, L = LP.L, Icon = LP.Icon, nav = LP.nav, set = LP.set, useApp = LP.useApp, toast = LP.toast;
  var U = LP.ui, Btn = U.Btn, Back = U.Back, Steps = U.Steps, Skip = U.Skip, Choices = U.Choices, Options = U.Options, Art = U.Art, Row = U.Row;

  function ob(patch) { set(function (s) { Object.assign(s.ob, patch); return s; }); }
  function signIn(method) {
    set(function (s) { s.auth.signedIn = true; s.auth.method = method; return s; });
    var s = LP.get();
    if (s.onboarded) { nav.reset(s.sub.status === 'lapsed' ? 'lapsed' : 'today'); }
    else nav.reset('ob-status');
  }
  function skipToApp() { set(function () { return LP.demoState(6); }); nav.reset('today'); toast('Skipped sign-up. You’re Hannah, in week 6.'); }

  /* A1 Launch */
  function Launch() {
    return html`<div class="scr plain edge" style=${{ minHeight: '100%', justifyContent: 'center' }}>
      <button type="button" class="linkish" aria-label="Continue to Welcome" onClick=${function () { nav.go('welcome'); }}
        style=${{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: 'var(--ink)', width: '100%' }}>
        <img src=${LP.ASSETS.lockup} alt="steadie" style=${{ width: 240, height: 64 }} />
      </button>
      <p class="caption muted" style=${{ position: 'absolute', left: 0, right: 0, bottom: 48, textAlign: 'center' }}>Keep what you've worked for.</p>
      <${Skip} label="Skip to the app" onClick=${skipToApp} />
    </div>`;
  }

  /* A2 Welcome */
  function Welcome() {
    return html`<div class="scr plain">
      <${Skip} label="Skip to the app" onClick=${skipToApp} />
      <img src=${LP.ASSETS.lockup} alt="steadie" style=${{ width: 150, height: 40 }} />
      <${Art} height=${250} shapes=${[
        { left: 24, top: 10, width: 96, height: 150, borderRadius: 48, background: 'var(--lilac)' },
        { right: -30, top: 0, width: 120, height: 96, borderRadius: 32, background: 'var(--sky)' },
        { left: 40, right: -40, bottom: 0, height: 72, background: 'var(--sage)' },
        { left: 196, bottom: 72, width: 96, height: 96, background: 'var(--apricot)' },
        { left: 140, top: 22, width: 10, height: 10, background: 'var(--apricot)' },
        { left: 156, top: 42, width: 14, height: 14, background: 'var(--apricot)' },
        { left: 172, top: 66, width: 18, height: 18, background: 'var(--apricot)' },
        { left: 36, bottom: 96, width: 64, height: 28, background: 'var(--butter)' }]} />
      <div class="stack">
        <h1 class="t-display">Keep what you've worked for.</h1>
        <p class="body-lg muted">A 12-month habit plan for life after weight-loss jabs. Protein, strength and steady routines, at your pace.</p>
      </div>
      <div class="foot">
        <${Btn} block style=${{ background: 'var(--ink)', color: 'var(--surface)' }} onClick=${function () { signIn('apple'); }}>Continue with Apple<//>
        <${Btn} block variant="secondary" onClick=${function () { set(function (s) { s.auth.returning = false; return s; }); nav.go('email'); }}>Continue with email<//>
        <${Btn} variant="quiet" size="sm" style=${{ alignSelf: 'center' }} onClick=${function () { set(function (s) { s.auth.returning = true; return s; }); nav.go('email'); }}>I already have an account<//>
      </div>
    </div>`;
  }

  /* A3 Email sign-in */
  function Email() {
    var s = useApp();
    var st = React.useState(s.auth.email), email = st[0], setEmail = st[1];
    var er = React.useState(null), err = er[0], setErr = er[1];
    function send() {
      if (!/^\S+@\S+\.\S+$/.test(email.trim())) { setErr('Enter an email address like name@example.com.'); return; }
      set(function (s) { s.auth.email = email.trim(); return s; });
      nav.go('inbox');
    }
    return html`<div class="scr plain">
      <${Skip} onClick=${function () { signIn('email'); }} />
      <div class="topbar"><${Back} fallback="welcome" /></div>
      <div class="stack">
        <h1 class="t-title">${s.auth.returning ? 'Welcome back' : 'Sign in with your email'}</h1>
        <p class="body-lg muted">We'll send you a link. No password to remember.</p>
      </div>
      <form onSubmit=${function (e) { e.preventDefault(); send(); }} style=${{ display: 'contents' }}>
        <${L.TextField} id="email" label="Email address" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" value=${email}
          onChange=${function (e) { setEmail(e.target.value); setErr(null); }} error=${err} hint=${err ? null : 'We only use this to sign you in and send your receipts.'} />
      </form>
      <div class="foot">
        <${Btn} block onClick=${send}>Send my link<//>
        <p class="caption muted" style=${{ textAlign: 'center' }}>By continuing you agree to our Terms and Privacy policy.</p>
      </div>
    </div>`;
  }

  /* A4 Check your inbox */
  function Inbox() {
    var s = useApp();
    return html`<div class="scr plain">
      <${Skip} onClick=${function () { signIn('email'); }} />
      <div class="topbar"><${Back} fallback="email" /></div>
      <div style=${{ width: 96, height: 96, borderRadius: 9999, background: 'var(--sky)', display: 'grid', placeItems: 'center', color: 'var(--on-pastel)', marginTop: 24 }}><${Icon} name="mail" size=${40} w=${1.8} /></div>
      <div class="stack">
        <h1 class="t-title">Check your inbox</h1>
        <p class="body-lg">We've sent a sign-in link to <strong>${s.auth.email}</strong>.</p>
        <p class="body muted">Tap the link on this phone to carry on. It works for 15 minutes.</p>
      </div>
      <div class="foot">
        <${Btn} block onClick=${function () { signIn('email'); }}>Open Mail<//>
        <p class="caption muted" style=${{ textAlign: 'center', marginTop: -2 }}>In this prototype, Open Mail acts as tapping the link.</p>
        <${Btn} block variant="secondary" onClick=${function () { toast('Sent a new link to ' + s.auth.email + '.'); }}>Resend link<//>
        <${Btn} variant="quiet" size="sm" style=${{ alignSelf: 'center' }} onClick=${function () { nav.back('email'); }}>Use a different email<//>
      </div>
    </div>`;
  }

  /* O1 Where you are now */
  function ObStatus() {
    var s = useApp();
    return html`<div class="scr plain">
      <${Skip} onClick=${function () { nav.go('ob-stopdate'); }} />
      <${Steps} n=${1} backTo="welcome" />
      <div class="stack">
        <h1 class="t-title">Where are you with your jab?</h1>
        <p class="body muted">This sets where your plan starts. There's no wrong answer.</p>
      </div>
      <${Options} label="Where you are with your jab" value=${s.ob.status} onChange=${function (v) { ob({ status: v }); }} options=${[
        { id: 'stopped', title: "I've stopped", detail: 'My last injection has been and gone' },
        { id: 'soon', title: "I'm stopping soon", detail: 'I want a plan ready before I do' },
        { id: 'on', title: "I'm still on it", detail: "I'm planning ahead, no date yet" }]} />
      <p class="caption muted">Steadie never gives advice about doses or stopping. That's for your prescriber.</p>
      <div class="foot"><${Btn} block onClick=${function () { nav.go('ob-stopdate'); }}>Continue<//></div>
    </div>`;
  }

  /* O2 Stop date: a month calendar; future dates are only allowed when stopping soon */
  function ObStopDate() {
    var s = useApp();
    var sel = s.ob.lastInjection;
    var ms = React.useState(sel.slice(0, 7)), month = ms[0], setMonth = ms[1];
    var y = +month.slice(0, 4), m = +month.slice(5, 7);
    var first = new Date(Date.UTC(y, m - 1, 1)), lead = (first.getUTCDay() + 6) % 7, count = new Date(Date.UTC(y, m, 0)).getUTCDate();
    var cells = []; for (var i = 0; i < lead; i++) cells.push(null); for (var dd = 1; dd <= count; dd++) cells.push(dd);
    var allowFuture = s.ob.status !== 'stopped';
    function shift(n) { var dt = new Date(Date.UTC(y, m - 1 + n, 1)); setMonth(dt.toISOString().slice(0, 7)); }
    var label = new Date(Date.UTC(y, m - 1, 1)).toLocaleString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    var days = LP.daysBetween(sel, LP.TODAY);
    var summary = days >= 0 ? LP.fmt.dayMonth(sel) + ' · you’re in week ' + (Math.floor(days / 7) + 1) : LP.fmt.dayMonth(sel) + ' · your plan starts that day';
    return html`<div class="scr plain">
      <${Skip} onClick=${function () { nav.go('ob-start'); }} />
      <${Steps} n=${2} />
      <div class="stack">
        <h1 class="t-title">${s.ob.status === 'stopped' ? 'When was your last injection?' : 'When will your last injection be?'}</h1>
        <p class="body muted">Your plan counts its weeks from this date.</p>
      </div>
      <div class="card hero" style=${{ gap: 14 }}>
        <div class="between">
          <button type="button" class="iconbtn flat" aria-label="Previous month" onClick=${function () { shift(-1); }}><${Icon} name="back" size=${20} /></button>
          <span class="t-heading">${label}</span>
          <button type="button" class="iconbtn flat" aria-label="Next month" onClick=${function () { shift(1); }}><${Icon} name="chevron" size=${20} /></button>
        </div>
        <div class="cal">
          ${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(function (x, i) { return html`<span key=${'h' + i} class="caption muted">${x}</span>`; })}
          ${cells.map(function (c, i) {
            if (!c) return html`<span key=${'b' + i}></span>`;
            var isoD = month + '-' + String(c).padStart(2, '0');
            var future = isoD > LP.TODAY;
            return html`<button key=${isoD} type="button" class=${'cal-btn' + (isoD === sel ? ' on' : '')} disabled=${future && !allowFuture} aria-pressed=${isoD === sel}
              aria-label=${LP.fmt.long(isoD)} onClick=${function () { ob({ lastInjection: isoD }); }}>${c}</button>`;
          })}
        </div>
      </div>
      <div class="row" style=${{ justifyContent: 'center' }}><span class="pill-tag" style=${{ background: 'var(--sky)', color: 'var(--on-pastel)' }}>${summary}</span></div>
      <div class="foot">
        <${Btn} block onClick=${function () { nav.go('ob-start'); }}>Continue<//>
        <${Btn} variant="quiet" size="sm" style=${{ alignSelf: 'center' }} onClick=${function () { ob({ lastInjection: LP.TODAY }); nav.go('ob-start'); }}>I'm not sure yet<//>
      </div>
    </div>`;
  }

  /* O3 Your starting point */
  function ObStart() {
    var s = useApp();
    var fields = [['startWeight', 'Weight when you started the jab', 'kg', 'decimal'], ['lowestWeight', 'Your lowest weight on it', 'kg', 'decimal'], ['todayWeight', 'Your weight today', 'kg', 'decimal'], ['height', 'Height', 'cm', 'numeric']];
    var er = React.useState({}), errs = er[0], setErrs = er[1];
    function next() {
      var e = {};
      fields.forEach(function (f) {
        var v = parseFloat(s.ob[f[0]]);
        if (f[0] === 'height') { if (!(v >= 120 && v <= 230)) e[f[0]] = 'Enter your height in centimetres, like 168.'; }
        else if (!(v >= 35 && v <= 300)) e[f[0]] = 'That doesn’t look right. Check for a missing decimal point, like 78.4.';
      });
      setErrs(e);
      if (!Object.keys(e).length) nav.go('ob-screening');
    }
    return html`<div class="scr plain" style=${{ gap: 16 }}>
      <${Skip} onClick=${function () { ob({ startWeight: '96.2', lowestWeight: '78.0', todayWeight: '78.4', height: '168' }); nav.go('ob-screening'); }} />
      <${Steps} n=${3} />
      <div class="stack">
        <h1 class="t-title">Your starting point</h1>
        <p class="body muted">We use these to notice gentle drift early. You won't be given a goal weight.</p>
      </div>
      <${Btn} variant="secondary" size="sm" icon="heart" style=${{ alignSelf: 'flex-start' }} onClick=${function () { ob({ todayWeight: '78.4', height: '168' }); toast('Filled in today’s weight and your height from Apple Health.'); }}>Fill in from Apple Health<//>
      <div class="stack" style=${{ gap: 14 }}>
        ${fields.map(function (f) {
          return html`<${L.TextField} key=${f[0]} id=${'ob-' + f[0]} label=${f[1]} suffix=${f[2]} inputMode=${f[3]} value=${s.ob[f[0]]} error=${errs[f[0]]}
            onChange=${function (e) { var p = {}; p[f[0]] = e.target.value; ob(p); }} />`;
        })}
      </div>
      <div class="foot"><${Btn} block onClick=${next}>Continue<//></div>
    </div>`;
  }

  /* O4 A few quick questions: five yes/no questions; any yes leads to safe mode (O5) */
  var QUESTIONS = [
    '[Question 1 wording to be set with a clinician]',
    'Does food or eating often feel like it controls your day?',
    '[Question 3 wording to be set with a clinician]',
    '[Question 4 wording to be set with a clinician]',
    '[Question 5 wording to be set with a clinician]'
  ];
  function ObScreening() {
    var s = useApp();
    var qs = React.useState(0), q = qs[0], setQ = qs[1];
    var a = s.ob.screening[q] || 'no';
    function answer(v) { set(function (s) { s.ob.screening[q] = v; return s; }); }
    function next() {
      if (!s.ob.screening[q]) answer('no');
      if (q < 4) { setQ(q + 1); return; }
      var any = LP.get().ob.screening.some(function (x) { return x === 'yes'; });
      set(function (s) { s.settings.safeMode = any; return s; });
      nav.go(any ? 'ob-support' : 'ob-training');
    }
    function back() { if (q > 0) setQ(q - 1); else nav.back('ob-start'); }
    return html`<div class="scr plain">
      <${Skip} onClick=${function () { set(function (s) { s.ob.screening = ['no', 'no', 'no', 'no', 'no']; s.settings.safeMode = false; return s; }); nav.go('ob-training'); }} />
      <${Steps} n=${4} onBack=${back} />
      <div class="stack">
        <p class="eyebrow">A FEW QUICK QUESTIONS</p>
        <h1 class="t-title">So we can look after you properly</h1>
        <p class="body muted">Your answers stay private and only change how the app talks about weight.</p>
      </div>
      <div class="card hero tint-sky" style=${{ gap: 16, marginTop: 8 }}>
        <span class="caption">Question ${q + 1} of 5</span>
        <p class="t-heading" style=${{ fontSize: 22, lineHeight: '30px' }}>${QUESTIONS[q]}</p>
        <div class="row" role="radiogroup" aria-label=${'Question ' + (q + 1)}>
          <button type="button" role="radio" aria-checked=${a === 'no'} class=${'choice' + (a === 'no' ? ' on' : '')} style=${{ flex: 1 }} onClick=${function () { answer('no'); }}>No</button>
          <button type="button" role="radio" aria-checked=${a === 'yes'} class=${'choice' + (a === 'yes' ? ' on' : '')} style=${{ flex: 1 }} onClick=${function () { answer('yes'); }}>Yes</button>
        </div>
      </div>
      <div class="row" style=${{ justifyContent: 'center', gap: 6 }} aria-hidden="true">
        ${[0, 1, 2, 3, 4].map(function (i) { return html`<span key=${i} class="dot" style=${{ background: i <= q ? 'var(--sky-ink)' : 'var(--line)', width: i === q ? 20 : 8 }}></span>`; })}
      </div>
      <p class="caption muted" style=${{ textAlign: 'center' }}>[Final question wording to be set with a clinician]</p>
      <div class="foot"><${Btn} block onClick=${next}>${q < 4 ? 'Next question' : 'Continue'}<//></div>
    </div>`;
  }

  /* O5 Support and safe mode */
  function ObSupport() {
    return html`<div class="scr plain">
      <${Skip} onClick=${function () { nav.go('ob-training'); }} />
      <div class="topbar"><${Back} /><div class="steps"><span style=${{ width: '44%' }}></span></div><span class="caption muted">4 of 9</span></div>
      <div class="stack">
        <h1 class="t-title">Thank you for telling us</h1>
        <p class="body-lg">We'll keep Steadie focused on routines, food and energy, and leave the numbers out.</p>
      </div>
      <div class="card hero tint-sky" style=${{ gap: 12 }}>
        <p class="label">WHAT CHANGES IN SAFE MODE</p>
        ${['No weight targets and no weight chart', 'Your score is built from habits and hunger only', 'You can switch it off later in Settings'].map(function (t) {
          return html`<div key=${t} class="bullet"><span class="dot" style=${{ background: 'var(--on-pastel)' }}></span><p class="body">${t}</p></div>`;
        })}
      </div>
      <div class="stack">
        <p class="label">IF YOU'D LIKE TO TALK TO SOMEONE</p>
        <div class="list">
          <${Row} title="Beat" sub="UK eating disorder charity · helplines and web chat" onClick=${function () { toast('In the app this opens Beat’s website: beateatingdisorders.org.uk'); }} />
          <${Row} title="Your GP or prescriber" sub="They can refer you for support" onClick=${function () { toast('In the app this explains how to book with your GP or prescriber.'); }} />
        </div>
      </div>
      <div class="foot"><${Btn} block onClick=${function () { nav.go('ob-training'); }}>Continue in safe mode<//></div>
    </div>`;
  }

  /* O6 Your training */
  function ObTraining() {
    var s = useApp();
    return html`<div class="scr plain">
      <${Skip} onClick=${function () { nav.go('ob-demo'); }} />
      <${Steps} n=${5} />
      <div class="stack">
        <h1 class="t-title">Strength keeps what you've worked for</h1>
        <p class="body muted">Muscle helps your body hold steady after the jab. We'll start gently.</p>
      </div>
      <div class="stack"><p class="label">HOW MUCH STRENGTH TRAINING HAVE YOU DONE?</p>
        <${Choices} label="Strength training so far" options=${['None yet', 'Some', 'I train regularly']} value=${s.ob.level} onChange=${function (v) { ob({ level: v }); }} /></div>
      <div class="stack"><p class="label">DAYS A WEEK YOU COULD TRAIN</p>
        <${Choices} label="Days a week" options=${['2', '3', '4', '5+']} value=${s.ob.days} style=${{ minWidth: 64 }} onChange=${function (v) { ob({ days: v }); }} /></div>
      <div class="stack"><p class="label">WHERE</p>
        <${Choices} label="Where you train" options=${['At home', 'At a gym', 'Both']} value=${s.ob.place} onChange=${function (v) { ob({ place: v }); set(function (s) { s.workouts.where = v === 'At a gym' ? 'gym' : 'home'; return s; }); }} /></div>
      <div class="foot"><${Btn} block onClick=${function () { nav.go('ob-demo'); }}>Continue<//></div>
    </div>`;
  }

  /* O6b Who shows you the moves */
  function ObDemo() {
    var s = useApp(), D = LP.demo, p = D.prefs(s);
    var lr = React.useState('grace'), last = lr[0], setLast = lr[1];
    function pick(v) { if (v !== 'mix') setLast(v); D.setPrefs({ who: v }); }
    function next() { nav.go('ob-food'); }
    return html`<div class="scr plain">
      <${Skip} onClick=${function () { D.setPrefs({ who: 'mix' }); next(); }} />
      <${Steps} n=${6} />
      <div class="stack">
        <h1 class="t-title">Who would you like to show you the moves?</h1>
        <p class="body muted">They'll demonstrate every exercise in your plan. You can change this any time in Settings.</p>
      </div>
      <${D.CastPicker} value=${p.who} last=${last} onChange=${pick} />
      <div class="foot">
        <${Btn} block onClick=${next}>${p.who === 'mix' ? 'Continue with a mix' : 'Continue with ' + D.nameOf(p.who)}<//>
        <${Btn} block variant="quiet" onClick=${function () { D.setPrefs({ who: 'mix' }); next(); }}>Decide later<//>
      </div>
    </div>`;
  }

  /* O7 Food and hunger */
  function ObFood() {
    var s = useApp();
    return html`<div class="scr plain">
      <${Skip} onClick=${function () { nav.go('ob-eating'); }} />
      <${Steps} n=${7} />
      <div class="stack">
        <h1 class="t-title">Food and hunger</h1>
        <p class="body muted">Appetite often comes back after the jab. Knowing your hungry times helps us plan around them.</p>
      </div>
      <div class="stack"><p class="label">HOW OFTEN DO YOUR MEALS INCLUDE PROTEIN?</p>
        <${Options} gap=${8} label="Protein at meals" style=${{ padding: '14px 16px' }} value=${s.ob.proteinFreq} onChange=${function (v) { ob({ proteinFreq: v }); }}
          options=${['Rarely', 'Some meals', 'Most meals'].map(function (x) { return { id: x, title: x }; })} /></div>
      <div class="stack"><p class="label">WHEN DO YOU USUALLY FEEL HUNGRIEST? PICK ANY</p>
        <${Choices} multi label="Hungriest times" options=${['Morning', 'Lunchtime', 'Afternoon', 'Evening', 'Late night']} value=${s.ob.hungryTimes} onChange=${function (v) { ob({ hungryTimes: v }); }} /></div>
      <div class="stack"><p class="label">WHAT WOULD YOU LIKE FOOD TO DO FOR YOU?</p>
        <${LP.food.GoalPicker} /></div>
      <div class="foot"><${Btn} block onClick=${function () { nav.go('ob-eating'); }}>Continue<//></div>
    </div>`;
  }

  /* O8 Your health data */
  function ObConsent() {
    var dc = React.useState(false), declined = dc[0], setDeclined = dc[1];
    function agree() { ob({ consent: true }); nav.go('ob-health'); }
    var rows = [['check', 'tint-sage', 'What we keep', 'Weigh-ins, protein, hunger, habits and workouts'], ['globe', 'tint-sky', 'Where', 'Stored in the UK and EU'],
      ['lock', 'tint-lilac', 'Never', 'Sold, shared with advertisers or used for ads'], ['trash', 'tint-rose', 'Delete any time', 'One tap in Settings removes everything']];
    return html`<div class="scr plain" style=${{ gap: 16 }}>
      <${Skip} onClick=${agree} />
      <${Steps} n=${10} />
      <div class="stack">
        <h1 class="t-title">Your health data, your call</h1>
        <p class="body muted">Weight, food and hunger logs count as health data. We need your permission to keep them.</p>
      </div>
      <div class="list">${rows.map(function (r) { return html`<${Row} key=${r[2]} icon=${r[0]} tint=${r[1]} title=${r[2]} sub=${r[3]} />`; })}</div>
      ${declined ? html`<div class="banner tint-butter" role="status"><p class="body">Steadie can't build your plan without this. You can agree whenever you're ready.</p></div>` : null}
      <div class="foot">
        <${Btn} block onClick=${agree}>Agree and continue<//>
        <${Btn} variant="quiet" size="sm" style=${{ alignSelf: 'center' }} onClick=${function () { setDeclined(true); }}>Not now<//>
        <button type="button" class="linkish caption muted" style=${{ textAlign: 'center', textDecoration: 'underline' }} onClick=${function () { toast('In the app this opens the full privacy policy.'); }}>Read the full privacy policy</button>
      </div>
    </div>`;
  }

  /* O9 Connect Apple Health */
  function ObHealth() {
    function connect(on) { ob({ appleHealth: on }); set(function (s) { s.settings.appleHealth = on; return s; }); if (on) toast('Connected. In the app, iOS asks what to share first.'); nav.go('ob-reminders'); }
    return html`<div class="scr plain">
      <${Skip} onClick=${function () { connect(true); }} />
      <${Steps} n=${11} />
      <div style=${{ width: 96, height: 96, borderRadius: 9999, background: 'var(--rose)', display: 'grid', placeItems: 'center', color: 'var(--on-pastel)', marginTop: 8 }}><${Icon} name="heart" size=${40} w=${1.8} /></div>
      <div class="stack">
        <h1 class="t-title">Connect Apple Health</h1>
        <p class="body-lg muted">Less typing. If you already weigh in or track steps there, Steadie picks it up.</p>
      </div>
      <div class="list">
        <${Row} title="Weight" right=${html`<span class="pill-tag tint-sky">Read</span>`} />
        <${Row} title="Steps" right=${html`<span class="pill-tag tint-sky">Read</span>`} />
        <${Row} title="Workouts" right=${html`<span class="pill-tag tint-sage">Read and save</span>`} />
      </div>
      <p class="caption muted">You choose exactly what to share on the next screen. Change it any time in the Health app.</p>
      <div class="foot">
        <${Btn} block onClick=${function () { connect(true); }}>Connect<//>
        <${Btn} variant="quiet" size="sm" style=${{ alignSelf: 'center' }} onClick=${function () { connect(false); }}>Skip for now<//>
      </div>
    </div>`;
  }

  /* O10 Reminders */
  function ObReminders() {
    var s = useApp();
    function done(on) { ob({ remindersOn: on }); set(function (s) { s.settings.reminders.habit = on; return s; }); nav.go('ob-building'); }
    return html`<div class="scr plain">
      <${Skip} onClick=${function () { done(true); }} />
      <${Steps} n=${12} />
      <div class="stack">
        <h1 class="t-title">A gentle nudge, once a day</h1>
        <p class="body muted">Short, kind reminders for your habits. Never about your weight.</p>
      </div>
      <div class="card" style=${{ flexDirection: 'row', gap: 12, alignItems: 'flex-start', boxShadow: 'var(--shadow-lg)' }}>
        <img src=${LP.ASSETS.mark} alt="" style=${{ width: 24, height: 32, flex: 'none', marginTop: 2 }} />
        <div class="grow"><div class="between"><span class="label">STEADIE</span><span class="caption muted">now</span></div>
          <p class="body">Afternoon dip? A protein snack now takes the edge off later.</p></div>
      </div>
      <div class="stack"><p class="label">WHEN SHOULD WE REMIND YOU?</p>
        <${Choices} label="Reminder time" options=${['Morning · 8:00', 'Lunch · 12:30', 'Afternoon · 15:30', 'Evening · 19:00']} value=${s.ob.reminderTime} onChange=${function (v) { ob({ reminderTime: v }); }} /></div>
      <div class="foot">
        <${Btn} block onClick=${function () { done(true); }}>Turn on reminders<//>
        <${Btn} variant="quiet" size="sm" style=${{ alignSelf: 'center' }} onClick=${function () { done(false); }}>Not now<//>
      </div>
    </div>`;
  }

  /* O11 Building your plan: ticks through three steps, then moves on */
  function ObBuilding() {
    var st = React.useState(0), step = st[0], setStep = st[1];
    React.useEffect(function () {
      if (step >= 3) { var t = setTimeout(function () { nav.go('ob-plan', { replace: true }); }, 500); return function () { clearTimeout(t); }; }
      var t2 = setTimeout(function () { setStep(step + 1); }, 700);
      return function () { clearTimeout(t2); };
    }, [step]);
    var items = ['Counting from your last injection', "Picking this week's three habits", 'Fitting strength sessions to your week'];
    return html`<div class="scr plain" style=${{ justifyContent: 'center', alignItems: 'center', gap: 28 }}>
      <${Skip} onClick=${function () { nav.go('ob-plan', { replace: true }); }} />
      <img src=${LP.ASSETS.mark} alt="" style=${{ width: 67, height: 91 }} />
      <h1 class="t-title" style=${{ textAlign: 'center' }}>Building your Steadie plan</h1>
      <div class="card" style=${{ width: '100%', gap: 14 }} role="status" aria-live="polite">
        ${items.map(function (t, i) {
          var done = i < step;
          return html`<div key=${t} class="row">${done
            ? html`<span style=${{ width: 28, height: 28, borderRadius: 9999, display: 'grid', placeItems: 'center', background: 'var(--sage-ink)', color: 'var(--surface-raised)', flex: 'none', animation: 'pop .3s ease-out' }}><${Icon} name="check" size=${16} w=${2.4} /></span>`
            : html`<span style=${{ width: 28, height: 28, borderRadius: 9999, boxShadow: 'inset 0 0 0 3px ' + (i === step ? 'var(--apricot)' : 'var(--line)'), flex: 'none' }}></span>`}
            <span class=${'body' + (done ? '' : ' muted')}>${t}</span></div>`;
        })}
      </div>
    </div>`;
  }

  /* O12 Your Steadie plan */
  function ObPlan() {
    var s = useApp();
    var week = Math.max(1, LP.weekOf(s)), phase = LP.phaseOf(week), ids = LP.habitsForWeek(week);
    var starting = LP.daysBetween(s.ob.lastInjection, LP.TODAY) < 0 ? 'Your plan starts on ' + LP.fmt.dayMonth(s.ob.lastInjection) + '.' : "You're starting in week " + week + '.';
    function start() {
      set(function (s) {
        s.onboarded = true; s.firstDay = true;
        s.habits = { ids: ids, done: {}, today: {}, swappedFrom: null };
        ids.forEach(function (id) { s.habits.done[id] = 0; });
        s.protein = {}; s.hunger = []; s.workouts.done = {}; s.coach = { introSeen: false, messages: [] };
        var tw = parseFloat(s.ob.todayWeight);
        s.weights = s.ob.appleHealth ? LP.seedWeights() : [];
        s.weights = s.weights.filter(function (w) { return w.date !== LP.TODAY; });
        if (tw) s.weights.unshift({ date: LP.TODAY, kg: tw, source: s.ob.appleHealth ? 'Apple Health · 7:42' : 'Logged by you' });
        PHASES_SEEN(s, week);
        s.food = Object.assign({}, s.food, { joinedWeek: week, plan: null }); // the fibre ramp starts today
        return s;
      });
      nav.go('paywall');
    }
    return html`<div class="scr plain">
      <${Skip} onClick=${start} />
      <div class="stack">
        <p class="eyebrow">YOUR STEADIE PLAN</p>
        <h1 class="t-display" style=${{ fontSize: 36, lineHeight: '40px' }}>12 months to make it stick</h1>
        <p class="body muted">Three phases, a few small habits at a time. ${starting}</p>
      </div>
      <div class="stack" style=${{ gap: 10 }}>
        ${LP.PHASES.map(function (p) {
          var cur = p.key === phase.key;
          return html`<div key=${p.key} class=${'card tint-' + p.tone} style=${{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: '14px 16px', boxShadow: cur ? 'inset 0 0 0 2px var(--' + p.tone + '-ink)' : 'none' }}>
            <span class="t-heading" style=${{ width: 70 }}>${p.name}</span>
            <span class="grow body">Weeks ${p.from}–${p.to} · ${p.reveal}</span></div>`;
        })}
      </div>
      <div class="stack">
        <div class="between"><h2 class="t-heading">This week's three habits</h2><span class="pill-tag tint-sky">Week ${week}</span></div>
        ${ids.map(function (id) { var H = LP.HABITS[id]; return html`<${L.HabitCheck} key=${id} id=${'reveal-' + id} label=${H.label} detail=${H.kind === 'days' ? H.note + ', on ' + H.target + ' days' : H.note} />`; })}
      </div>
      <div class="foot"><${Btn} block onClick=${start}>Start my plan<//></div>
    </div>`;
  }
  function PHASES_SEEN(s, week) { LP.PHASES.forEach(function (p) { s.phaseSeen[p.key] = week >= p.from; }); }

  /* P1 Start your free week */
  function Paywall() {
    var s = useApp();
    var a = s.sub.plan === 'yearly';
    function buy() {
      set(function (s) { s.sub.status = 'trial'; return s; });
      nav.go('youre-in');
    }
    var feats = ['Your 12-month plan, three habits a week', 'Weekly steady score and early warnings', 'Strength sessions for home or the gym', 'A coach for habits, food swaps and bad days'];
    return html`<div class="scr plain" style=${{ gap: 18 }}>
      <${Skip} label="Skip payment" onClick=${function () { set(function (s) { s.sub.status = 'trial'; return s; }); nav.go('youre-in'); }} />
      <div class="topbar">
        <img src=${LP.ASSETS.mark} alt="" style=${{ width: 26, height: 35 }} />
        <${Btn} variant="quiet" size="sm" onClick=${function () { toast('No purchases to restore on this Apple ID. In the app, a match unlocks Steadie.'); }}>Restore<//>
      </div>
      <div class="stack" style=${{ gap: 8 }}>
        <h1 class="t-title">Try your plan free for 7 days</h1>
        <p class="body muted">Everything you need for the year after the jab.</p>
      </div>
      <div class="stack" style=${{ gap: 10 }}>
        ${feats.map(function (f) { return html`<div key=${f} class="row"><span style=${{ width: 28, height: 28, borderRadius: 9999, display: 'grid', placeItems: 'center', background: 'var(--sage)', color: 'var(--on-pastel)', flex: 'none' }}><${Icon} name="check" size=${16} w=${2.4} /></span><span class="body">${f}</span></div>`; })}
      </div>
      <${Options} label="Plan" value=${s.sub.plan} style=${{ padding: '16px 18px' }} onChange=${function (v) { set(function (s) { s.sub.plan = v; return s; }); }} options=${[
        { id: 'yearly', title: html`<span class="between" style=${{ width: '100%' }}><span style=${{ fontSize: 16 }}>Yearly</span><span class="pill-tag" style=${{ background: 'var(--surface-raised)', color: 'var(--ink)' }}>7 days free</span></span>`, detail: '£69.99 a year · about £1.35 a week' },
        { id: 'monthly', title: html`<span class="between" style=${{ width: '100%' }}><span style=${{ fontSize: 16 }}>Monthly</span><span class="pill-tag" style=${{ background: 'var(--surface-raised)', color: 'var(--ink)' }}>7 days free</span></span>`, detail: '£12.99 a month' }]} />
      <div class="card tint-sunk" style=${{ gap: 6, padding: '14px 16px' }}>
        <div class="between"><span class="label">Today</span><span class="caption muted">Full access starts</span></div>
        <div class="between"><span class="label">Day 5</span><span class="caption muted">We remind you the trial is ending</span></div>
        <div class="between"><span class="label">Day 7</span><span class="caption muted">${a ? '£69.99 for the year, unless you cancel' : '£12.99 a month, unless you cancel'}</span></div>
      </div>
      <div class="foot">
        <${Btn} block onClick=${buy}>Start my 7 days free<//>
        <p class="caption muted" style=${{ textAlign: 'center' }}>Cancel any time in your App Store settings. Terms · Privacy</p>
      </div>
    </div>`;
  }

  /* P2 You're in */
  function YoureIn() {
    var s = useApp();
    var trial = s.sub.status === 'trial';
    return html`<div class="scr plain">
      <${Art} height=${300} shapes=${[
        { left: -20, right: -20, bottom: 0, height: 90, background: 'var(--sage)' },
        { left: 135, bottom: 90, width: 120, height: 120, background: 'var(--apricot)', animation: 'rise .6s ease-out' },
        { left: 40, top: 40, width: 56, height: 24, background: 'var(--lilac)' },
        { right: 50, top: 60, width: 40, height: 40, background: 'var(--sky)' },
        { right: 90, top: 20, width: 64, height: 24, background: 'var(--butter)' }]} />
      <div class="stack center">
        <h1 class="t-display">You're in</h1>
        <p class="body-lg">${trial ? 'Your free week has started. ' : ''}Your first habits are waiting on Today.</p>
      </div>
      ${trial ? html`<div class="card" style=${{ gap: 6 }}>
        <div class="between"><span class="body muted">Trial ends</span><span class="strong">${LP.fmt.long(s.sub.trialEnds).replace(/^(\w{3})\w*/, '$1')}</span></div>
        <div class="between"><span class="body muted">We'll remind you on</span><span class="strong">${LP.fmt.long(LP.addDays(s.sub.trialEnds, -2)).replace(/^(\w{3})\w*/, '$1')}</span></div>
      </div>` : null}
      <div class="foot"><${Btn} block onClick=${function () { nav.reset('today'); }}>Go to Today<//></div>
    </div>`;
  }

  /* P3 Subscription ended */
  function Lapsed() {
    var s = useApp();
    var week = LP.weekOf(s);
    return html`<div class="scr plain">
      <div class="topbar"><img src=${LP.ASSETS.mark} alt="" style=${{ width: 26, height: 35 }} /><${U.Avatar} /></div>
      <div class="stack">
        <h1 class="t-title">Your subscription has ended</h1>
        <p class="body-lg muted">Your plan and everything you've logged are safe. Pick up exactly where you left off.</p>
      </div>
      <div class="card hero tint-sage" style=${{ gap: 12 }}>
        <span class="label">WHERE YOU ARE</span>
        <span class="t-heading">Week ${week} · ${LP.phaseOf(week).name}</span>
        <div class="between"><span class="body">Last steady score</span><span class="t-num-md">${LP.lastScore(s)}</span></div>
      </div>
      <div class="foot">
        <${Btn} block onClick=${function () { nav.go('paywall'); }}>Resubscribe<//>
        <${Btn} block variant="secondary" onClick=${function () { nav.go('privacy'); }}>Export my data<//>
        <${Btn} variant="quiet" size="sm" style=${{ alignSelf: 'center' }} onClick=${function () { toast('In the app this opens your App Store subscriptions.'); }}>Manage in the App Store<//>
      </div>
    </div>`;
  }

  Object.assign(window.LP.screens = window.LP.screens || {}, {
    launch: { c: Launch, id: 'A1', title: 'Launch', group: 'Entry and sign-in' },
    welcome: { c: Welcome, id: 'A2', title: 'Welcome', group: 'Entry and sign-in' },
    email: { c: Email, id: 'A3', title: 'Email sign-in', group: 'Entry and sign-in' },
    inbox: { c: Inbox, id: 'A4', title: 'Check your inbox', group: 'Entry and sign-in' },
    'ob-status': { c: ObStatus, id: 'O1', title: 'Where you are now', group: 'Onboarding' },
    'ob-stopdate': { c: ObStopDate, id: 'O2', title: 'Stop date', group: 'Onboarding' },
    'ob-start': { c: ObStart, id: 'O3', title: 'Your starting point', group: 'Onboarding' },
    'ob-screening': { c: ObScreening, id: 'O4', title: 'A few quick questions', group: 'Onboarding' },
    'ob-support': { c: ObSupport, id: 'O5', title: 'Support and safe mode', group: 'Onboarding' },
    'ob-training': { c: ObTraining, id: 'O6', title: 'Your training', group: 'Onboarding' },
    'ob-demo': { c: ObDemo, id: 'O6b', title: 'Who shows you the moves', group: 'Onboarding' },
    'ob-food': { c: ObFood, id: 'O7', title: 'Food and hunger', group: 'Onboarding' },
    'ob-consent': { c: ObConsent, id: 'O8', title: 'Your health data', group: 'Onboarding' },
    'ob-health': { c: ObHealth, id: 'O9', title: 'Connect Apple Health', group: 'Onboarding' },
    'ob-reminders': { c: ObReminders, id: 'O10', title: 'Reminders', group: 'Onboarding' },
    'ob-building': { c: ObBuilding, id: 'O11', title: 'Building your plan', group: 'Onboarding' },
    'ob-plan': { c: ObPlan, id: 'O12', title: 'Your Steadie plan', group: 'Onboarding' },
    paywall: { c: Paywall, id: 'P1', title: 'Start your free week', group: 'Paywall' },
    'youre-in': { c: YoureIn, id: 'P2', title: "You're in", group: 'Paywall' },
    lapsed: { c: Lapsed, id: 'P3', title: 'Subscription ended', group: 'Paywall' }
  });
})();
