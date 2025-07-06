import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useThreads } from '../contexts/ThreadContext'
import './CreateThread.css'

const CreateThread = () => {
  const [title, setTitle] = useState('')
  const navigate = useNavigate()
  const { addThread } = useThreads()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      try {
        const newThreadId = await addThread(title.trim())
        navigate(`/threads/${newThreadId}`)
      } catch (error) {
        console.error('スレッド作成エラー:', error)
        alert('スレッドの作成に失敗しました')
      }
    }
  }

  return (
    <div className="create-thread-container">
      <header className="header">
        <h1>掲示板</h1>
        <Link to="/create" className="create-thread-btn">スレッドをたてる</Link>
      </header>
      
      <main className="main-content">
        <h2>スレッド新規作成</h2>
        
        <form onSubmit={handleSubmit} className="create-form">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="title-input"
            placeholder="スレッドタイトル"
            required
          />
          
          <div className="form-actions">
            <Link to="/" className="back-link">Topに戻る</Link>
            <button type="submit" className="create-btn">作成</button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default CreateThread 