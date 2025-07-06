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
  id: string
  title: string
  posts: Post[]
}

const Thread = () => {
  const { thread_id } = useParams<{ thread_id: string }>()
  const [thread, setThread] = useState<ThreadData | null>(null)
  const [newPost, setNewPost] = useState('')
  const [threadExists, setThreadExists] = useState<boolean>(true)
  const { threads } = useThreads()

  useEffect(() => {
    const fetchThreadData = async () => {
      if (!thread_id) return

      try {
        const threadId = thread_id
        const contextThread = threads.find(t => t.id.toString() === threadId)
        const title = contextThread?.title || 'スレッドタイトル'

        // APIからポストデータを取得
        const response = await fetch(`https://railway.bulletinboard.techtrain.dev/threads/${threadId}/posts`)
        
        if (response.ok) {
          const posts = await response.json()
          
          // postsが配列であることを確認
          const postsArray = Array.isArray(posts) ? posts : []
          
          // 最新の投稿を最初に表示するために並び替え
          const sortedPosts = postsArray.sort((a, b) => {
            // timestampがある場合はそれで並び替え、なければIDで並び替え
            if (a.timestamp && b.timestamp) {
              return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            }
            return b.id - a.id // IDが大きいものを先に
          })
          
          setThreadExists(true)
          setThread({
            id: threadId,
            title: title,
            posts: sortedPosts
          })
        } else if (response.status === 404) {
          console.warn('スレッドが見つかりません:', threadId)
          setThreadExists(false)
          // スレッドが存在しない場合は空のスレッドを作成
          setThread({
            id: threadId,
            title: title,
            posts: []
          })
        } else {
          console.error('ポストデータの取得に失敗しました。ステータス:', response.status)
          setThreadExists(true) // その他のエラーは一時的な問題として扱う
          // その他のエラーの場合も空のスレッドを作成
          setThread({
            id: threadId,
            title: title,
            posts: []
          })
        }
      } catch (error) {
        console.error('スレッドデータの取得に失敗しました:', error)
        setThreadExists(true) // ネットワークエラーは一時的な問題として扱う
        // エラーが発生した場合も空のスレッドを作成
        const threadId = thread_id || '1'
        const contextThread = threads.find(t => t.id.toString() === threadId)
        const title = contextThread?.title || 'スレッドタイトル'
        setThread({
          id: threadId,
          title: title,
          posts: []
        })
      }
    }

    fetchThreadData()
  }, [thread_id, threads])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPost.trim() && thread) {
      try {
        // APIに投稿を送信
        const response = await fetch(`https://railway.bulletinboard.techtrain.dev/threads/${thread.id}/posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: newPost
          })
        })

        if (response.ok) {
          // 投稿成功後、すぐにサーバーから最新のデータを取得
          const postsResponse = await fetch(`https://railway.bulletinboard.techtrain.dev/threads/${thread.id}/posts`)
          
          if (postsResponse.ok) {
            const posts = await postsResponse.json()
            
            // postsが配列であることを確認
            const postsArray = Array.isArray(posts) ? posts : []
            
            // 最新の投稿を最初に表示するために並び替え
            const sortedPosts = postsArray.sort((a, b) => {
              // timestampがある場合はそれで並び替え、なければIDで並び替え
              if (a.timestamp && b.timestamp) {
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
              }
              return b.id - a.id // IDが大きいものを先に
            })
            
            // 投稿一覧を更新（必ずサーバー側の情報を使用）
            setThread({
              ...thread,
              posts: sortedPosts
            })
          } else {
            console.error('データ再取得に失敗:', postsResponse.status)
            alert('投稿は成功しましたが、最新データの取得に失敗しました。ページを再読み込みしてください。')
          }
          
          // 投稿フォームをクリア
          setNewPost('')
        } else if (response.status === 404) {
          console.error('スレッドが見つかりません:', thread.id)
          alert(`スレッドID ${thread.id} が見つかりません。このスレッドは削除されているか、存在しない可能性があります。`)
        } else {
          console.error('投稿の送信に失敗しました。ステータス:', response.status)
          const errorText = await response.text()
          console.error('エラー詳細:', errorText)
          alert(`投稿の送信に失敗しました。(エラーコード: ${response.status})`)
        }
      } catch (error) {
        console.error('投稿エラー:', error)
        alert('投稿中にエラーが発生しました。ネットワーク接続を確認してください。')
      }
    }
  }

  if (!thread) return <div>スレッドが見つかりません</div>

  return (
    <div className="thread-container">
      <header className="header">
        <h1>掲示板</h1>
        <div className="header-buttons">
          <Link to="/" className="back-to-home-btn">トップへ戻る</Link>
          <Link to="/create" className="create-thread-btn">スレッドをたてる</Link>
        </div>
      </header>
      
      <main className="main-content">
        <h2>{thread.title}</h2>
        
        {!threadExists && (
          <div style={{ padding: '20px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '5px', marginBottom: '20px' }}>
            <strong>⚠️ このスレッドは存在しません</strong>
            <p>スレッドID {thread.id} が見つかりません。削除されているか、URLが間違っている可能性があります。</p>
          </div>
        )}
        
        <div className="posts-container">
          <div className="posts-list">
            {Array.isArray(thread.posts) && thread.posts.length > 0 ? (
              thread.posts.map(post => (
                <div key={post.id} className="post-item">
                  {post.content.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                  ))}
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                {threadExists ? 'まだ投稿がありません。最初の投稿をしてみましょう！' : '投稿がありません'}
              </div>
            )}
          </div>
          
          <div className="post-form-container">
            <form onSubmit={handleSubmit} className="post-form">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="post-textarea"
                placeholder={threadExists ? "投稿しよう！" : "このスレッドには投稿できません"}
                rows={4}
                disabled={!threadExists}
              />
              <button
                type="submit"
                className="post-submit-btn"
                disabled={!threadExists}
              >
                投稿
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Thread
