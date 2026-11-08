// mnd. — Cover Flow из видеокассет (vanilla JS, без библиотек)
import { projects } from './data/projects.js'

const N = projects.length
const ANG = 72
const GAP = 0.62
const STEP = 0.25
const DEPTH = 0.42
const LIFT = 0.55
const FLIP_MS = 620

const $ = (s, r = document) => r.querySelector(s)
const flow = $('#flow')
const root = document.documentElement
const pad = (n) => String(n).padStart(2, '0')
const fmt = (s) => {
  if (!isFinite(s) || s < 0) s = 0
  const m = Math.floor(s / 60)
  return `${m}:${pad(Math.floor(s % 60))}`
}
const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

// ── состояние ────────────────────────────────────────
let W = 0
let H = 0
let pos = Math.min(3, N - 1)
let target = pos
let flipped = -1
let flipK = 0
let flipDir = 0
let hi = 0
let last = performance.now()

// ── разметка кассеты ─────────────────────────────────
const cassette = (p, i) => `
  <div class="vhs">
    <div class="vhs-label">
      <div class="vhs-img"><img src="${encodeURI(p.thumb)}" alt="" decoding="async" draggable="false" /></div>
      <div class="vhs-strip"><b>mnd.</b><span>${esc(p.title)}</span><em>${pad(i + 1)}</em></div>
    </div>
    <div class="vhs-win">
      <div class="reel l"><i></i></div>
      <div class="vhs-tape"></div>
      <div class="reel r2"><i></i></div>
    </div>
  </div>`

const covers = projects.map((p, i) => {
  const el = document.createElement('div')
  el.className = 'cv'
  el.dataset.i = i
  el.setAttribute('role', 'option')
  el.setAttribute('aria-label', `${pad(i + 1)}. ${p.title} — ${p.client}`)
  el.innerHTML = `
    <div class="fc bt"></div>
    <div class="fc tp"><b>mnd. · ${esc(p.title)}</b></div>
    <div class="fc bm"></div>
    <div class="fc sl"></div>
    <div class="fc sr"></div>
    <div class="f">${cassette(p, i)}</div>
    <div class="r" aria-hidden="true">${cassette(p, i)}</div>
    <div class="bk"></div>`
  flow.appendChild(el)
  return el
})

// ── обратная сторона: карточка проекта ───────────────
let backVid = null
function buildBack(i) {
  const p = projects[i]
  const bk = covers[i].querySelector('.bk')
  const rows = [
    ['Клиент', p.client],
    ['Год', p.year],
    ['Формат', p.vertical ? 'Вертикальный 9:16' : 'Горизонтальный 16:9'],
    ...(p.facts || []),
  ].filter(([, v]) => v)
  const section = (h, t) => (t ? `<h3>${h}</h3><p>${esc(t)}</p>` : '')
  hi = 0
  bk.innerHTML = `
    <div class="hd">
      <h2>${esc(p.title)}</h2>
      <p>${esc(p.client)} — ${esc(p.year)}</p>
      <button class="x" data-act="close" aria-label="Закрыть карточку">✕</button>
    </div>
    <div class="bd">
      <div class="media">
        <video muted loop playsinline preload="auto" src="${encodeURI(p.video)}"></video>
        <button class="watch" data-act="watch">▶ Смотреть со звуком</button>
      </div>
      <div class="info">
        <div class="txt">
          ${section('О проекте', p.about)}
          ${section('Задача', p.task)}
          ${section('Решение', p.solution)}
          ${section('Результат', p.result)}
        </div>
        ${p.tags?.length ? `<div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
        <ul>${rows.map(([k, v], n) => `<li class="${n === hi ? 'hi' : ''}"><span>${esc(k)}</span><span>${esc(v)}</span></li>`).join('')}</ul>
      </div>
    </div>`
  bk.classList.toggle('stack', stacked)
  backVid = bk.querySelector('video')
  backVid.play().catch(() => {})
}

function moveHi(dir) {
  if (flipped < 0) return
  const lis = covers[flipped].querySelectorAll('.bk li')
  if (!lis.length) return
  lis[hi]?.classList.remove('hi')
  hi = (hi + dir + lis.length) % lis.length
  lis[hi].classList.add('hi')
  lis[hi].scrollIntoView({ block: 'nearest' })
}

function openFlip(i) {
  if (flipped >= 0 && flipped !== i) closeFlip(true)
  flipped = i
  covers[i].classList.add('flip')
  document.body.classList.add('flipped')
  buildBack(i)
  flipDir = 1
}
function closeFlip(instant = false) {
  if (flipped < 0) return
  if (instant) {
    finishClose()
    return
  }
  flipDir = -1
}
function finishClose() {
  const el = covers[flipped]
  if (el) {
    el.classList.remove('flip')
    el.querySelector('.bk').innerHTML = ''
  }
  backVid = null
  flipped = -1
  flipK = 0
  flipDir = 0
  document.body.classList.remove('flipped')
}

// ── размеры ──────────────────────────────────────────
let stacked = false
function layout() {
  const iw = innerWidth
  const ih = innerHeight
  const narrow = iw <= 820
  W = Math.round(Math.min(ih * 0.44, iw * (narrow ? 0.7 : 0.34), 520))
  H = Math.round(W * 0.58)
  root.style.setProperty('--w', W + 'px')
  root.style.setProperty('--h', H + 'px')
  root.style.setProperty('--d', Math.round(W * 0.14) + 'px') // толщина кассеты

  const r = flow.getBoundingClientRect()
  const cy = r.top + r.height / 2
  const letterY = cy + H / 2 + W * 0.16
  root.style.setProperty('--floor-y', cy + H / 2 + 2 + 'px')
  root.style.setProperty('--letter-y', letterY + 'px')

  // карточка проекта: вписываем в экран с учётом «подъёма» к зрителю
  const L = 3.4 / (3.4 - LIFT)
  // сверху — край экрана (на мобильном — подпись), снизу — полоса прогресса (на мобильном — меню)
  const npY = letterY + W * 0.15 + 14
  const topLim = narrow ? 150 : 14
  const botLim = narrow ? ih - 84 : npY + 50
  const maxH = (2 * Math.min(cy - topLim, botLim - cy)) / L
  root.style.setProperty('--np-y', npY + 'px')
  stacked = iw < 700 || iw / ih < 1
  let bw, bh
  if (stacked) {
    bw = Math.min((iw * 0.94) / L, 460)
    bh = Math.min(bw * 1.55, maxH)
  } else {
    bw = Math.min(W * 2, (iw * 0.84) / L, 980)
    bh = Math.min(bw * 0.58, maxH)
  }
  root.style.setProperty('--bw', Math.round(bw) + 'px')
  root.style.setProperty('--bh', Math.round(bh) + 'px')
  root.style.setProperty('--bfs', Math.max(11.5, Math.min(15.5, bw * (stacked ? 0.032 : 0.0185))).toFixed(1) + 'px')
  if (flipped >= 0) covers[flipped].querySelector('.bk').classList.toggle('stack', stacked)
}

// ── рендер кадра ─────────────────────────────────────
const easeIO = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
let centre = -1

function render() {
  for (let i = 0; i < N; i++) {
    const el = covers[i]
    const d = i - pos
    const a = Math.abs(d)
    const s = Math.sign(d)
    if (a > 9 && i !== flipped) {
      el.style.visibility = 'hidden'
      continue
    }
    el.style.visibility = ''
    let x, rot, z
    if (a < 1) {
      x = d * GAP
      rot = -d * ANG
      z = -a * DEPTH
    } else {
      x = s * (GAP + (a - 1) * STEP)
      rot = -s * ANG
      z = -DEPTH
    }
    let extra = ''
    let zi = 500 - Math.round(a * 10)
    if (i === flipped) {
      const e = easeIO(flipK)
      z += Math.sin((Math.min(1, flipK * 1.4) * Math.PI) / 2) * LIFT
      extra = ` rotateY(${e * 180}deg)`
      zi = 999
    }
    el.style.transform = `translate3d(${x * W}px,0,${z * W}px) rotateY(${rot}deg)${extra}`
    el.style.zIndex = zi
  }
  const c = Math.max(0, Math.min(N - 1, Math.round(target)))
  if (c !== centre) setCentre(c)
}

function tick(now) {
  const dt = Math.min(0.05, (now - last) / 1000)
  last = now
  if (!dragging) {
    pos += (target - pos) * (1 - Math.exp(-dt * 13))
    if (Math.abs(target - pos) < 0.0005) pos = target
  }
  if (flipDir) {
    flipK += (flipDir * dt * 1000) / FLIP_MS
    if (flipK >= 1) {
      flipK = 1
      flipDir = 0
    }
    if (flipK <= 0) finishClose()
  }
  render()
  updateNP()
  requestAnimationFrame(tick)
}

// ── центр: подписи, номер, свечение, превью ──────────
const letter = $('#letter')
const npT = $('.np-t')
const npA = $('.np-a')
const npCur = $('.np-cur')
const npDur = $('.np-dur')
const npFill = $('.np-fill')
const npKnob = $('.np-knob')
const glowColors = []

function setCentre(c) {
  if (centre >= 0) covers[centre].classList.remove('on')
  centre = c
  covers[c].classList.add('on')
  covers.forEach((el, i) => el.setAttribute('aria-selected', i === c))
  const p = projects[c]
  letter.textContent = pad(c + 1)
  npT.textContent = p.title
  npA.textContent = `${p.client} · ${p.year}`
  if (glowColors[c]) root.style.setProperty('--glow', glowColors[c])
}

function updateNP() {
  const v = flipped >= 0 ? backVid : null
  const dur = v && isFinite(v.duration) ? v.duration : 0
  const cur = v ? v.currentTime : 0
  const k = dur ? Math.min(1, cur / dur) : 0
  npCur.textContent = fmt(cur)
  npDur.textContent = fmt(dur)
  npFill.style.width = k * 100 + '%'
  npKnob.style.left = k * 100 + '%'
}

function go(t) {
  target = Math.max(0, Math.min(N - 1, t))
}

// ── ввод: колесо ─────────────────────────────────────
let acc = 0
flow.addEventListener(
  'wheel',
  (e) => {
    if (flipped >= 0 && e.target.closest('.bk .info')) return // скролл текста карточки
    e.preventDefault()
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    if (flipped >= 0) {
      acc += d
      while (Math.abs(acc) >= 60) {
        moveHi(Math.sign(acc))
        acc -= Math.sign(acc) * 60
      }
      return
    }
    acc += d
    while (Math.abs(acc) >= 60) {
      go(Math.round(target) + Math.sign(acc))
      acc -= Math.sign(acc) * 60
    }
  },
  { passive: false },
)

// ── ввод: перетаскивание / клик ──────────────────────
let dragging = false
let down = null
flow.addEventListener('pointerdown', (e) => {
  if (e.button !== 0) return
  if (e.target.closest('.bk')) return // клики внутри карточки — свои
  const cv = e.target.closest('.cv')
  down = { x: e.clientX, p0: pos, cover: cv ? +cv.dataset.i : -1, t: performance.now(), lastX: e.clientX, v: 0, id: e.pointerId }
  flow.setPointerCapture(e.pointerId)
})
flow.addEventListener('pointermove', (e) => {
  if (!down || e.pointerId !== down.id) return
  const dx = e.clientX - down.x
  if (!dragging && Math.abs(dx) > 4) {
    dragging = true
    flow.classList.add('drag')
    closeFlip()
  }
  if (!dragging) return
  const now = performance.now()
  const dt = Math.max(1, now - down.t)
  const np = Math.max(-0.4, Math.min(N - 0.6, down.p0 - dx / (W * STEP * 2.2)))
  down.v = 0.8 * down.v + 0.2 * (((np - pos) / dt) * 1000)
  down.t = now
  pos = np
})
const endDrag = (e) => {
  if (!down || e.pointerId !== down.id) return
  if (dragging) {
    target = Math.max(0, Math.min(N - 1, Math.round(pos + down.v * 0.18)))
    dragging = false
    flow.classList.remove('drag')
  } else if (e.type === 'pointerup') {
    clickCover(down.cover)
  }
  down = null
}
flow.addEventListener('pointerup', endDrag)
flow.addEventListener('pointercancel', endDrag)

function clickCover(i) {
  if (i < 0) {
    closeFlip()
    return
  }
  if (flipped >= 0) {
    if (i !== flipped) {
      closeFlip()
      go(i)
    }
    return
  }
  if (i === Math.round(target)) openFlip(i)
  else go(i)
}

// клики внутри карточки
flow.addEventListener('click', (e) => {
  const act = e.target.closest('[data-act]')?.dataset.act
  if (act === 'close') closeFlip()
  if (act === 'watch') openPlayer(flipped)
  const li = e.target.closest('.bk li')
  if (li) {
    const lis = [...li.parentNode.children]
    lis[hi]?.classList.remove('hi')
    hi = lis.indexOf(li)
    li.classList.add('hi')
  }
})

// ── клавиатура ───────────────────────────────────────
addEventListener('keydown', (e) => {
  if (player.open) return
  switch (e.key) {
    case 'ArrowLeft':
      closeFlip()
      go(Math.round(target) - 1)
      break
    case 'ArrowRight':
      closeFlip()
      go(Math.round(target) + 1)
      break
    case 'ArrowUp':
      if (flipped >= 0) (moveHi(-1), e.preventDefault())
      break
    case 'ArrowDown':
      if (flipped >= 0) (moveHi(1), e.preventDefault())
      break
    case 'Enter':
      if (e.target.closest?.('button, a')) return
      if (flipped >= 0) openPlayer(flipped)
      else openFlip(Math.round(target))
      break
    case 'Escape':
      closeFlip()
      break
    default:
      return
  }
})

// ── полноэкранный плеер ──────────────────────────────
const player = $('#player')
const plVid = player.querySelector('video')
function openPlayer(i) {
  if (i < 0) return
  const p = projects[i]
  backVid?.pause()
  plVid.src = encodeURI(p.video)
  plVid.muted = false
  player.querySelector('.pl-cap').textContent = `${pad(i + 1)} · ${p.title} — ${p.client}, ${p.year}`
  player.showModal()
  plVid.play().catch(() => {})
}
player.addEventListener('close', () => {
  plVid.pause()
  plVid.removeAttribute('src')
  plVid.load()
  backVid?.play().catch(() => {})
})
player.querySelector('.pl-close').addEventListener('click', () => player.close())
player.addEventListener('click', (e) => {
  if (e.target === player) player.close()
})

// ── свечение: средний цвет обложки ───────────────────
function sampleGlow() {
  const cv = document.createElement('canvas')
  cv.width = cv.height = 8
  const ctx = cv.getContext('2d', { willReadFrequently: true })
  projects.forEach((p, i) => {
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, 8, 8)
      const d = ctx.getImageData(0, 0, 8, 8).data
      let r = 0
      let g = 0
      let b = 0
      for (let k = 0; k < d.length; k += 4) {
        r += d[k]
        g += d[k + 1]
        b += d[k + 2]
      }
      r /= 64
      g /= 64
      b /= 64
      const gain = Math.min(2.2, 190 / Math.max(1, r, g, b))
      glowColors[i] = [r, g, b].map((v) => Math.round(Math.min(255, v * gain))).join(',')
      if (i === centre) root.style.setProperty('--glow', glowColors[i])
    }
    img.src = encodeURI(p.thumb)
  })
}

// ── старт ────────────────────────────────────────────
addEventListener('resize', layout)
layout()
sampleGlow()
render()
requestAnimationFrame((t) => {
  last = t
  tick(t)
})
