import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import axios from 'axios'

const Login = () => {
  const [state, setState] = useState("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { setToken } = useAppContext()

  const resetForm = () => {
    setName("")
    setEmail("")
    setPassword("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Form validation
      if (state === "register" && name.length < 3) {
        setLoading(false)
        return toast.error("Name must be at least 3 characters long")
      }
      if (password.length < 6) {
        setLoading(false)
        return toast.error("Password must be at least 6 characters long")
      }

      const payload = state === "login" ? 
        { email, password } : 
        { name, email, password }

      const { data } = await axios.post(`/api/user/${state}`, payload)
      
      if (data.success) {
        const token = `Bearer ${data.token}`
        setToken(token)
        localStorage.setItem('token', token)
        resetForm()
        toast.success(`Successfully ${state === "login" ? "logged in" : "registered"}!`)
      } else {
        toast.error(data.message || "Authentication failed")
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error(
        error.response?.data?.message || 
        error.message || 
        "Authentication failed. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-muted dark:text-dark-muted rounded-[16px] border border-hairline dark:border-dark-hairline bg-surface-card/80 dark:bg-dark-surface-card/80 backdrop-blur-md shadow-xl shadow-black/5 dark:shadow-black/20">
      <p className="text-2xl font-medium m-auto text-ink dark:text-dark-ink">
        <span className="text-accent dark:text-[#5eead4]">User</span> {state === "login" ? "Login" : "Sign Up"}
      </p>
      {state === "register" && (
        <div className="w-full">
          <p>Name</p>
          <input 
            onChange={(e) => setName(e.target.value)} 
            value={name} 
            placeholder="Enter your name" 
            className="border border-hairline/50 dark:border-dark-hairline/50 shadow-sm rounded-[12px] bg-canvas/40 dark:bg-dark-canvas/40 backdrop-blur-md text-ink dark:text-dark-ink w-full p-2 mt-1 focus:outline-accent dark:focus:outline-[#5eead4]" 
            type="text" 
            required 
            minLength={3}
          />
        </div>
      )}
      <div className="w-full">
        <p>Email</p>
        <input 
          onChange={(e) => setEmail(e.target.value)} 
          value={email} 
          placeholder="Enter your email" 
          className="border border-hairline/50 dark:border-dark-hairline/50 shadow-sm rounded-[12px] bg-canvas/40 dark:bg-dark-canvas/40 backdrop-blur-md text-ink dark:text-dark-ink w-full p-2 mt-1 focus:outline-accent dark:focus:outline-[#5eead4]" 
          type="email" 
          required 
        />
      </div>
      <div className="w-full">
        <p>Password</p>
        <input 
          onChange={(e) => setPassword(e.target.value)} 
          value={password} 
          placeholder="Enter your password" 
          className="border border-hairline/50 dark:border-dark-hairline/50 shadow-sm rounded-[12px] bg-canvas/40 dark:bg-dark-canvas/40 backdrop-blur-md text-ink dark:text-dark-ink w-full p-2 mt-1 focus:outline-accent dark:focus:outline-[#5eead4]" 
          type="password" 
          required 
          minLength={6}
        />
      </div>
      {state === "register" ? (
        <p>
          Already have account? <span onClick={() => setState("login")} className="text-accent dark:text-[#5eead4] font-medium cursor-pointer hover:underline">click here</span>
        </p>
      ) : (
        <p>
          Create an account? <span onClick={() => setState("register")} className="text-accent dark:text-[#5eead4] font-medium cursor-pointer hover:underline">click here</span>
        </p>
      )}
      <button 
        type="submit" 
        disabled={loading}
        className={`bg-primary dark:bg-white transition-colors text-on-primary dark:text-ink w-full py-3 rounded-[12px] font-semibold cursor-pointer hover:opacity-90 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Please wait...' : (state === "register" ? "Create Account" : "Login")}
      </button>
    </form>
  )
}

export default Login
