/**
 * Resolve a public asset path against the app's base URL so it works both at
 * the domain root (Vercel/Netlify) and under a subpath (GitHub Pages: /mnd-/).
 */
export const asset = (p: string) => import.meta.env.BASE_URL + p.replace(/^\//, '')
