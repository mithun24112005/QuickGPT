import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import { Route, Routes, useLocation } from 'react-router-dom'
import ChatBox from './components/ChatBox' // <-- fixed casing
import Credits from './pages/Credits'
import Community from './pages/Community'
import Login from './pages/Login'
import { assets } from './assets/assets'
import './assets/prism.css'
import Loading from './pages/Loading'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'

const App = () => {
  const { user, loadingUser } = useAppContext()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()

  if (pathname === '/loading' || loadingUser) return <Loading />

  return (
    <>
      <Toaster position="top-center" />
      {!isMenuOpen && (
        <img
          onClick={() => setIsMenuOpen(true)}
          src={assets.menu_icon}
          alt="menu"
          className="absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden invert dark:invert-0 z-10"
        />
      )}

      {user ? (
        <div className="relative overflow-hidden bg-canvas dark:bg-dark-canvas text-ink dark:text-dark-ink transition-colors duration-500 min-h-screen h-screen max-md:h-[100dvh]">
          {/* Glassmorphism Background Blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-pink/40 dark:bg-brand-pink/30 blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-lavender/50 dark:bg-brand-lavender/30 blur-[120px] pointer-events-none"></div>
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-brand-peach/40 dark:bg-brand-peach/20 blur-[90px] pointer-events-none"></div>
          
          <div className="relative flex h-full w-screen z-10 backdrop-blur-sm">
            <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            <Routes>
              <Route path="/" element={<ChatBox />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden bg-canvas dark:bg-dark-canvas flex items-center justify-center h-screen w-screen max-md:h-[100dvh]">
          {/* Glassmorphism Background Blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-teal/20 dark:bg-brand-teal/10 blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-ochre/30 dark:bg-brand-ochre/10 blur-[120px] pointer-events-none"></div>
          <div className="relative z-10">
            <Login />
          </div>
        </div>
      )}
    </>
  )
}

export default App