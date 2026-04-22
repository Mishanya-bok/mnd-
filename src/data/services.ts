export interface Service {
  id: string
  title: string
  description: string
}

export const services: Service[] = [
  {
    id: 'ai-commercials',
    title: 'AI Commercials',
    description: 'Brand films and product visuals built with AI generation and production-grade finishing.',
  },
  {
    id: 'fashion-beauty',
    title: 'Fashion & Beauty',
    description: 'Editorial and campaign visuals for fashion, beauty, and luxury brands.',
  },
  {
    id: 'branded-social',
    title: 'Branded Social Content',
    description: 'Short-form visual content designed for performance across social platforms.',
  },
  {
    id: 'music-videos',
    title: 'Music & Image Videos',
    description: 'Artistic visuals for artists, labels, and personal brand campaigns.',
  },
  {
    id: 'concept-visuals',
    title: 'Concept Visuals',
    description: 'Generative and directorial concept pieces for pitches, launches, and campaigns.',
  },
  {
    id: 'campaign-creative',
    title: 'Campaign Creative',
    description: 'Full visual direction and execution for multi-format campaign rollouts.',
  },
]
