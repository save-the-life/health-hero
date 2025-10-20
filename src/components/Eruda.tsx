'use client'

import { useEffect } from 'react'

export default function Eruda() {
  useEffect(() => {
    // 개발 환경 또는 샌드박스 환경에서만 Eruda 로드
    if (
      process.env.NODE_ENV === 'development' ||
      typeof window !== 'undefined' && window.location.hostname.includes('sandbox')
    ) {
      import('eruda').then((eruda) => {
        eruda.default.init()
        console.log('🔧 Eruda initialized')
      })
    }
  }, [])

  return null
}

