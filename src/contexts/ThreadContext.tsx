/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react'
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
  const [threads, setThreads] = useState<Thread[]>([
    { id: 1, title: '推しについて語るスレ' },
    { id: 2, title: '今期覇権アニメ' },
    { id: 3, title: 'TechTrainってどうなの？' },
    { id: 4, title: '暇な人雑談しませんか' },
    { id: 5, title: 'Rustについて語るスレ' },
    { id: 6, title: '自宅警備員だけどなんか質問ある？' },
    { id: 7, title: '大阪でおすすめのラーメン屋教えて' }
  ])

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