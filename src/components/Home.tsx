import { Link } from 'react-router-dom'
import { useThreads } from '../contexts/ThreadContext'
import './Home.css'

const Home = () => {
  const { threads } = useThreads()

  return (
    <div className="home-container">
      <header className="header">
        <h1>掲示板</h1>
        <Link to="/create" className="create-thread-btn">スレッドをたてる</Link>
      </header>
      
      <main className="main-content">
        <h2>新着スレッド</h2>
        <div className="thread-list">
          {threads.map(thread => (
            <Link key={thread.id} to={`/threads/${thread.id}`} className="thread-item">
              {thread.title}
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home 