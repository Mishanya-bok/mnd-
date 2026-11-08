// Внутренние страницы: появление блоков и калькулятор на странице «Прайс»
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in')
        io.unobserve(e.target)
      }
    }),
  { threshold: 0.12 },
)
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`
  io.observe(el)
})

// калькулятор: 7 000 ₽ за готовый кадр, минимальный бюджет 15 000 ₽
const range = document.querySelector('#frames')
if (range) {
  const PER_FRAME = 7000
  const MIN = 15000
  const out = document.querySelector('#frames-out')
  const sum = document.querySelector('#sum')
  const sec = document.querySelector('#secs')
  const rub = (n) => n.toLocaleString('ru-RU') + ' ₽'
  const upd = () => {
    const n = +range.value
    out.textContent = n
    sum.textContent = rub(Math.max(MIN, n * PER_FRAME))
    sec.textContent = `${n} × ${rub(PER_FRAME)}${n * PER_FRAME < MIN ? ' — меньше минимального бюджета' : ''}`
  }
  range.addEventListener('input', upd)
  upd()
}
