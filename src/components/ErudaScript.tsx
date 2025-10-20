'use client'

import { useEffect } from 'react'

export default function ErudaScript() {
  useEffect(() => {
    // 이미 Eruda가 로드되어 있는지 확인
    if ('eruda' in window) {
      console.log('✅ Eruda already loaded')
      return
    }

    // 이미 스크립트가 추가되어 있는지 확인
    const existingScript = document.querySelector('script[src*="eruda"]')
    if (existingScript) {
      console.log('✅ Eruda script already exists')
      return
    }

    // Eruda 스크립트를 동적으로 로드
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/eruda'
    script.async = true
    
    script.onload = () => {
      if ('eruda' in window) {
        const eruda = (window as typeof window & { eruda: { init: () => void } }).eruda
        eruda.init()
        console.log('🔧 Eruda initialized successfully!')
      }
    }
    
    script.onerror = () => {
      console.error('❌ Failed to load Eruda')
    }
    
    document.head.appendChild(script)
    
    // Cleanup
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return null
}

