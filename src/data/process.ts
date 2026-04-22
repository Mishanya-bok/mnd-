export interface ProcessStep {
  number: string
  title: string
  description: string
}

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Brief',
    description: 'We align on vision, audience, format, and goals. No templates — every project starts from intent.',
  },
  {
    number: '02',
    title: 'Concept',
    description: 'Visual references, mood direction, and narrative structure. The aesthetic is locked before production begins.',
  },
  {
    number: '03',
    title: 'Scene Development',
    description: 'AI generation, compositing, refinement. Each frame is reviewed against the visual brief.',
  },
  {
    number: '04',
    title: 'Edit & Delivery',
    description: 'Final assembly, color, sound design, format-ready export. Polished output, on time.',
  },
]
