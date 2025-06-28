/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

export interface Thread {
  id: number
  title: string
}

interface ThreadContextType {
  threads: Thread[]
  addThread: (title: string) => void
}

const ThreadContext = createContext<ThreadContextType | undefined>(undefined)

export const useThreads = () => {
  const context = useContext(ThreadContext)
  if (context === undefined) {
    throw new Error('useThreads must be used within a ThreadProvider')
  }
  return context
}

interface ThreadProviderProps {
  children: ReactNode
}

export const ThreadProvider: React.FC<ThreadProviderProps> = ({ children }) => {
  const [threads, setThreads] = useState<Thread[]>([])

  useEffect(() => {
    fetch('https://railway.bulletinboard.techtrain.dev/threads')
      .then(response => response.json())
      .then(data => {
        setThreads(data)
      })
  }, [])

  const addThread = (title: string) => {
    const newId = Math.max(...threads.map(t => t.id)) + 1
    const newThread: Thread = {
      id: newId,
      title: title
    }
    setThreads(prevThreads => [newThread, ...prevThreads])
  }

  return (
    <ThreadContext.Provider value={{ threads, addThread }}>
      {children}
    </ThreadContext.Provider>
  )
} 