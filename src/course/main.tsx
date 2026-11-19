import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/globals.css'
import CourseApp from './CourseApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CourseApp />
  </StrictMode>,
)
