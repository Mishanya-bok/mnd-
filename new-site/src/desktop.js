// mnd. — главный экран в виде рабочего стола: папки, файлы, окна и док
import { projects, showreel } from './data/projects.js'

const $ = (s, r = document) => r.querySelector(s)
const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
// подпись под работой: у коммерческих — клиент (если указан), у некоммерческих — «Авторский ролик mnd.»
const meta = (p) => (p.commercial === false ? 'Авторский ролик mnd.' : p.client || '')
const byId = Object.fromEntries([...projects, ...(showreel ? [showreel] : [])].map((p) => [p.id, p]))
const mobile = () => matchMedia('(max-width: 720px)').matches
const TG = { misha: 'https://t.me/mishanya_bok', sofia: 'https://t.me/alienlale' }

// ── иконки ───────────────────────────────────────────
const svg = (d, vb = '0 0 24 24') =>
  `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`
const GLYPH = {
  works: svg('<path d="M8 6l10 6-10 6z" fill="currentColor" stroke="none"/>'),
  pipeline: svg('<path d="M4 6h10M4 12h16M4 18h7"/><circle cx="18" cy="6" r="2"/><circle cx="15" cy="18" r="2"/>'),
  about: svg('<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14.2c2.6-.4 4.6 1.2 5 4.3"/>'),
  plane: svg('<path d="M21 4L3 11l6.5 2.2L12 20l3-5.5L21 4z" fill="currentColor" stroke="none"/><path d="M9.5 13.2L21 4" stroke="#0c0d0b" stroke-width="1.5"/>'),
  price: svg('<path d="M8 20V4h6a4 4 0 010 8H6M6 16h8"/>'),
  calc: svg('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>'),
  pen: svg('<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>'),
  trash: svg('<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>'),
  user: svg('<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.8 3.6-6 7-6s6.2 2.2 7 6"/>'),
}
const ICON = {
  folder: (g) => `<span class="folder"><i></i>${GLYPH[g] || ''}</span>`,
  doc: (g) => `<span class="doc">${g ? `<b class="g">${GLYPH[g]}</b>` : '<b>₽</b>'}<s></s></span>`,
  calc: () => `<span class="calc-ic"><i></i><u></u></span>`,
  trash: () => `<span class="bin"><i></i><u></u></span>`,
  film: (p) => `<span class="film"><img src="${encodeURI(p.thumb)}" alt="" draggable="false" decoding="async" /><em>MP4</em></span>`,
  app: () => `<span class="app">${GLYPH.plane}</span>`,
}

// ── «приложения» (окна) ──────────────────────────────
const APPS = {
  works: { title: 'Работы', icon: () => ICON.folder('works'), size: [900, 600], render: renderWorks, mount: mountWorks },
  pipeline: { title: 'Пайплайн', icon: () => ICON.folder('pipeline'), size: [700, 660], render: renderPipeline },
  price: { title: 'Прайс', icon: () => ICON.doc(), size: [800, 680], render: renderPrice },
  about: { title: 'О нас', icon: () => ICON.folder('about'), size: [800, 680], render: renderAbout },
  calc: { title: 'Калькулятор', icon: () => ICON.calc(), size: [360, 600], render: renderCalc, mount: mountCalc },
  brief: { title: 'Бриф.txt', icon: () => ICON.doc('pen'), size: [600, 660], render: renderBrief, mount: mountBrief },
  trash: { title: 'Корзина', icon: () => ICON.trash(), size: [640, 440], render: renderTrash, mount: mountTrash },
}

// ── рабочий стол ─────────────────────────────────────
// позиции — доли ширины/высоты стола (иконки можно перетаскивать, раскладка запоминается)
// pos — на компьютере: [доля ширины, доля высоты полосы, 't' — над заголовком | 'b' — под плашкой]
// m — на телефоне: доли свободной области под заголовком
const ITEMS = [
  { key: 'works', open: 'works', label: 'Работы', icon: APPS.works.icon(), pos: [0.33, 0.1, 'b'], m: [0.44, 0.42] },
  { key: 'pipeline', open: 'pipeline', label: 'Пайплайн', icon: APPS.pipeline.icon(), pos: [0.27, 0.55, 't'], m: [0.42, 0] },
  { key: 'price', open: 'price', label: 'Прайс.pdf', icon: APPS.price.icon(), pos: [0.66, 0.75, 't'], m: [0.8, 0.1] },
  { key: 'about', open: 'about', label: 'О нас', icon: APPS.about.icon(), pos: [0.46, 0, 't'], m: [0.03, 0.04] },
  { key: 'calc', open: 'calc', label: 'Калькулятор', icon: APPS.calc.icon(), pos: [0.18, 0.6, 'b'], m: [0.08, 0.38] },
  { key: 'brief', open: 'brief', label: 'Бриф.txt', icon: APPS.brief.icon(), pos: [0.63, 0.75, 'b'], m: [0.82, 0.5] },
  { key: 'tg', href: TG.misha, label: 'Написать нам', icon: ICON.app(), pos: [0.8, 0.2, 't'], m: [0.5, 0.82] },
  { key: 'trash', open: 'trash', label: 'Корзина', icon: APPS.trash.icon(), pos: [0.77, 0, 'b'], m: [0.82, 0.9] },
  // из роликов на столе лежит только шоурил
  ...(showreel
    ? [{ key: 'showreel', open: 'work/' + showreel.id, label: 'Showreel.mp4', icon: ICON.film(showreel), pos: [0.482, 0.35, 'b'], m: [0.1, 0.74], big: true }]
    : []),
]

const desk = $('#desk')
const STORE = 'mnd-desk-v8' // раскладка на компьютере и телефоне хранится отдельно
let saved = {}
try {
  saved = JSON.parse(localStorage.getItem(STORE) || '{}')
} catch {}

const itemEls = ITEMS.map((it, n) => {
  const el = document.createElement(it.href ? 'a' : 'button')
  el.className = 'item' + (it.big ? ' big' : '')
  el.dataset.key = it.key
  if (it.href) {
    el.href = it.href
    el.target = '_blank'
    el.rel = 'noopener'
  }
  el.innerHTML = `<span class="ic">${it.icon}</span><span class="lb">${esc(it.label)}</span>`
  desk.appendChild(el)
  setTimeout(() => el.classList.add('in'), 120 + n * 60)
  return el
})

// свободная область стола: на телефоне — под заголовком и над доком
function area() {
  const d = desk.getBoundingClientRect()
  const iw = mobile() ? 86 : 104
  if (mobile()) {
    const h1 = $('#title h1').getBoundingClientRect()
    const top = Math.max(0, h1.bottom - d.top + 16)
    // снизу оставляем место под плашку Netlify — дока на телефоне нет
    return { d, iw, left: 4, top, W: d.width - iw - 8, H: d.height - top - 110 - 112, mode: 'm' }
  }
  return { d, iw, left: 4, top: 8, W: d.width - 110, H: d.height - 230, mode: 'pos' }
}
function placeItems() {
  const A = area()
  // на компьютере иконки держатся у центра: полоса над заголовком и полоса между плашкой и доком
  const t = $('#title').getBoundingClientRect()
  const bands = {
    t: [8, Math.max(8, t.top - A.d.top - 116)],
    b: [t.bottom - A.d.top + 14, Math.max(t.bottom - A.d.top + 14, A.d.height - 92 - 120)],
  }
  ITEMS.forEach((it, i) => {
    const el = itemEls[i]
    const w = el.offsetWidth || A.iw
    const s = saved[A.mode + ':' + it.key]
    let x, y
    if (s) {
      x = s[0] * A.W + A.left
      y = s[1] * A.H + A.top
    } else if (A.mode === 'pos') {
      const [fx, fy, band] = it.pos
      const [y0, y1] = bands[band]
      x = fx * A.W + A.left
      y = y0 + fy * (y1 - y0)
    } else {
      x = it.m[0] * A.W + A.left
      y = it.m[1] * A.H + A.top
    }
    el.style.left = Math.round(Math.min(A.d.width - w - 2, Math.max(2, x))) + 'px'
    el.style.top = Math.round(Math.max(0, y)) + 'px'
  })
}

// выделение, перетаскивание и открытие иконок
let sel = null
function select(el) {
  sel?.classList.remove('sel')
  sel = el
  el?.classList.add('sel')
}
desk.addEventListener('pointerdown', (e) => {
  const el = e.target.closest('.item')
  select(el)
  if (!el || e.button !== 0) return
  const r0 = el.getBoundingClientRect()
  const d = desk.getBoundingClientRect()
  const st = { x: e.clientX, y: e.clientY, l: r0.left - d.left, t: r0.top - d.top, moved: false }
  el.setPointerCapture(e.pointerId)
  const move = (ev) => {
    const dx = ev.clientX - st.x
    const dy = ev.clientY - st.y
    if (!st.moved && Math.hypot(dx, dy) < 5) return
    st.moved = true
    el.classList.add('drag')
    el.style.left = Math.max(0, Math.min(d.width - el.offsetWidth, st.l + dx)) + 'px'
    el.style.top = Math.max(0, Math.min(d.height - el.offsetHeight - (mobile() ? 90 : 0), st.t + dy)) + 'px'
  }
  const up = () => {
    el.removeEventListener('pointermove', move)
    el.removeEventListener('pointerup', up)
    el.removeEventListener('pointercancel', up)
    el.classList.remove('drag')
    if (st.moved) {
      el.dataset.dragged = '1'
      const A = area()
      saved[A.mode + ':' + el.dataset.key] = [
        (parseFloat(el.style.left) - A.left) / A.W,
        (parseFloat(el.style.top) - A.top) / A.H,
      ]
      try {
        localStorage.setItem(STORE, JSON.stringify(saved))
      } catch {}
    }
  }
  el.addEventListener('pointermove', move)
  el.addEventListener('pointerup', up)
  el.addEventListener('pointercancel', up)
})
desk.addEventListener('click', (e) => {
  const el = e.target.closest('.item')
  if (!el) return
  if (el.dataset.dragged) {
    delete el.dataset.dragged
    e.preventDefault()
    return
  }
  const it = ITEMS.find((x) => x.key === el.dataset.key)
  if (it.open) open(it.open, el)
})

// ── окна ─────────────────────────────────────────────
const wins = new Map() // key -> { el, key }
let z = 100
const MB = 30
const DOCK = 92

function topWin() {
  let best = null
  wins.forEach((w) => {
    if (!w.el.classList.contains('mini') && (!best || +w.el.style.zIndex > +best.el.style.zIndex)) best = w
  })
  return best
}
function focus(w) {
  w.el.style.zIndex = ++z
  wins.forEach((o) => o.el.classList.toggle('top', o === w))
  setHash(w.key)
  updateDock()
}
function setHash(key) {
  const h = key ? '#' + key : ' '
  if (location.hash !== h) history.replaceState(null, '', key ? '#' + key : location.pathname)
}

function appFor(key) {
  if (key.startsWith('work/')) {
    const p = byId[key.slice(5)]
    if (!p) return null
    return {
      title: p.title + '.mp4',
      size: p.vertical ? [860, 680] : [1060, 620],
      render: () => renderPlayer(p),
      mount: (el) => mountPlayer(el, p),
    }
  }
  return APPS[key] || null
}

function open(key, fromEl) {
  const have = wins.get(key)
  if (have) {
    have.el.classList.remove('mini')
    focus(have)
    return have
  }
  const app = appFor(key)
  if (!app) return null
  const el = document.createElement('section')
  el.className = 'win'
  el.setAttribute('role', 'dialog')
  el.setAttribute('aria-label', app.title)
  el.innerHTML = `
    <div class="tb">
      <span class="lights">
        <button class="l-close" aria-label="Закрыть">${svg('<path d="M6 6l12 12M18 6L6 18"/>')}</button>
        <button class="l-min" aria-label="Свернуть">${svg('<path d="M5 12h14"/>')}</button>
        <button class="l-max" aria-label="Развернуть">${svg('<path d="M7 17L17 7M9 7h8v8"/>')}</button>
      </span>
      <span class="tt">${esc(app.title)}</span>
    </div>
    <div class="wb">${app.render()}</div>
    ${['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].map((d) => `<i class="rz rz-${d}" data-rz="${d}"></i>`).join('')}`
  // размер и позиция: по центру со сдвигом «лесенкой»
  const vw = innerWidth
  const vh = innerHeight
  const w = Math.min(app.size[0], vw - 40)
  const h = Math.min(app.size[1], vh - MB - DOCK - 20)
  const n = wins.size % 6
  const left = Math.max(12, (vw - w) / 2 + (n - 2) * 26)
  const top = Math.max(MB + 10, MB + (vh - MB - DOCK - h) / 2 + (n - 2) * 22)
  Object.assign(el.style, { left: left + 'px', top: top + 'px', width: w + 'px', height: h + 'px' })
  if (fromEl) {
    const r = fromEl.getBoundingClientRect()
    el.style.transformOrigin = `${r.left + r.width / 2 - left}px ${r.top + r.height / 2 - top}px`
  }
  document.body.appendChild(el)
  const rec = { el, key }
  wins.set(key, rec)
  wireWin(rec)
  app.mount?.(el)
  focus(rec)
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')))
  return rec
}

function close(rec) {
  rec.el.querySelectorAll('video').forEach((v) => v.pause())
  rec.el.classList.remove('in')
  rec.el.classList.add('out')
  wins.delete(rec.key)
  setTimeout(() => rec.el.remove(), 250)
  const t = topWin()
  if (t) focus(t)
  else {
    setHash('')
    updateDock()
  }
}
function minimize(rec) {
  rec.el.querySelectorAll('video').forEach((v) => v.pause())
  rec.el.classList.add('mini')
  rec.el.classList.remove('top')
  const t = topWin()
  if (t) focus(t)
  else {
    setHash('')
    updateDock()
  }
}
function toggleMax(rec) {
  const el = rec.el
  el.classList.add('max')
  if (rec.prev) {
    Object.assign(el.style, rec.prev)
    rec.prev = null
  } else {
    rec.prev = { left: el.style.left, top: el.style.top, width: el.style.width, height: el.style.height }
    Object.assign(el.style, { left: '8px', top: MB + 8 + 'px', width: innerWidth - 16 + 'px', height: innerHeight - MB - DOCK - 8 + 'px' })
  }
  setTimeout(() => el.classList.remove('max'), 320)
}

function wireWin(rec) {
  const el = rec.el
  el.addEventListener('pointerdown', () => focus(rec), true)
  el.querySelector('.l-close').addEventListener('click', () => close(rec))
  el.querySelector('.l-min').addEventListener('click', () => minimize(rec))
  el.querySelector('.l-max').addEventListener('click', () => toggleMax(rec))
  const tb = el.querySelector('.tb')
  tb.addEventListener('dblclick', (e) => {
    if (!e.target.closest('.lights')) toggleMax(rec)
  })
  // перетаскивание за заголовок
  tb.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.lights') || mobile() || e.button !== 0) return
    const st = { x: e.clientX, y: e.clientY, l: el.offsetLeft, t: el.offsetTop }
    tb.setPointerCapture(e.pointerId)
    const move = (ev) => {
      const w = el.offsetWidth
      el.style.left = Math.max(80 - w, Math.min(innerWidth - 80, st.l + ev.clientX - st.x)) + 'px'
      el.style.top = Math.max(MB, Math.min(innerHeight - 60, st.t + ev.clientY - st.y)) + 'px'
    }
    const up = () => {
      tb.removeEventListener('pointermove', move)
      tb.removeEventListener('pointerup', up)
      tb.removeEventListener('pointercancel', up)
    }
    tb.addEventListener('pointermove', move)
    tb.addEventListener('pointerup', up)
    tb.addEventListener('pointercancel', up)
  })
  // растягивание за края и углы
  el.addEventListener('pointerdown', (e) => {
    const h = e.target.closest('[data-rz]')
    if (!h || mobile() || e.button !== 0) return
    e.preventDefault()
    const dir = h.dataset.rz
    const st = { x: e.clientX, y: e.clientY, l: el.offsetLeft, t: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight }
    const MINW = 360
    const MINH = 260
    h.setPointerCapture(e.pointerId)
    el.classList.add('resizing')
    const move = (ev) => {
      const dx = ev.clientX - st.x
      const dy = ev.clientY - st.y
      let { l, t, w, h: hh } = st
      if (dir.includes('e')) w = Math.max(MINW, Math.min(innerWidth - l - 4, st.w + dx))
      if (dir.includes('s')) hh = Math.max(MINH, Math.min(innerHeight - t - 4, st.h + dy))
      if (dir.includes('w')) {
        w = Math.max(MINW, st.w - dx)
        l = st.l + st.w - w
      }
      if (dir.includes('n')) {
        hh = Math.max(MINH, st.h - dy)
        t = Math.max(MB, st.t + st.h - hh)
        hh = st.t + st.h - t
      }
      Object.assign(el.style, { left: l + 'px', top: t + 'px', width: w + 'px', height: hh + 'px' })
    }
    const up = () => {
      el.classList.remove('resizing')
      h.removeEventListener('pointermove', move)
      h.removeEventListener('pointerup', up)
      h.removeEventListener('pointercancel', up)
      rec.prev = null
    }
    h.addEventListener('pointermove', move)
    h.addEventListener('pointerup', up)
    h.addEventListener('pointercancel', up)
  })
  // кнопки внутри окон, открывающие другие окна
  el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-open]')
    if (b) {
      e.preventDefault()
      open(b.dataset.open, b)
    }
  })
}

// ── содержимое: Работы ───────────────────────────────
function sideNav(cur) {
  const link = (k, label, g) =>
    `<button data-open="${k}" class="${k === cur ? 'cur' : ''}">${GLYPH[g]}${label}</button>`
  return `
    <aside class="side">
      <p>Избранное</p>
      ${link('works', 'Работы', 'works')}
      ${link('pipeline', 'Пайплайн', 'pipeline')}
      ${link('price', 'Прайс', 'price')}
      ${link('about', 'О нас', 'about')}
      ${link('calc', 'Калькулятор', 'calc')}
      ${link('brief', 'Бриф', 'pen')}
      <p>Связаться</p>
      <a href="${TG.misha}" target="_blank" rel="noopener">${GLYPH.user}Михаил</a>
      <a href="${TG.sofia}" target="_blank" rel="noopener">${GLYPH.user}София</a>
    </aside>`
}
const fileTile = (p) => `
  <button class="file" data-open="work/${p.id}" data-cat="${esc(p.category || '')}" data-q="${esc((p.title + ' ' + p.client + ' ' + (p.tags || []).join(' ')).toLowerCase())}">
    <span class="th"><img src="${encodeURI(p.thumb)}" alt="" loading="lazy" decoding="async" /></span>
    <b>${esc(p.title)}</b>
    ${meta(p) ? `<span>${esc(meta(p))}</span>` : ''}
  </button>`
// разделы папки «Работы» — значения поля category в projects.js
const CATS = ['Коммерция', 'Для соцсетей', 'Творческие', 'Артисты']
function renderWorks() {
  const cnt = (c) => projects.filter((p) => p.category === c).length
  return `
    <div class="fnd">
      ${sideNav('works')}
      <div class="fmain">
        <div class="ftool">
          <div class="chips" role="tablist" aria-label="Разделы">
            <button class="cur" data-cat="">Все <em>${projects.length}</em></button>
            ${CATS.filter(cnt).map((c) => `<button data-cat="${esc(c)}">${esc(c)} <em>${cnt(c)}</em></button>`).join('')}
          </div>
          <input type="search" placeholder="Поиск" aria-label="Поиск по работам" />
        </div>
        <div class="fgrid">${projects.map(fileTile).join('')}<p class="empty" hidden>Ничего не найдено</p></div>
      </div>
    </div>`
}
function mountWorks(el) {
  const q = el.querySelector('input')
  const files = [...el.querySelectorAll('.file')]
  let cat = ''
  const upd = () => {
    const s = q.value.trim().toLowerCase()
    let n = 0
    files.forEach((f) => {
      const ok = (!cat || f.dataset.cat === cat) && (!s || f.dataset.q.includes(s))
      f.hidden = !ok
      n += ok
    })
    el.querySelector('.empty').hidden = n > 0
  }
  q.addEventListener('input', upd)
  el.querySelector('.chips').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]')
    if (!b) return
    cat = b.dataset.cat
    el.querySelectorAll('.chips button').forEach((x) => x.classList.toggle('cur', x === b))
    upd()
  })
}
function plural(n) {
  const a = n % 10
  const b = n % 100
  if (a === 1 && b !== 11) return 'работа'
  if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return 'работы'
  return 'работ'
}

// ── содержимое: плеер ────────────────────────────────
const fmtDur = (s) => {
  const t = Math.round(s)
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
}
function renderPlayer(p) {
  const sec = (h, t) => (t ? `<h3>${h}</h3><p>${esc(t)}</p>` : '')
  const rows = [
    ['Клиент', p.commercial === false ? '' : p.client],
    ['Формат', p.vertical ? '9:16' : '16:9'],
    ['Хронометраж', p.duration ? fmtDur(p.duration) : ''],
    ...(p.facts || []),
  ].filter(([, v]) => v)
  return `
    <div class="pl">
      <div class="pl-v"><video controls playsinline preload="auto" src="${encodeURI(p.video)}"></video></div>
      <aside class="pl-i">
        <div class="in">
          <h2>${esc(p.title)}</h2>
          ${meta(p) ? `<p class="who">${esc(meta(p))}</p>` : ''}
          ${sec('О проекте', p.about)}
          ${sec('Задача', p.task)}
          ${sec('Решение', p.solution)}
          ${sec('Результат', p.result)}
          <dl>${rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
          ${p.tags?.length ? `<div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
        </div>
        <div class="pl-n">
          <button data-step="-1">← Предыдущая</button>
          <button data-step="1">Следующая →</button>
        </div>
      </aside>
    </div>`
}
function mountPlayer(el, p) {
  const v = el.querySelector('video')
  v.play().catch(() => {
    v.muted = true
    v.play().catch(() => {})
  })
  el.querySelector('.pl-n').addEventListener('click', (e) => {
    const b = e.target.closest('[data-step]')
    if (!b) return
    const i = projects.indexOf(p)
    const next = projects[(i + +b.dataset.step + projects.length) % projects.length]
    const rec = wins.get('work/' + p.id)
    if (!rec) return
    // переиспользуем это же окно
    wins.delete(rec.key)
    rec.key = 'work/' + next.id
    if (wins.has(rec.key)) {
      close(wins.get(rec.key))
    }
    wins.set(rec.key, rec)
    el.querySelector('.tt').textContent = next.title + '.mp4'
    el.setAttribute('aria-label', next.title)
    el.querySelector('.wb').innerHTML = renderPlayer(next)
    mountPlayer(el, next)
    setHash(rec.key)
  })
}

// ── содержимое: Пайплайн ─────────────────────────────
const STEPS = [
  ['Бриф и задача', 'Созваниваемся или переписываемся: какая цель у ролика, кто аудитория, где он будет показываться — соцсети, ТВ, наружка. Обсуждаем хронометраж, форматы, сроки и бюджет.', 'Короткое ТЗ, которое мы согласуем с вами'],
  ['Идея и сценарий', 'Предлагаем концепцию, пишем сценарий и закадровый текст, собираем мудборд — референсы по цвету, свету и стилю: реализм, мультфильм, 3D или микс с живой съёмкой.', 'Сценарий и мудборд'],
  ['Раскадровка и стиль', 'Разбиваем сценарий на кадры и генерируем ключевые изображения: персонажей, локации, продукт. Закрепляем внешность героев, чтобы они не «плыли» от кадра к кадру. Здесь же фиксируем количество кадров — по нему считается стоимость.', 'Раскадровка со стилфреймами'],
  ['Генерация и анимация', 'Оживляем утверждённые кадры: движение камеры, мимика, эффекты. Каждый кадр делаем в нескольких вариантах, выбираем лучший и дорабатываем артефакты. Если нужно — совмещаем с реальной съёмкой.', 'Готовые анимированные сцены'],
  ['Монтаж, звук и цвет', 'Собираем ролик, делаем цветокоррекцию, саунд-дизайн, подбираем музыку, добавляем озвучку и титры. Показываем черновую версию и вносим правки.', 'Финальный монтаж'],
  ['Сдача', 'Экспортируем ролик во всех нужных форматах для площадок: 16:9, 9:16, 1:1, с субтитрами и без.', 'Готовые файлы'],
]
// кадры для вкладки «Пайплайн» — id работ из projects.js
const PIPE_FRAMES = [
  ['meredith', 'ИИ-анимация поверх живой съёмки'],
  ['mnd-movie', 'Персонажи держат образ от кадра к кадру'],
  ['alien', 'Свет, цвет и эффекты — на этапе анимации'],
].filter(([id]) => byId[id])
const CTA = `
  <div class="cta">
    <h3>Обсудим ваш ролик?</h3>
    <p>Напишите в Telegram — ответим и предложим идею.</p>
    <div class="acts">
      <a class="btn" href="${TG.misha}" target="_blank" rel="noopener">Михаил — @mishanya_bok</a>
      <a class="btn ghost" href="${TG.sofia}" target="_blank" rel="noopener">София — @alienlale</a>
    </div>
  </div>`
function renderPipeline() {
  return `
    <div class="doc-pad">
      <p class="w-k">Пайплайн</p>
      <h2 class="w-h">Как мы делаем <i>ИИ-анимацию</i></h2>
      <p class="w-lead">Нейросети — это инструмент, а не кнопка «сделать красиво». За каждым роликом стоит режиссура: идея, сценарий, раскадровка, сотни генераций и ручная доводка. Вот как проходит работа — от первого сообщения до готового файла. Вы видите результат на каждом этапе и согласуете его, прежде чем мы двинемся дальше.</p>
      ${
        PIPE_FRAMES.length
          ? `<div class="frames">${PIPE_FRAMES.map(
              ([id, cap]) => `<button class="frame" data-open="work/${id}"><img src="${encodeURI(byId[id].thumb)}" alt="${esc(byId[id].title)}" loading="lazy" /><span>${esc(cap)}</span></button>`,
            ).join('')}</div>`
          : ''
      }
      <ol class="steps">
        ${STEPS.map(
          ([t, d, o], i) => `<li><span class="n">0${i + 1}</span><div><h3>${t}</h3><p>${d}</p><span class="out">На выходе: ${o}</span></div></li>`,
        ).join('')}
      </ol>
      ${CTA}
    </div>`
}

// ── содержимое: Прайс ────────────────────────────────
const PER_FRAME = 7000
const MIN = 15000
const rub = (n) => n.toLocaleString('ru-RU') + ' ₽'
function renderPrice() {
  return `
    <div class="doc-pad">
      <p class="w-k">Прайс</p>
      <h2 class="w-h">Прозрачно <i>и честно</i></h2>
      <p class="w-lead">Мы считаем по кадрам — вы понимаете, за что платите на каждом шаге.</p>
      <div class="tiers">
        <div class="tier"><span class="k">Старт</span><div class="price">от 15 000 ₽</div><p>Небольшие проекты, концептуальные визуалы, тестовые форматы — минимальный порог входа в работу со студией.</p></div>
        <div class="tier feat"><span class="k">Основная единица</span><div class="price">7 000 ₽<small>за готовый кадр</small></div><p>ИИ-генерация, обработка и анимация включены. Именно так мы считаем объём работ.</p></div>
        <div class="tier"><span class="k">Финальный расчёт</span><div class="price">Индивидуально</div><p>Финальная стоимость рассчитывается вместе с вами — после обсуждения задачи, без скрытых условий.</p></div>
      </div>
      <div class="promo">
        <span class="promo-ic">${ICON.calc()}</span>
        <div>
          <h3>Посчитайте свой проект</h3>
          <p>Введите количество готовых кадров в калькуляторе — он сразу покажет примерный бюджет.</p>
        </div>
        <button class="btn" data-open="calc">Открыть калькулятор</button>
      </div>
    </div>`
}

// ── содержимое: Калькулятор ──────────────────────────
function renderCalc() {
  const key = (k, cls = '', label = k) => `<button class="k ${cls}" data-k="${k}">${label}</button>`
  return `
    <div class="calcapp">
      <div class="cdisp">
        <span class="cl">Готовых кадров</span>
        <b class="cn">10</b>
        <span class="cs">${rub(10 * PER_FRAME)}</span>
        <span class="cx">10 × ${rub(PER_FRAME)}</span>
      </div>
      <div class="ckeys">
        ${key('C', 'fn')}${key('back', 'fn', '⌫')}${key('-', 'fn', '−1')}${key('+', 'fn', '+1')}
        ${key('7')}${key('8')}${key('9')}${key('p10', 'pre', '10')}
        ${key('4')}${key('5')}${key('6')}${key('p30', 'pre', '30')}
        ${key('1')}${key('2')}${key('3')}${key('p60', 'pre', '60')}
        ${key('0', 'wide')}${key('send', 'go', 'В Telegram')}
      </div>
      <p class="cnote">7 000 ₽ за готовый кадр — ИИ-генерация, обработка и анимация. Минимальный бюджет — 15 000 ₽. Это ориентир: точную сумму назовём после брифа.</p>
    </div>`
}
function mountCalc(el) {
  let v = '10'
  let fresh = true
  const show = () => {
    const n = +v || 0
    const sum = n ? Math.max(MIN, n * PER_FRAME) : 0
    el.querySelector('.cn').textContent = n
    el.querySelector('.cs').textContent = rub(sum)
    el.querySelector('.cx').textContent =
      n * PER_FRAME < MIN && n ? `${n} × ${rub(PER_FRAME)} → минимальный бюджет` : `${n} × ${rub(PER_FRAME)}`
  }
  const press = (k) => {
    if (/^\d$/.test(k)) {
      v = fresh || v === '0' ? k : (v + k).slice(0, 3)
      fresh = false
    } else if (k === 'C') v = '0'
    else if (k === 'back') v = v.slice(0, -1) || '0'
    else if (k === '+') v = String(Math.min(999, +v + 1))
    else if (k === '-') v = String(Math.max(0, +v - 1))
    else if (k.startsWith('p')) {
      v = k.slice(1)
      fresh = true
    } else if (k === 'send') {
      const n = +v || 0
      const text = `Здравствуйте! Хочу обсудить ИИ-ролик: примерно ${n} готовых кадров, ориентир по калькулятору — ${rub(n ? Math.max(MIN, n * PER_FRAME) : 0)}.`
      window.open(`${TG.misha}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
      return
    }
    show()
  }
  el.querySelector('.ckeys').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]')
    if (b) press(b.dataset.k)
  })
  el.addEventListener('keydown', (e) => {
    if (/^\d$/.test(e.key)) press(e.key)
    else if (e.key === 'Backspace') press('back')
    else if (e.key === '+' || e.key === '=') press('+')
    else if (e.key === '-') press('-')
    else return
    e.preventDefault()
  })
  el.tabIndex = -1
  el.focus({ preventScroll: true })
}

// ── содержимое: Бриф ─────────────────────────────────
const BRIEF = [
  ['name', 'Как вас зовут', 'input'],
  ['brand', 'Бренд или компания', 'input'],
  ['what', 'Что за ролик нужен', 'textarea', 'Реклама, клип, мультфильм, ролик для соцсетей… Пара слов об идее и задаче.'],
  ['fmt', 'Хронометраж и формат', 'input', 'Например: 30 сек, 9:16 для Reels'],
  ['when', 'Сроки', 'input'],
  ['budget', 'Бюджет', 'input', 'Можно примерно'],
]
function renderBrief() {
  return `
    <form class="brief doc-pad" autocomplete="on">
      <p class="w-k">Бриф</p>
      <h2 class="w-h">Расскажите <i>о проекте</i></h2>
      <p class="w-lead">Заполните то, что знаете, — остальное обсудим. Бриф откроется в Telegram готовым сообщением.</p>
      ${BRIEF.map(
        ([id, label, kind, ph = '']) => `
        <label class="bf">
          <span>${label}</span>
          ${kind === 'textarea' ? `<textarea name="${id}" rows="4" placeholder="${esc(ph)}"></textarea>` : `<input name="${id}" placeholder="${esc(ph)}" />`}
        </label>`,
      ).join('')}
      <div class="acts">
        <button class="btn" type="submit">Отправить в Telegram</button>
        <button class="btn ghost" type="button" data-copy>Скопировать</button>
      </div>
      <p class="note bf-ok" hidden>Скопировано</p>
    </form>`
}
function mountBrief(el) {
  const f = el.querySelector('form')
  const text = () => {
    const d = new FormData(f)
    const lines = BRIEF.map(([id, label]) => [label, String(d.get(id) || '').trim()])
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
    return ['Бриф для mnd.', ...lines].join('\n')
  }
  f.addEventListener('submit', (e) => {
    e.preventDefault()
    window.open(`${TG.misha}?text=${encodeURIComponent(text())}`, '_blank', 'noopener')
  })
  f.querySelector('[data-copy]').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text())
      const ok = f.querySelector('.bf-ok')
      ok.hidden = false
      setTimeout(() => (ok.hidden = true), 1600)
    } catch {}
  })
}

// ── содержимое: Корзина ──────────────────────────────
const JUNK = [
  ['Шаблонная_реклама_final_final2.mov', 'jv'],
  ['Сток_рукопожатие_в_офисе.mp4', 'jv'],
  ['Сделайте_как_у_конкурентов.docx', 'jd'],
  ['Логотип_покрупнее.psd', 'jd'],
]
function renderTrash() {
  return `
    <div class="trash">
      <div class="ftool"><span>Здесь лежит то, чего мы не делаем</span><button class="btn ghost tr-empty">Очистить корзину</button></div>
      <div class="junk">
        ${JUNK.map(([n, t]) => `<div class="jf ${t}"><span class="jic"></span><b>${esc(n)}</b></div>`).join('')}
      </div>
      <p class="tr-done" hidden>Корзина пуста. Как и шаблонные идеи в наших роликах.</p>
    </div>`
}
function mountTrash(el) {
  el.querySelector('.tr-empty').addEventListener('click', (e) => {
    e.currentTarget.disabled = true
    const files = [...el.querySelectorAll('.jf')]
    files.forEach((f, i) => setTimeout(() => f.classList.add('gone'), i * 120))
    setTimeout(() => {
      el.querySelector('.junk').hidden = true
      el.querySelector('.tr-done').hidden = false
    }, files.length * 120 + 350)
  })
}

// ── содержимое: О нас ────────────────────────────────
function renderAbout() {
  return `
    <div class="doc-pad">
      <p class="w-k">О нас</p>
      <h2 class="w-h">Два ума. <i>Одно видение.</i></h2>
      <p class="w-lead">mnd. — студия ИИ-анимации. Мы создаём кинематографичные визуалы для брендов, артистов и кампаний — с точностью бутиковой студии и гибкостью современной команды.</p>
      <div class="team">
        <div class="member">
          <p class="role">Монтажёр / руководитель продакшена</p>
          <h3>Михаил</h3>
          <p class="path">Образование бухгалтера и аудитора — но всю жизнь создавал видео.</p>
          <p class="desc">5 лет монтажа и владение пакетом Adobe + DaVinci Resolve. Работал с крупными блогерами. Теперь создаёт кинематографический визуал с помощью ИИ.</p>
          <a class="btn ghost" href="${TG.misha}" target="_blank" rel="noopener">@mishanya_bok</a>
        </div>
        <div class="member">
          <p class="role">ИИ-креатор / визуальный директор</p>
          <h3>София</h3>
          <p class="path">Образование логиста. Разочаровалась. Вела блог. Взяла в руки ИИ — и всё изменилось.</p>
          <p class="desc">Лицензированный ИИ-креатор. Отвечает за визуальную концепцию и общую эстетику. Создаёт видео для крупных коммерческих компаний.</p>
          <a class="btn ghost" href="${TG.sofia}" target="_blank" rel="noopener">@alienlale</a>
        </div>
      </div>
      <div class="stats">
        <div><b>10M+</b><span>зрителей</span><small>суммарный охват работ</small></div>
        <div><b>10</b><span>экранов Москвы</span><small>кампания Рольф</small></div>
        <div><b>${projects.length}</b><span>работ</span><small>в портфолио</small></div>
      </div>
      ${CTA}
    </div>`
}

// ── док ──────────────────────────────────────────────
const dock = $('#dock')
const DOCK_ITEMS = ['works', 'pipeline', 'price', 'calc', 'about']
dock.innerHTML =
  DOCK_ITEMS.map(
    (k) => `<button class="dk" data-k="${k}" aria-label="${APPS[k].title}"><span>${APPS[k].icon()}</span><span class="tip">${APPS[k].title}</span></button>`,
  ).join('') +
  `<span class="sep"></span><a class="dk" href="${TG.misha}" target="_blank" rel="noopener" aria-label="Написать в Telegram"><span>${ICON.app()}</span><span class="tip">Написать нам</span></a>`
const dks = [...dock.querySelectorAll('.dk')]
dock.addEventListener('click', (e) => {
  const b = e.target.closest('button.dk')
  if (!b) return
  if (!wins.has(b.dataset.k)) {
    b.classList.add('bounce')
    setTimeout(() => b.classList.remove('bounce'), 1000)
  }
  open(b.dataset.k, b)
})
function updateDock() {
  document.body.classList.toggle('has-win', !!topWin())
  dks.forEach((d) => d.dataset.k && d.classList.toggle('run', wins.has(d.dataset.k)))
}
// увеличение иконок под курсором
dock.addEventListener('mousemove', (e) => {
  dks.forEach((d) => {
    const r = d.getBoundingClientRect()
    const dist = Math.abs(e.clientX - (r.left + r.width / 2))
    const k = Math.max(0, 1 - dist / 140)
    d.style.transform = `scale(${1 + 0.42 * k}) translateY(${-6 * k}px)`
  })
})
dock.addEventListener('mouseleave', () => dks.forEach((d) => (d.style.transform = '')))

// ── строка меню ──────────────────────────────────────
$('#menubar').addEventListener('click', (e) => {
  const b = e.target.closest('[data-open]')
  if (b) open(b.dataset.open, b)
})
const clock = $('#clock')
const fmt = new Intl.DateTimeFormat('ru-RU', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
const tick = () => (clock.textContent = fmt.format(new Date()).replace(',', ''))
tick()
setInterval(tick, 15000)

// ── клавиатура и адрес ───────────────────────────────
addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const t = topWin()
    if (t) close(t)
  }
})
function openFromHash() {
  const k = decodeURIComponent(location.hash.slice(1))
  if (k && !wins.has(k)) open(k)
}
addEventListener('hashchange', openFromHash)
addEventListener('resize', placeItems)
placeItems()
openFromHash()
