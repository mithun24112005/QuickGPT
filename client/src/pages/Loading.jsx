import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import axios from 'axios'
import toast from 'react-hot-toast'

const Loading = () => {
  const navigate = useNavigate()
  const { fetchUser, token } = useAppContext()
  const [searchParams] = useSearchParams()
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')

    if (sessionId && token && !isVerifying) {
      setIsVerifying(true)
      const verifySession = async () => {
        try {
          const { data } = await axios.post('/api/credit/verify', { sessionId }, { headers: { Authorization: token } })
          if (data.success) {
            await fetchUser()
            toast.success("Payment successful! Credits added.")
          } else {
            toast.error(data.message || "Payment verification failed")
          }
        } catch (error) {
          console.error("Error verifying payment:", error)
        } finally {
          navigate('/')
        }
      }
      verifySession()
    } else if (!sessionId) {
      const timeout = setTimeout(() => {
        fetchUser()
        navigate('/')
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [navigate, searchParams, token])

  return (
    <div className='relative overflow-hidden bg-canvas dark:bg-dark-canvas flex items-center justify-center h-screen w-screen text-ink dark:text-dark-ink text-2xl'>
      {/* Glassmorphism Background Blobs */}
      <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] rounded-full bg-brand-lavender/30 dark:bg-brand-lavender/10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[30%] w-[30%] h-[30%] rounded-full bg-brand-peach/30 dark:bg-brand-peach/10 blur-[80px] pointer-events-none"></div>

      <div className='relative z-10 p-6 rounded-full bg-surface-card/60 dark:bg-dark-surface-card/60 backdrop-blur-md shadow-lg border border-hairline/50 dark:border-dark-hairline/50'>
        <div className='w-10 h-10 rounded-full border-3 border-accent border-t-transparent animate-spin'>
        </div>
      </div>
    </div>
  )
}

export default Loading
