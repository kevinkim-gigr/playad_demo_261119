/* Playad UGC demo — scripted, tap-only replay of the real Playad mobile chat.
   Every visual piece is cloned from real Playad markup (<template> tags); this file only sequences it.
   Hidden controls: triple-tap the header title = restart. URL ?day=2 jumps to the next-morning report. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const tpl = id => document.getElementById('t-' + id).content.firstElementChild.cloneNode(true);
  const A = p => 'assets/' + p;
  const P_CLS = 'text-[16px] font-normal leading-[24px] text-fg';
  const md = s => s.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');

  const list = () => $('#msgs');
  const scroller = () => $('.autopilot-message-list');
  const toBottom = (smooth = true) => { const s = scroller(); s.scrollTo({ top: s.scrollHeight, behavior: smooth ? 'smooth' : 'auto' }); };
  const now = () => { const d = new Date(); let h = d.getHours(), m = d.getMinutes(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${h}:${String(m).padStart(2, '0')} ${ap}`; };
  let run = 0; // bumps on restart so stale timers stop
  const alive = id => id === run;

  function appear(el) {
    el.style.opacity = '0'; el.style.transform = 'translateY(6px)'; el.style.transition = 'opacity .35s ease, transform .35s ease';
    requestAnimationFrame(() => requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'none'; }));
    return el;
  }

  /* ---------- components ---------- */
  function userBubble(text, replyTo) {
    const el = replyTo ? tpl('answered') : tpl('user');
    $('p', el).textContent = text;
    if (replyTo) $('span.truncate', el).textContent = replyTo;
    $$('time', el).forEach(t => t.textContent = now());
    list().appendChild(appear(el)); toBottom(); return el;
  }
  function asstGroup() {
    const el = tpl('asst');
    const inner = $('div.flex.flex-col.gap-4', el);
    inner.innerHTML = '';
    $$('time', el).forEach(t => t.textContent = now());
    list().appendChild(el);
    return { el, add(node) { inner.appendChild(appear(node)); toBottom(); return node; } };
  }
  // a list whose items are all arrays = several versions of the same message; pick one at random
  const pickV = x => (Array.isArray(x) && x.length && x.every(Array.isArray)) ? x[Math.floor(Math.random() * x.length)] : x;
  function textBlock(paras) {
    paras = pickV(paras);
    const el = tpl('text'); el.innerHTML = '';
    for (const p of paras) {
      if (Array.isArray(p)) { const ul = tpl('ul'); ul.innerHTML = p.map(li => `<li class="${P_CLS}">${md(li)}</li>`).join(''); el.appendChild(ul); }
      else { const q = document.createElement('p'); q.className = P_CLS; q.innerHTML = md(p); el.appendChild(q); }
    }
    return el;
  }
  function reportCard(title, onOpen) {
    const el = tpl('report_card'); $('p', el).textContent = title;
    el.addEventListener('click', onOpen); return el;
  }
  function recCard(r) {
    const el = r.kind === 'Opportunity' ? tpl('rec_opp') : tpl('rec_card');
    const label = $$('span.truncate', el)[0]; label.textContent = r.kind;
    const ps = $$('p', el); ps[0].textContent = r.title; ps[1].textContent = r.detail;
    const btns = $$('button', el); $('span', btns[0]).textContent = r.cta;
    el.querySelector('[role=group]')?.setAttribute('aria-label', r.cta);
    btns[0].addEventListener('click', () => r.onTap && r.onTap(btns[0]));
    btns[1]?.addEventListener('click', () => r.onTap && r.onTap(btns[0]));
    return el;
  }
  function recs(items) {
    const el = tpl('recs'); $$('article', el).forEach(a => a.remove());
    for (const r of items) el.appendChild(recCard(r));
    return el;
  }
  function question(q, options, onNext) {
    const el = tpl('question');
    $('p', el).textContent = q;
    const group = $('[role=radiogroup]', el); group.setAttribute('aria-label', q);
    const proto = $('button[role=radio]', group); const other = $('label', group);
    const ON = 'size-5 border-accent border-[6px]', OFF = 'size-5 border-[1.5px] border-line-strong';
    $$('button[role=radio]', group).forEach(b => b.remove());
    let picked = 0;
    const btns = options.map((o, i) => {
      const b = proto.cloneNode(true);
      const spans = $$('span', b); spans[2].textContent = o.label;
      if (o.hint) spans[3].textContent = o.hint; else spans[3].remove();
      b.addEventListener('click', () => { picked = i; paint(); });
      group.insertBefore(b, other); return b;
    });
    function paint() {
      btns.forEach((b, i) => { const dot = $('span', b); dot.className = dot.className.replace(ON, '').replace(OFF, '').trim() + ' ' + (i === picked ? ON : OFF); b.setAttribute('aria-checked', i === picked); });
    }
    paint();
    const next = $$('button', el).at(-1); next.type = 'button';
    next.addEventListener('click', () => { if (el.dataset.done) return; el.dataset.done = 1; onNext(options[picked], el); });
    return el;
  }
  function carousel(title, items) {
    const el = tpl('carousel');
    $('p', el).textContent = title; $('button[aria-label] span span', el) && ($$('span', $('button', el))[1].textContent = String(items.length));
    $('button', el).setAttribute('aria-label', 'Open ' + title);
    const row = $('.group\\/scroll-row > div', el); const proto = $('button', row);
    row.innerHTML = '';
    for (const it of items) {
      const b = proto.cloneNode(true);
      $('img', b).src = it.img; $('img', b).loading = 'eager';
      const t = $$('span.font-satoshi', b); t[0].textContent = it.title; t[1].textContent = it.sub;
      b.setAttribute('aria-label', `${it.title}. ${it.sub}`);
      b.addEventListener('click', () => viewer(it.img));
      row.appendChild(b);
    }
    $$('.group\\/scroll-row > button', el).forEach(b => b.remove());
    return el;
  }
  function makingCard(title, total) {
    // Rebuilt from the real "New Flow / Open flow" progress card + carousel placeholders.
    const el = document.createElement('section'); el.className = 'flex w-full min-w-0 flex-col gap-2';
    const head = tpl('flowcard');
    $$('span.truncate', head)[0].textContent = 'Making ' + title;
    $('span.text-fg-secondary', head).textContent = `0 of ${total} done`;
    const icon = $('span[aria-hidden]', head); icon.innerHTML = '<span class="demo-spin"></span>';
    const row = document.createElement('div'); row.className = 'flex gap-2 overflow-hidden';
    for (let i = 0; i < total; i++) { const ph = document.createElement('div'); ph.className = 'demo-ph rounded-card border border-line-subtle bg-surface'; ph.innerHTML = '<span class="demo-spin"></span>'; row.appendChild(ph); }
    head.appendChild(row); row.style.padding = '0 10px 10px';
    el.appendChild(head);
    el.setDone = n => { $('span.text-fg-secondary', head).textContent = `${n} of ${total} done`; };
    return el;
  }
  function actionCard(title, sub, onOpen) {
    const el = tpl('action_card'); $('p', el).textContent = title;
    $$('span.truncate', el).at(-1).textContent = sub;
    el.addEventListener('click', onOpen); return el;
  }
  function thinking(avatar, labels) {
    const row = tpl('thinking'); $('img', row).src = A('thinking_' + avatar + '.svg');
    const wrap = document.createElement('div'); wrap.appendChild(row); list().appendChild(appear(wrap)); toBottom();
    const lab = $$('.opacity-80', row)[0], shine = lab.nextElementSibling, secs = $$('span.shrink-0.text-fg-tertiary', row).at(-1);
    let t0 = Date.now(), i = 0;
    const setLabel = s => { lab.textContent = s; if (shine) shine.textContent = s; };
    setLabel(labels[0]);
    const tick = setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000) + 3; if (secs) secs.textContent = s + 's'; }, 500);
    const step = setInterval(() => { i = Math.min(i + 1, labels.length - 1); setLabel(labels[i]); }, 2200);
    composerBusy(true);
    return () => { clearInterval(tick); clearInterval(step); wrap.remove(); composerBusy(false); };
  }

  /* ---------- shell bits ---------- */
  function composerBusy(on) {
    const ta = $('#composer'); if (!ta) return;
    ta.placeholder = on ? 'Replying... send now to apply right away' : 'Ask anything...';
    document.body.classList.toggle('demo-busy', on);
  }
  function statusBar(state, text, more) {
    const sb = $('#statusbar'); sb.hidden = false;
    const pill = $('span.rounded-full', sb), cnt = $$('span.truncate, span.min-w-0', sb).find(s => /done|processing/.test(s.textContent)) || $$('span', sb)[3];
    pill.lastChild.textContent = state;
    pill.classList.toggle('demo-processing', state !== 'All done');
    $$('span', sb).forEach(s => { if (/done$|processing$/.test(s.textContent.trim()) && s !== pill) s.textContent = text; });
    const m = $$('span', sb).find(s => /more$/.test(s.textContent.trim())); if (m) m.textContent = more || '';
  }
  function setTitle(t) { $('#title').textContent = t; }
  function toast(title, sub, onTap) {
    const t = $('#demo-toast'); $('.demo-toast-title', t).textContent = title; $('.demo-toast-sub', t).textContent = sub;
    t.hidden = false; appear(t); t.onclick = e => { if (e.target.closest('.demo-toast-x')) { t.hidden = true; return; } t.hidden = true; onTap(); };
  }

  /* ---------- sheets ---------- */
  function openSheet(id) { const s = document.getElementById(id); s.hidden = false; requestAnimationFrame(() => s.classList.add('open')); }
  function closeSheet(id) { const s = document.getElementById(id); s.classList.remove('open'); setTimeout(() => s.hidden = true, 280); }
  function openReport(day) { const r = DATA.days[day].report; fillReport(r); openSheet('sheet-report'); }
  function fillReport(r) {
    const s = $('#sheet-report');
    $('.rp-title', s).textContent = r.title; $('.rp-date', s).textContent = r.date;
    $('.rp-head', s).textContent = r.headline;
    $('.rp-judge', s).textContent = r.judgement; $('.rp-action', s).textContent = r.action;
    $('.rp-table tbody', s).innerHTML = r.rows.map(([m, y, a, c, tone]) => `<tr><td>${m}</td><td>${y}</td><td>${a}</td><td class="${tone === 'bad' ? 'dn' : tone === 'good' ? 'up' : ''}">${c}</td></tr>`).join('');
    $('.rp-chart', s).innerHTML = chart(r.chart);
    $('.rp-ads', s).innerHTML = r.ads.map(a => `<div class="rp-ad"><img src="${a.img}"><div><b>${a.name}</b><span>${a.note}</span></div><em class="${a.tone}">${a.cpa}</em></div>`).join('');
  }
  function chart(c) {
    const W = 320, H = 150, L = 34, B = 22, max = c.max;
    const x = i => L + i * (W - L - 8) / (c.labels.length - 1), y = v => 8 + (H - B - 8) * (1 - v / max);
    const path = vs => vs.map((v, i) => v == null ? '' : `${i && vs[i - 1] != null ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
    const grid = [0, max / 2, max].map(v => `<line x1="${L}" x2="${W - 4}" y1="${y(v)}" y2="${y(v)}" stroke="#eceef3"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end">${c.prefix || ''}${v}</text>`).join('');
    const xl = c.labels.map((l, i) => `<text x="${x(i)}" y="${H - 4}" text-anchor="middle">${l}</text>`).join('');
    const lines = c.series.map(s => `<path d="${path(s.v)}" fill="none" stroke="${s.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>` + s.v.map((v, i) => v == null ? '' : `<circle cx="${x(i)}" cy="${y(v)}" r="2.6" fill="${s.color}"/>`).join('')).join('');
    const legend = c.series.map(s => `<span class="rp-leg"><i style="background:${s.color}"></i>${s.name}</span>`).join('');
    return `<h4>${c.title}</h4><div class="rp-legs">${legend}</div><svg viewBox="0 0 ${W} ${H}" class="rp-svg">${grid}${xl}${lines}</svg>`;
  }
  function openPanel(p) {
    const s = $('#sheet-panel');
    $('h2', s).textContent = p.title; $('header p.mt-1', s).textContent = p.meta;
    $('header p.rounded-xl', s).textContent = p.desc;
    $('h3', s).textContent = `Done (${p.items.length})`;
    const box = $('.demo-items', s); const proto = DATA._panelItem;
    box.innerHTML = '';
    for (const it of p.items) {
      const el = proto.cloneNode(true);
      const thumb = $('button img, button video', el);
      if (it.img && thumb) { const im = document.createElement('img'); im.className = 'h-full w-full object-cover'; im.src = it.img; thumb.replaceWith(im); }
      const ps = $$('p', el); ps[0].textContent = it.kind; ps[1].textContent = it.name;
      const badge = $('span[data-tone]', el); badge.lastChild.textContent = it.state;
      if (it.state === 'Paused') { badge.className = badge.className.replace('bg-success-soft text-success-text', 'bg-fill-strong text-fg-secondary'); }
      box.appendChild(el);
    }
    s.hidden = false;
  }
  function viewer(src) { const v = $('#sheet-viewer'); $('img', v).src = src; v.hidden = false; }

  /* ---------- tabs ---------- */
  function showScreen(name) {
    $$('[data-screen]').forEach(s => s.hidden = s.dataset.screen !== name);
  }
  function wireNav() {
    $$('[data-screen] [aria-label="Chat"]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); showScreen('chat'); }));
    $$('[data-screen] [aria-label="My"]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); showScreen('my'); }));
    $$('[data-screen] [aria-label="Scheduler"]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); showScreen('sched'); }));
    $$('[data-screen] [aria-label="Launch"]').forEach(b => b.addEventListener('click', e => e.preventDefault()));
    $$('[data-screen] a[href]').forEach(a => a.addEventListener('click', e => e.preventDefault()));
  }

  /* ---------- free typing (message 6) ---------- */
  function wireComposer() {
    const ta = $('#composer'), send = $('#send');
    const go = async () => {
      const q = ta.value.trim(); if (!q || document.body.classList.contains('demo-busy')) return;
      ta.value = ''; ta.style.height = '24px'; userBubble(q);
      const id = run; const stop = thinking('jordan', ['Thinking', 'Reviewing recent ad performance']);
      await wait(2600); if (!alive(id)) return; stop();
      const g = asstGroup(); g.add(textBlock(answerFor(q)));
    };
    send.addEventListener('click', e => { e.preventDefault(); go(); });
    ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); go(); } });
    ta.addEventListener('input', () => { ta.style.height = '24px'; ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'; document.body.classList.toggle('demo-typing', !!ta.value.trim()); });
  }
  function answerFor(q) {
    const s = q.toLowerCase();
    for (const a of DATA.answers) if (a.k.some(k => s.includes(k))) return a.a;
    return DATA.answers.at(-1).a;
  }

  /* ---------- scenario ---------- */
  // Real flow (checked on mobile web 11/19): My → Action needed card → new chat with an auto-sent prompt →
  // analyst checks live data → designer makes replacements → plan + approval → Meta work → next 8:00 AM report
  // arrives as a scheduled chat in the side menu.
  const chats = [];
  function addChat(c) { chats.unshift(c); paintDrawer(); }
  function paintDrawer() {
    const box = $('#drawer-chats'); if (!box) return; box.innerHTML = '';
    for (const c of chats) {
      const r = tpl('chatrow'); $('[data-sidebar-chat-title]', r).textContent = c.title;
      if (c.current) r.classList.add('bg-fill');
      const act = $('[aria-label="Chat actions"]', r); act && act.remove();
      if (c.clock) r.insertAdjacentHTML('beforeend', '<span class="row-clock"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span>');
      if (c.dot) r.insertAdjacentHTML('beforeend', '<span class="row-dot"></span>');
      r.addEventListener('click', () => { closeDrawer(); if (c.open) { c.dot = false; c.open(); } });
      box.appendChild(r);
    }
  }
  function openDrawer() { paintDrawer(); const d = $('#drawer'); d.hidden = false; requestAnimationFrame(() => d.classList.add('open')); }
  function closeDrawer() { const d = $('#drawer'); d.classList.remove('open'); setTimeout(() => d.hidden = true, 280); }

  // The tapped card continues into the chat: its button label shows as the user's message, the card title above it.
  const cardOf = btn => { const a = btn && btn.closest('article'); const p = a && a.querySelector('p'); return p ? p.textContent.trim() : ''; };
  const ctaOf = btn => (btn && btn.textContent.trim()) || '';
  function newChat(title, prompt, btn) {
    chats.forEach(c => c.current = false);
    addChat({ title, current: true });
    resetChat(title);
    if (btn) userBubble(ctaOf(btn), cardOf(btn));
  }
  async function fix(btn) {
    if (btn.dataset.used) return; btn.dataset.used = 1;
    const id = run; const D = DATA.days[1];
    newChat(D.chatTitle, D.autoPrompt, btn);
    let stop = thinking('riley', ['Checking live ad account details', 'Reviewing recent ad performance']);
    await wait(3400); if (!alive(id)) return; stop();
    let g = asstGroup(); g.add(textBlock(D.analysis));
    await wait(900); if (!alive(id)) return;
    stop = thinking('casey', ['Thinking', 'Planning replacements']);
    await wait(2400); if (!alive(id)) return; stop();
    g = asstGroup(); g.add(textBlock(D.fixIntro));
    await wait(700); if (!alive(id)) return;
    const mk = g.add(makingCard(D.making, 3));
    for (let n = 1; n <= 3; n++) { await wait(1500); if (!alive(id)) return; mk.setDone(n); }
    await wait(500); if (!alive(id)) return;
    mk.replaceWith(appear(carousel(D.setTitle, D.creatives))); toBottom();
    await wait(2600); if (!alive(id)) return;
    g.add(textBlock(D.doneText));
    await wait(900); if (!alive(id)) return;
    g.add(textBlock(D.plan));
    await wait(700); if (!alive(id)) return;
    g.add(question(D.approveQ, [{ label: 'Approve' }, { label: 'Request changes' }, { label: 'Cancel' }], (opt, el) => approve(opt, el)));
  }
  async function approve(opt, qel) {
    const id = run; const D = DATA.days[1];
    qel.remove(); userBubble(opt.label, D.approveQ);
    if (opt.label !== 'Approve') { asstGroup().add(textBlock([opt.label === 'Cancel' ? 'Okay, nothing changed. Video 2 keeps running as is.' : 'Sure. Tell me what to change: the look, the copy, or which ad to replace.'])); return; }
    const stop = thinking('morgan', ['Thinking', 'Updating your Meta ads']);
    await wait(1800); if (!alive(id)) return; stop();
    const g = asstGroup();
    g.add(textBlock([D.applying]));
    g.add(actionCard(D.panel.title, D.actionSub, () => openPanel(D.panel)));
    lastPanel = D.panel; statusBar('Processing', '4 processing');
    await wait(2600); if (!alive(id)) return;
    statusBar('All done', '4 done');
    g.add(textBlock(D.applied));
    await wait(3500); if (!alive(id)) return;
    // next morning: the scheduled daily report shows up as its own chat in the side menu
    addChat({ title: DATA.days[2].chatTitle, clock: true, dot: true, open: () => day2() });
    document.body.classList.add('menu-unread');
  }
  async function day2() {
    const id = ++run; const D = DATA.days[2];
    chats.forEach(c => c.current = c.title === D.chatTitle);
    resetChat(D.chatTitle); document.body.classList.remove('menu-unread');
    await wait(500); if (!alive(id)) return;
    const g = asstGroup();
    g.add(textBlock([D.hello]));
    await wait(1100); if (!alive(id)) return;
    g.add(textBlock([D.hello2]));
    await wait(1100); if (!alive(id)) return;
    g.add(reportCard(D.report.cardTitle, () => openReport(2)));
    await wait(1000); if (!alive(id)) return;
    g.add(textBlock(D.summary));
    await wait(1000); if (!alive(id)) return;
    g.add(recs(D.recs.map(r => ({ ...r, onTap: el => quick(el, r.flow, true) }))));
  }
  // Other Action-needed cards: new chat with the auto prompt -> plan -> approve -> applied.
  async function quick(btn, f, inChat) {
    if (!f || btn.dataset.used) return; btn.dataset.used = 1;
    const id = run;
    if (inChat) userBubble(ctaOf(btn), cardOf(btn)); else newChat(f.chatTitle, f.autoPrompt, btn);
    const stop = thinking(f.avatar || 'riley', ['Checking live ad account details', f.thinking]);
    await wait(2600); if (!alive(id)) return; stop();
    const g = asstGroup();
    g.add(textBlock(f.plan));
    await wait(700); if (!alive(id)) return;
    if (f.creatives) {  // make the images and show them before asking to launch
      const n = f.creatives.length, mk = g.add(makingCard(f.making, n));
      for (let i = 1; i <= n; i++) { await wait(1500); if (!alive(id)) return; mk.setDone(i); }
      await wait(500); if (!alive(id)) return;
      mk.replaceWith(appear(carousel(f.making, f.creatives))); toBottom();
      await wait(2600); if (!alive(id)) return;
      g.add(textBlock(f.launchPlan));
      await wait(700); if (!alive(id)) return;
    }
    g.add(question(f.q, [{ label: 'Approve' }, { label: 'Request changes' }, { label: 'Cancel' }], async (opt, qel) => {
      qel.remove(); userBubble(opt.label, f.q);
      if (opt.label !== 'Approve') { asstGroup().add(textBlock([opt.label === 'Cancel' ? 'Okay, nothing changed.' : 'Sure. Tell me what you’d like to change.'])); return; }
      const st = thinking('morgan', ['Thinking', 'Updating your Meta ads']);
      await wait(1600); if (!alive(id)) return; st();
      const g2 = asstGroup();
      const panel = { title: f.action, meta: 'Pellstride · ' + now(), desc: f.desc, items: f.items }; lastPanel = panel;
      g2.add(actionCard(f.action, f.actionSub, () => openPanel(panel)));
      statusBar('Processing', f.items.length + ' processing');
      await wait(2000); if (!alive(id)) return;
      statusBar('All done', f.items.length + ' done');
      g2.add(textBlock(f.done));
    }));
  }
  let lastPanel = null;
  function resetChat(title) {
    list().innerHTML = ''; setTitle(title); $('#statusbar').hidden = true; $('#demo-toast').hidden = true;
    ['sheet-report', 'sheet-panel', 'sheet-viewer'].forEach(i => document.getElementById(i).hidden = true);
    showScreen('chat'); composerBusy(false); scroller().scrollTop = 0;
  }
  let pills = null;
  function fillMy() {
    const b = DATA.brand; if (!b) return;
    $$('[data-brand=name]').forEach(e => e.textContent = b.name);
    $$('[data-brand=domain]').forEach(e => e.textContent = b.domain);
    $$('[data-brand=initial]').forEach(e => e.textContent = b.name[0]);
    const arts = $$('[data-screen=my] article').slice(0, 3);
    if (!pills) { pills = {}; arts.forEach(a => { const p = a.querySelector('span.rounded-full'); const t = p && p.textContent.trim(); if (t && !pills[t]) pills[t] = p.cloneNode(true); }); }
    DATA.cardsText.forEach((c, i) => {
      const a = arts[i]; if (!a) return;
      const p = a.querySelector('p'); if (p) p.textContent = c.title;
      const det = [...a.querySelectorAll('span.truncate')].find(x => x.textContent.trim().length > 20); if (det) det.textContent = c.detail;
      const btn = a.querySelector('[data-act]'); if (btn) { (btn.querySelector('span') || btn).textContent = c.cta; }
      const pill = a.querySelector('span.rounded-full'); if (pill && pills[c.kind] && pill.textContent.trim() !== c.kind) pill.replaceWith(pills[c.kind].cloneNode(true));
    });
  }
  function start() {
    fillMy();
    ++run; chats.length = 0; DATA.startChats.forEach(t => chats.push({ title: t })); paintDrawer();
    document.body.classList.remove('menu-unread');
    $$('[data-screen=my] article').forEach(a => a.hidden = false);
    $$('[data-act]').forEach(b => delete b.dataset.used);
    list().innerHTML = ''; showScreen('my');
    const sc = $('[data-screen=my] .overflow-y-auto') || $('[data-screen=my] main'); sc && (sc.scrollTop = 0);
  }

  /* ---------- boot ---------- */
  function boot() {
    addEventListener('submit', e => e.preventDefault(), true);
    document.querySelectorAll('button:not([type])').forEach(b => b.type = 'button');
    const vh = () => document.documentElement.style.setProperty('--app-vh', window.innerHeight + 'px');
    vh(); addEventListener('resize', vh);
    DATA._panelItem = $('#sheet-panel .demo-items > *').cloneNode(true);
    wireNav(); wireComposer();
    $('#sheet-report .rp-close').addEventListener('click', () => closeSheet('sheet-report'));
    $$('#sheet-panel button[title]').forEach(b => b.addEventListener('click', () => $('#sheet-panel').hidden = true));
    $('#sheet-viewer').addEventListener('click', () => $('#sheet-viewer').hidden = true);
    $('#statusbar').addEventListener('click', () => lastPanel && openPanel(lastPanel));
    $$('[aria-label="Menu"]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); openDrawer(); }));
    $('#drawer .drawer-scrim').addEventListener('click', closeDrawer);
    const cards = DATA.days[1].cards;
    $$('[data-act]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); const i = +b.dataset.act; i === 0 ? fix(b) : quick(b, cards[i].flow); }));
    $$('[data-dismiss]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); b.closest('article').hidden = true; }));
    let taps = 0, tt; const restart = () => { taps++; clearTimeout(tt); tt = setTimeout(() => taps = 0, 600); if (taps >= 3) { taps = 0; start(); } };
    $('#title').addEventListener('click', restart);
    $$('[data-screen=my] h1, [data-screen=my] header p').forEach(h => h.addEventListener('click', restart));
    start();
  }
  document.readyState === 'loading' ? addEventListener('DOMContentLoaded', boot) : boot();
})();
