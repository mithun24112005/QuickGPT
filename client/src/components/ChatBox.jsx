import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import Message from './Message'
import toast from 'react-hot-toast'

const modeOptions = [
  {
    value: 'text',
    label: 'Text',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    value: 'image',
    label: 'Image',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
  },
]

const ChatBox = () => {
  const containerRef = useRef(null)
  const dropdownRef = useRef(null)
  const { selectedChat, theme, user, token, setUser } = useAppContext()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('text')
  const [prompt, setPrompt] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const currentMode = modeOptions.find((o) => o.value === mode)

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const onSubmit = async (e) => {
    let promptCopy = prompt // preserve original prompt for error rollback
    try {
      e.preventDefault()
      if (!user) return toast('login to send message')
      if (!selectedChat?._id) return toast.error('Please select or create a chat first')

      setLoading(true)
      // show user message immediately
      setMessages(prev => [...prev, { role: 'user', content: prompt, timestamp: Date.now(), isImage: false }])
      setPrompt('')

      // prepare auth header (accept token with or without "Bearer " prefix)
      const authHeader = token ? (token.startsWith('Bearer ') ? token : `Bearer ${token}`) : ''

      const { data } = await axios.post(
        `/api/message/${mode}`,
        { chatId: selectedChat._id, prompt: promptCopy, isPublished },
        { headers: { Authorization: authHeader, 'Content-Type': 'application/json' } }
      )

      if (data.success) {
        setMessages(prev => [...prev, data.reply])
        // decrease credits locally
        setUser(prev => {
          if (!prev) return prev
          return mode === 'image' ? { ...prev, credits: prev.credits - 2 } : { ...prev, credits: prev.credits - 1 }
        })
      } else {
        toast.error(data.message || 'Request failed')
        // restore prompt and remove optimistic user message
        setPrompt(promptCopy)
        setMessages(prev => prev.slice(0, -1))
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Something went wrong')
      // restore prompt and remove optimistic user message
      setPrompt(promptCopy)
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages])

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages)
    }
  }, [selectedChat])

  return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 max-md:mb-4 max-md:pb-safe 2xl:pr-40'>
      {/* chat messages */}
      <div ref={containerRef} className='flex-1 mb-5 overflow-y-scroll'>
        {messages.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center gap-2'>
            <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="" className='w-full max-w-56 sm:max-w-68' />
            <p className='mt-5 text-4xl sm:text-6xl text-center text-ink dark:text-dark-ink font-medium tracking-tight'>Ask me anything</p>
          </div>
        )}

        {messages.map((message, index) => <Message key={index} message={message} />)}

        {/* three dots loading animation */}
        {
          loading && <div className='loader flex items-center gap-1.5'>
            <div className='w-1.5 h-1.5 rounded-full bg-muted dark:bg-dark-muted animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-muted dark:bg-dark-muted animate-bounce'></div>
            <div className='w-1.5 h-1.5 rounded-full bg-muted dark:bg-dark-muted animate-bounce'></div>
          </div>
        }
      </div>

      {mode === 'image' && (
        <label className='inline-flex items-center gap-2 mb-3 text-sm mx-auto'>
          <p className='text-xs'>Publish Generated Image to Community</p>
          <input type="checkbox" className='cursor-pointer' checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
        </label>
      )}
      {/* prompt input box */}
      <form onSubmit={onSubmit} className='bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/50 dark:border-white/20 rounded-[12px] shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-full max-w-2xl p-3 pl-4 mx-auto flex gap-4 items-center max-md:mb-safe focus-within:border-white/80 dark:focus-within:border-white/40 focus-within:shadow-[0_8px_32px_rgba(26,58,58,0.2)] dark:focus-within:shadow-[0_8px_32px_rgba(26,58,58,0.5)] transition-all'>

        {/* Custom Glassmorphic Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-white/30 dark:bg-white/10 border border-white/40 dark:border-white/15 backdrop-blur-md text-sm font-medium text-ink dark:text-dark-ink hover:bg-white/50 dark:hover:bg-white/20 transition-all cursor-pointer select-none shadow-sm"
          >
            <span className="text-brand-lavender dark:text-brand-lavender">{currentMode?.icon}</span>
            <span>{currentMode?.label}</span>
            <svg className={`w-3.5 h-3.5 text-muted dark:text-dark-muted transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute bottom-full left-0 mb-2 min-w-[140px] py-1.5 bg-white/60 dark:bg-black/60 backdrop-blur-2xl border border-white/50 dark:border-white/15 rounded-[10px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-50 animate-in">
              {modeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setMode(option.value)
                    setDropdownOpen(false)
                  }}
                  className={`flex items-center gap-2.5 w-full px-3.5 py-2 text-sm transition-all cursor-pointer
                    ${mode === option.value
                      ? 'bg-brand-lavender/15 dark:bg-brand-lavender/20 text-brand-lavender dark:text-brand-lavender font-medium'
                      : 'text-ink dark:text-dark-ink hover:bg-white/40 dark:hover:bg-white/10'
                    }
                  `}
                >
                  <span className={mode === option.value ? 'text-brand-lavender' : 'text-muted dark:text-dark-muted'}>{option.icon}</span>
                  <span>{option.label}</span>
                  {mode === option.value && (
                    <svg className="w-3.5 h-3.5 ml-auto text-brand-lavender" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <input value={prompt} onChange={(e) => setPrompt(e.target.value)} type="text" placeholder='Type your prompt here' className='flex-1 w-full text-sm outline-none bg-transparent text-ink dark:text-dark-ink placeholder:text-muted dark:placeholder:text-dark-muted' required />
        <button type="submit" disabled={loading} className="ml-2 p-2.5 bg-brand-lavender dark:bg-brand-lavender hover:bg-brand-lavender/90 text-white rounded-full shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? (
            <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5 translate-x-[1px] translate-y-[-1px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          )}
        </button>
      </form>
    </div>
  )
}

export default ChatBox