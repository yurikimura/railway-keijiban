import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useThreads } from '../contexts/ThreadContext'
import './Thread.css'

interface Post {
  id: number
  content: string
  timestamp: string
}

interface ThreadData {
  id: number
  title: string
  posts: Post[]
}

const Thread = () => {
  const { id } = useParams<{ id: string }>()
  const [thread, setThread] = useState<ThreadData | null>(null)
  const [newPost, setNewPost] = useState('')
  const { threads } = useThreads()

  useEffect(() => {

    // サンプルデータ
    const sampleThreads: { [key: string]: ThreadData } = {
      '3': {
        id: 3,
        title: 'TechTrainってどうなの？',
        posts: [
          { id: 1, content: '> わいJavaScriptで挫折したまる？', timestamp: '2024-01-15 10:30' },
          { id: 2, content: '> わいはめっちゃお世話になったkwsk', timestamp: '2024-01-15 11:15' },
          { id: 3, content: 'わいJavaScriptで挫折した', timestamp: '2024-01-15 12:00' },
          { id: 4, content: 'おすすめ\nわいはめっちゃお世話になった', timestamp: '2024-01-15 13:45' },
          { id: 5, content: 'TechTrainってどんな感じ？\n気になるから教えてほしい', timestamp: '2024-01-15 14:20' }
        ]
      }
    }

    if (id && sampleThreads[id]) {
      setThread(sampleThreads[id])
    } else {
      // デフォルトのスレッドデータ
      const threadId = parseInt(id || '1')
      const contextThread = threads.find(t => t.id === threadId)
      const title = contextThread?.title || 'スレッドタイトル'
      setThread({
        id: threadId,
        title: title,
        posts: []
      })
    }
  }, [id, threads])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPost.trim() && thread) {
      const post: Post = {
        id: Date.now(), // 一意のIDを生成
        content: newPost,
        timestamp: new Date().toLocaleString('ja-JP')
      }
      setThread({
        ...thread,
        posts: [post, ...thread.posts] // 新しい投稿を配列の先頭に追加
      })
      setNewPost('')
    }
  }

  if (!thread) return <div>Loading...</div>

  return (
    <div className="thread-container">
      <header className="header">
        <h1>掲示板</h1>
        <Link to="/create" className="create-thread-btn">スレッドをたてる</Link>
      </header>
      
      <main className="main-content">
        <h2>{thread.title}</h2>
        
        <div className="posts-container">
          <div className="posts-list">
            {thread.posts.map(post => (
              <div key={post.id} className="post-item">
                {post.content.split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            ))}
          </div>
          
          <div className="post-form-container">
            <form onSubmit={handleSubmit} className="post-form">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="post-textarea"
                placeholder="投稿しよう！"
                rows={4}
              />
              <button type="submit" className="post-submit-btn">投稿</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Thread 