import { NotifyUser } from '@prisma/client'
import { UseMutateFunction } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

function useDebounceMutation<T>(fn: any, id: string, delay?: number,) {
  
  useEffect(() => {
    const timer = setTimeout(() => fn({notify_user_id:id}), delay || 50000)

    return () => {
      clearTimeout(timer)
    }
  }, [fn, delay])

  return fn
 
}

export default useDebounceMutation