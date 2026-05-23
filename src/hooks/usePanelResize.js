import { useCallback, useEffect, useRef } from 'react'

/**
 * Drag-to-resize hook for IDE panels.
 * @param {'horizontal' | 'vertical'} direction
 * @param {(delta: number) => void} onResize - called with pixel delta while dragging
 */
export function usePanelResize(direction, onResize) {
  const dragging = useRef(false)
  const startPos = useRef(0)

  const stopResize = useCallback(() => {
    dragging.current = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }, [])

  const handleMouseMove = useCallback(
    (event) => {
      if (!dragging.current) return

      const current =
        direction === 'horizontal' ? event.clientX : event.clientY
      const delta = current - startPos.current
      startPos.current = current
      onResize(delta)
    },
    [direction, onResize],
  )

  useEffect(() => {
    const handleMouseUp = () => stopResize()

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, stopResize])

  const startResize = useCallback(
    (event) => {
      event.preventDefault()
      dragging.current = true
      startPos.current =
        direction === 'horizontal' ? event.clientX : event.clientY
      document.body.style.cursor =
        direction === 'horizontal' ? 'col-resize' : 'row-resize'
      document.body.style.userSelect = 'none'
    },
    [direction],
  )

  return { startResize }
}
