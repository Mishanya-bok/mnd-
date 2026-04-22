import { useEffect, useRef } from 'react'

export function useVideoAutoplay(threshold = 0.4) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.muted = true
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        })
      },
      { threshold }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [threshold])

  return videoRef
}

export function useLazyVideo(threshold = 0.1) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const loadedRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loadedRef.current) {
            loadedRef.current = true
            const src = video.dataset.src
            if (src) {
              video.src = src
              video.muted = true
              video.play().catch(() => {})
            }
            observer.disconnect()
          }
        })
      },
      { threshold }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [threshold])

  return videoRef
}
