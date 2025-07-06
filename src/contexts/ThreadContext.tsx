/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

export interface Thread {
  id: string
  title: string
}

interface ThreadContextType {
  threads: Thread[]
  addThread: (title: string) => Promise<string>
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

  const addThread = async (title: string): Promise<string> => {
    try {
      // APIに新しいスレッドを送信
      const response = await fetch('https://railway.bulletinboard.techtrain.dev/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title
        })
      })

      if (response.ok) {
        const newThread = await response.json()
        console.log('新しいスレッドを作成:', newThread)
        
        // 新しいスレッドを状態に追加
        setThreads(prevThreads => [newThread, ...prevThreads])
        
        return newThread.id
      } else {
        throw new Error('スレッドの作成に失敗しました')
      }
    } catch (error) {
      console.error('スレッド作成エラー:', error)
      throw error
    }
  }

  return (
    <ThreadContext.Provider value={{ threads, addThread }}>
      {children}
    </ThreadContext.Provider>
  )
} 