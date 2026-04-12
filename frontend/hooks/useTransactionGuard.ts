'use client'

import { useEffect, useState } from 'react'
import { transactionGuard } from '@/lib/transactionGuard'

export function useTransactionGuard() {
  const [isEnabled, setIsEnabled] = useState(true)
  const [isGuarding, setIsGuarding] = useState(false)

  useEffect(() => {
    transactionGuard.setEnabled(isEnabled)
  }, [isEnabled])

  const guardTransaction = async (tx: any) => {
    setIsGuarding(true)
    try {
      const allowed = await transactionGuard.guardTransaction(tx)
      return allowed
    } finally {
      setIsGuarding(false)
    }
  }

  const toggleGuard = () => {
    setIsEnabled(!isEnabled)
  }

  return {
    isEnabled,
    isGuarding,
    guardTransaction,
    toggleGuard,
  }
}
