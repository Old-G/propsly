"use client"

import { useEffect } from "react"

export function PdfAutoPrint() {
  useEffect(() => {
    // Small delay to let the page fully render before triggering print
    const timeout = setTimeout(() => {
      window.print()
    }, 800)
    return () => clearTimeout(timeout)
  }, [])

  return null
}
