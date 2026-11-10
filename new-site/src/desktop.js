// mnd. — главный экран в виде рабочего стола: папки, файлы, окна и док
import { projects } from './data/projects.js'

const $ = (s, r = document) => r.querySelector(s)
const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const byId = Object.fromEntries(projects.map((p) => [p.id, p]))
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
  user: svg('<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.8 3.6-6 7-6s6.2 2.2 7 6"/>'),
}
const ICON = {
  folder: (g) => `<span class="folder"><i></i>${GLYPH[g] || ''}</span>`,
  doc: () => `<span class="doc"><b>₽</b><s></s></span>`,
  film: (p) => `<span class="film"><img src="${encodeURI(p.thumb)}" alt="" draggable="false" decoding="async" /><em>MP4</em></span>`,
  app: () => `<span class="app">${GLYPH.plane}</span>`,
}

// ── «приложения» (окна) ──────────────────────────────
const APPS = {
  works: { title: 'Работы', icon: () => ICON.folder('works'), size: [900, 600], render: renderWorks, mount: mountWorks },
  pipeline: { title: 'Пайплайн', icon: () => ICON.folder('pipeline'), size: [700, 660], render: renderPipeline },
  price: { title: 'Прайс', icon: () => ICON.doc(), size: [800, 680], render: renderPrice, mount: mountPrice },
  about: { title: 'О нас', icon: () => ICON.folder('about'), size: [800, 680], render: renderAbout },
}

// ── рабочий стол ─────────────────────────────────────
// позиции — доли ширины/высоты стола (иконки можно перетаскивать, раскладка запоминается)
// файлы прямо на рабочем столе: отмеченные featured: true, иначе — первые подходящие из списка
const FEATURED = (projects.some((p) => p.featured)
  ? projects.filter((p) => p.featured).map((p) => p.id)
  : ['mnd-movie', 'fresh-rostov', 'alien', 'rolf-red-machine', 'angel-kiss', 'basta', 'feastables', 'ny-pogodi'].filter((id) => byId[id])
).slice(0, 5)
const FEAT_POS = [
  [0.24, 0.04],
  [0.68, 0.07],
  [0.17, 0.86],
  [0.64, 0.92],
  [0.8, 0.7],
]
const ITEMS = [
  { key: 'works', open: 'works', label: 'Работы', icon: APPS.works.icon(), pos: [0.03, 0.03] },
  { key: 'pipeline', open: 'pipeline', label: 'Пайплайн', icon: APPS.pipeline.icon(), pos: [0.03, 0.27] },
  { key: 'price', open: 'price', label: 'Прайс.pdf', icon: APPS.price.icon(), pos: [0.93, 0.05] },
  { key: 'about', open: 'about', label: 'О нас', icon: APPS.about.icon(), pos: [0.93, 0.3] },
  { key: 'tg', href: TG.misha, label: 'Написать нам', icon: ICON.app(), pos: [0.03, 0.52] },
  ...FEATURED.map((id, n) => ({
    key: 'v-' + id,
    open: 'work/' + id,
    label: byId[id].title + '.mp4',
    icon: ICON.film(byId[id]),
    pos: FEAT_POS[n],
  })),
]

const desk = $('#desk')
const STORE = 'mnd-desk-v2'
let saved = {}
try {
  saved = JSON.parse(localStorage.getItem(STORE) || '{}')
} catch {}

const itemEls = ITEMS.map((it, n) => {
  const el = document.createElement(it.href ? 'a' : 'button')
  el.className = 'item'
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

function placeItems() {
  if (mobile()) {
    itemEls.forEach((el) => {
      el.style.left = el.style.top = ''
    })
    return
  }
  const r = desk.getBoundingClientRect()
  const W = r.width - 110
  const H = r.height - 230 // оставляем место под док
  ITEMS.forEach((it, i) => {
    const [fx, fy] = saved[it.key] || it.pos
    itemEls[i].style.left = Math.round(fx * W + 4) + 'px'
    itemEls[i].style.top = Math.round(fy * H + 8) + 'px'
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
  if (!el || mobile() || e.button !== 0) return
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
    el.style.left = Math.max(0, Math.min(d.width - 104, st.l + dx)) + 'px'
    el.style.top = Math.max(0, Math.min(d.height - 110, st.t + dy)) + 'px'
  }
  const up = () => {
    el.removeEventListener('pointermove', move)
    el.removeEventListener('pointerup', up)
    el.removeEventListener('pointercancel', up)
    el.classList.remove('drag')
    if (st.moved) {
      el.dataset.dragged = '1'
      const W = d.width - 110
      const H = d.height - 230
      saved[el.dataset.key] = [(parseFloat(el.style.left) - 4) / W, (parseFloat(el.style.top) - 8) / H]
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
    <div class="wb">${app.render()}</div>`
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
      <p>Связаться</p>
      <a href="${TG.misha}" target="_blank" rel="noopener">${GLYPH.user}Михаил</a>
      <a href="${TG.sofia}" target="_blank" rel="noopener">${GLYPH.user}София</a>
    </aside>`
}
const fileTile = (p) => `
  <button class="file" data-open="work/${p.id}" data-q="${esc((p.title + ' ' + p.client + ' ' + (p.tags || []).join(' ')).toLowerCase())}">
    <span class="th"><img src="${encodeURI(p.thumb)}" alt="" loading="lazy" decoding="async" /></span>
    <b>${esc(p.title)}</b>
    <span>${esc(p.client)} · ${esc(p.year)}</span>
  </button>`
function renderWorks() {
  return `
    <div class="fnd">
      ${sideNav('works')}
      <div class="fmain">
        <div class="ftool"><span class="cnt">${projects.length} ${plural(projects.length)}</span><input type="search" placeholder="Поиск по работам" aria-label="Поиск по работам" /></div>
        <div class="fgrid">${projects.map(fileTile).join('')}<p class="empty" hidden>Ничего не найдено</p></div>
      </div>
    </div>`
}
function mountWorks(el) {
  const q = el.querySelector('input')
  const files = [...el.querySelectorAll('.file')]
  const cnt = el.querySelector('.cnt')
  q.addEventListener('input', () => {
    const s = q.value.trim().toLowerCase()
    let n = 0
    files.forEach((f) => {
      const ok = !s || f.dataset.q.includes(s)
      f.hidden = !ok
      n += ok
    })
    cnt.textContent = `${n} ${plural(n)}`
    el.querySelector('.empty').hidden = n > 0
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
    ['Клиент', p.client],
    ['Год', p.year],
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
          <p class="who">${esc(p.client)} · ${esc(p.year)}</p>
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
  ['Бриф', 'Выясняем видение, аудиторию, формат и цели. Без шаблонов — каждый проект начинается с намерения.', 'Задача, формат, хронометраж и сроки'],
  ['Концепция', 'Визуальные референсы, настроение и структура нарратива. Эстетика фиксируется до начала продакшена.', 'Идея, мудборд и сценарий'],
  ['Раскадровка и ключевые кадры', 'Разбиваем ролик на кадры и генерируем ключевые изображения: персонажей, локации, свет. Стоимость считаем по количеству готовых кадров.', 'Раскадровка и стилфреймы'],
  ['Анимация', 'ИИ-генерация движения, композитинг, доработка. Каждый кадр проверяется на соответствие визуальному брифу.', 'Анимированные сцены'],
  ['Монтаж и сдача', 'Финальная сборка, цветокоррекция, звуковой дизайн, экспорт в нужных форматах. Полировка до результата.', 'Готовый ролик в нужных форматах'],
]
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
      <p class="w-lead">Каждый проект проходит один и тот же путь — от идеи до финальной сборки. Вы видите результат на каждом шаге и согласуете его, прежде чем мы двинемся дальше.</p>
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
      <div class="calc">
        <div>
          <h3>Прикиньте бюджет</h3>
          <label for="frames">Готовых кадров <output>10</output></label>
          <input id="frames" type="range" min="1" max="60" value="10" />
          <p class="note">Ориентир, а не оферта: точную сумму назовём после брифа.</p>
        </div>
        <div>
          <p class="note" style="margin-top:0">Примерная стоимость</p>
          <div class="sum">${rub(10 * PER_FRAME)}</div>
          <p class="note calc-x">10 × ${rub(PER_FRAME)}</p>
          <a class="btn" href="${TG.misha}" target="_blank" rel="noopener">Обсудить проект</a>
        </div>
      </div>
    </div>`
}
function mountPrice(el) {
  const r = el.querySelector('#frames')
  const upd = () => {
    const n = +r.value
    el.querySelector('output').textContent = n
    el.querySelector('.sum').textContent = rub(Math.max(MIN, n * PER_FRAME))
    el.querySelector('.calc-x').textContent =
      `${n} × ${rub(PER_FRAME)}${n * PER_FRAME < MIN ? ' — меньше минимального бюджета' : ''}`
  }
  r.addEventListener('input', upd)
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
const DOCK_ITEMS = ['works', 'pipeline', 'price', 'about']
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
