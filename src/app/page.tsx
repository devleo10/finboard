'use client'

import { useEffect } from 'react'
import { Dashboard } from '@/components/dashboard/Dashboard'
import { useDashboardStore } from '@/store/useDashboardStore'

export default function Home() {
  const { hydrate } = useDashboardStore()

  useEffect(() => {
    // Load saved widgets from localStorage on mount
    hydrate()
  }, [hydrate])

  return <Dashboard />
}


