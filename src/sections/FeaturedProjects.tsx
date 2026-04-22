import { useState } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from '@components/ProjectCard'
import VideoModal from '@components/VideoModal'
import { projects } from '@data/projects'
import type { Project } from '@data/projects'
import { stagger, fadeUp } from '@lib/motion'

export default function FeaturedProjects() {
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  const rest = projects.slice(1)
  // Pair up remaining projects for row dividers
  const rows: Project[][] = []
  for (let i = 0; i < rest.length; i += 2) {
    rows.push(rest.slice(i, i + 2))
  }

  return (
    <>
      <section id="projects" className="section-gap container-x">
        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <motion.p variants={fadeUp} className="label mb-3">
              Избранное
            </motion.p>
            <div className="overflow-hidden">
              <motion.h2
                variants={{ hidden: { y: '105%' }, visible: { y: '0%', transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] } } }}
                className="font-display text-display italic font-light"
              >
                Наши работы
              </motion.h2>
            </div>
          </div>
          <motion.p
            variants={fadeUp}
            className="text-sm text-[var(--color-muted)] font-light max-w-xs leading-relaxed"
          >
            Коммерческие ролики, концептуальные и редакционные визуалы — каждый создан под точное визуальное задание.
          </motion.p>
        </motion.div>

        {/* Projects grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6"
        >
          {/* Project 0 — full width hero card */}
          <div className="md:col-span-2 mb-2">
            <ProjectCard project={projects[0]} index={0} onClick={setActiveProject} />
          </div>

          {/* Divider after hero */}
          <motion.div
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
            className="md:col-span-2 h-px bg-[var(--color-border)] mb-2 origin-left"
          />

          {/* Remaining projects in rows of 2 */}
          {rows.map((row, rowIndex) => (
            <>
              {row.map((project, colIndex) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={rowIndex * 2 + colIndex + 1}
                  onClick={setActiveProject}
                />
              ))}
              {rowIndex < rows.length - 1 && (
                <motion.div
                  key={`divider-${rowIndex}`}
                  variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
                  className="md:col-span-2 h-px bg-[var(--color-border)] mt-2 mb-2 origin-left"
                />
              )}
            </>
          ))}
        </motion.div>
      </section>

      <VideoModal project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  )
}
