import { contacts } from '@data/site'

export default function MobileCTA() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-2 border-t border-[color:var(--color-line)] bg-[color:var(--color-crimson-2)]/95 backdrop-blur">
      <a href="#contact" className="text-center u-label-sm py-4 border-r border-[color:var(--color-line)]">
        Обсудить проект
      </a>
      <a
        href={`https://t.me/${contacts.mikhail.telegram.replace('@', '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-center u-label-sm py-4"
      >
        Написать в Telegram
      </a>
    </div>
  )
}
