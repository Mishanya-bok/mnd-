export interface Service {
  id: string
  title: string
  description: string
}

export const services: Service[] = [
  {
    id: 'ai-commercials',
    title: 'AI Ролики',
    description: 'Брендовые фильмы и продуктовые визуалы с AI-генерацией и финишингом уровня продакшена.',
  },
  {
    id: 'fashion-beauty',
    title: 'Фэшн и Бьюти',
    description: 'Редакционные и кампейн-визуалы для фэшн, бьюти и люксовых брендов.',
  },
  {
    id: 'branded-social',
    title: 'Брендовый контент',
    description: 'Короткометражный визуальный контент, оптимизированный для социальных платформ.',
  },
  {
    id: 'music-videos',
    title: 'Клипы и имиджевое видео',
    description: 'Авторские визуалы для артистов, лейблов и персональных брендовых кампаний.',
  },
  {
    id: 'concept-visuals',
    title: 'Концептуальные визуалы',
    description: 'Генеративные и режиссёрские концепции для питчей, запусков и кампаний.',
  },
  {
    id: 'campaign-creative',
    title: 'Кампейн Криэйтив',
    description: 'Полная визуальная режиссура и реализация мультиформатных рекламных кампаний.',
  },
]
