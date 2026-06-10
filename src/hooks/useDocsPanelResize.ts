import { useEffect, useRef, useState } from 'react'

export const useDocsPanelResize = () => {
  const [docsOpen, setDocsOpen] = useState(() => localStorage.getItem('docsOpen') === 'true')
  const [docsPanelWidth, setDocsPanelWidth] = useState(() => {
    const saved = parseInt(localStorage.getItem('docsPanelWidth') ?? '', 10)
    return isNaN(saved) ? 360 : Math.max(240, Math.min(600, saved))
  })
  const isResizingRef = useRef(false)
  const resizeStartXRef = useRef(0)
  const resizeStartWidthRef = useRef(0)

  const toggleDocs = () => {
    setDocsOpen((prev) => {
      localStorage.setItem('docsOpen', String(!prev))
      return !prev
    })
  }

  const onResizeMouseDown = (e: React.MouseEvent) => {
    isResizingRef.current = true
    resizeStartXRef.current = e.clientX
    resizeStartWidthRef.current = docsPanelWidth
    e.preventDefault()
  }

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return
      const delta = resizeStartXRef.current - e.clientX
      const next = Math.max(240, Math.min(600, resizeStartWidthRef.current + delta))
      setDocsPanelWidth(next)
    }
    const onMouseUp = () => {
      if (!isResizingRef.current) return
      isResizingRef.current = false
      setDocsPanelWidth((w) => {
        localStorage.setItem('docsPanelWidth', String(w))
        return w
      })
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return { docsOpen, docsPanelWidth, toggleDocs, onResizeMouseDown }
}
