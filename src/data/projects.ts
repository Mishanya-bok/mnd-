export interface Project {
  id: string
  title: string
  category: string
  year: string
  description: string
  videoSrc: string
  tags: string[]
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: 'alien',
    title: 'Alien',
    category: 'Cinematic',
    year: '2025',
    description:
      'A full-scale cinematic AI piece exploring the boundary between the familiar and the unknown. Built frame by frame with precise visual direction.',
    videoSrc: '/videos/alien.webm',
    tags: ['AI Generated', 'Cinematic', 'Concept Visual'],
    featured: true,
  },
  {
    id: 'rolf',
    title: 'Rolf × Red Car',
    category: 'Commercial',
    year: '2025',
    description:
      'Commercial visual for Rolf automotive. Motion and visual language developed for a high-reach branded campaign.',
    videoSrc: '/videos/rolf.webm',
    tags: ['Commercial', 'Automotive', 'Branded Content'],
    featured: true,
  },
  {
    id: 'fashion-fragment',
    title: 'Fashion Fragment',
    category: 'Fashion Visual',
    year: '2026',
    description:
      'An AI-driven fashion visual study. Movement, texture, and light treated as primary material.',
    videoSrc: '/videos/ai-1.webm',
    tags: ['AI Generated', 'Fashion', 'Visual Study'],
    featured: true,
  },
  {
    id: 'ai-study',
    title: 'AI Study 02',
    category: 'Concept Visual',
    year: '2026',
    description:
      'Experimental generative visual — a controlled exploration of form and motion through AI production.',
    videoSrc: '/videos/ai-2.webm',
    tags: ['AI Generated', 'Experimental', 'Concept'],
    featured: true,
  },
]
