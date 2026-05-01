import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import moment from "moment"
import toast from 'react-hot-toast'
import axios from 'axios' // Ensure axios is imported

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
    const { chats, setSelectedChat, theme, setTheme, user, navigate, createNewChat, setChats, setToken, token } = useAppContext()
    const [search, setSearch] = useState('')

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        toast.success('Logged out successfully')
    }

    const deleteChat = async (e, chatId) => {
        try {
            e.stopPropagation();
            const confirm = window.confirm('Are you sure you want to delete this chat?');
            if (!confirm) return;

            const { data } = await axios.post('/api/chat/delete', 
                { chatId }, 
                {
                    headers: { 
                        Authorization: token,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (data.success) {
                setChats(prev => prev.filter(chat => chat._id !== chatId));
                toast.success(data.message);
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.message || error.message);
        }
    }

    return (
        <div className={`flex flex-col h-screen min-w-72 p-5 bg-surface-soft/40 dark:bg-dark-surface-soft/40 backdrop-blur-2xl border-r border-white/30 dark:border-white/10 shadow-[4px_0_24px_rgba(0,0,0,0.05)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] transition-all duration-500 max-md:absolute left-0 z-10 ${!isMenuOpen && 'max-md:-translate-x-full'}`}>
            {/* Logo */}
            <img src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark} alt="" className='w-full max-w-48' />
            {/* New chat button */}
            <button onClick={createNewChat} className='flex justify-center items-center w-full py-3 mt-10 text-ink dark:text-white bg-white/30 dark:bg-black/30 backdrop-blur-xl shadow-[0_4px_16px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)] border border-white/50 dark:border-white/20 text-sm rounded-[12px] font-semibold cursor-pointer hover:bg-white/40 dark:hover:bg-black/50 transition-all'>
                <span className='mr-2 text-xl'>New Chat</span>
            </button>

            {/* Search Conversations */}
            <div className="flex items-center gap-2 p-3 mt-4 border border-white/40 dark:border-white/10 shadow-sm dark:shadow-[0_4px_16px_rgba(0,0,0,0.1)] bg-white/20 dark:bg-black/20 backdrop-blur-xl rounded-[12px] focus-within:border-white/60 dark:focus-within:border-white/30 focus-within:shadow-md transition-all">
                <img src={assets.search_icon} alt="" className='w-4 not-dark:invert' />
                <input onChange={(e) => { setSearch(e.target.value) }} value={search} type="text" placeholder='Search conversations' className='text-xs bg-transparent text-ink dark:text-dark-ink placeholder:text-muted dark:placeholder:text-dark-muted outline-none w-full' />
            </div>

            {/* Recent Chats */}
            {chats.length > 0 && <p className='mt-4 text-sm text-ink dark:text-dark-ink font-medium'>Recent Chats</p>}
            <div className='flex-1 overflow-y-scroll mt-3 text-sm space-y-3'>
                {
                    chats.filter((chat) => chat.messages[0] ? chat.messages[0]?.content.toLowerCase().includes(search.toLowerCase()) : chat.name.toLowerCase().includes(search.toLowerCase())).map((chat) => (
                        <div onClick={() => { navigate('/'); setSelectedChat(chat); setIsMenuOpen(false) }} key={chat._id} className='p-2 px-4 bg-white/10 dark:bg-black/20 backdrop-blur-md hover:bg-white/30 dark:hover:bg-black/40 hover:shadow-md border border-white/30 dark:border-white/10 rounded-[12px] cursor-pointer flex justify-between group transition-all'>
                            <div>
                                <p className='truncate w-full text-ink dark:text-dark-ink'>
                                    {chat.messages.length > 0 ? chat.messages[0].content.slice(0, 32) : chat.name}
                                </p>
                                <p className='text-xs text-muted dark:text-dark-muted'>
                                    {moment(chat.updatedAt).fromNow()}
                                </p>
                            </div>
                            <img onClick={e => toast.promise(deleteChat(e, chat._id), { loading: 'deleting...' })} src={assets.bin_icon} alt="" className='block md:hidden group-hover:block w-4 cursor-pointer not-dark:invert' />
                        </div>
                    ))
                }
            </div>

            {/* Community images */}
            <div onClick={() => { navigate('/community'); setIsMenuOpen(false) }} className='flex items-center gap-2 p-3 mt-4 bg-white/20 dark:bg-black/20 backdrop-blur-xl shadow-md dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)] border border-white/40 dark:border-white/10 hover:bg-white/30 dark:hover:bg-black/40 hover:shadow-lg rounded-[12px] cursor-pointer transition-all '>
                <img src={assets.gallery_icon} alt="" className='w-4.5 not-dark:invert' />
                <div className='flex flex-col text-sm text-ink dark:text-dark-ink'>
                    <p>Community Images</p>
                </div>
            </div>

            {/* Credit purchase option */}
            <div onClick={() => { navigate('/credits'); setIsMenuOpen(false) }} className='flex items-center gap-2 p-3 mt-4 bg-white/20 dark:bg-black/20 backdrop-blur-xl shadow-md dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)] border border-white/40 dark:border-white/10 hover:bg-white/30 dark:hover:bg-black/40 hover:shadow-lg rounded-[12px] cursor-pointer transition-all '>
                <img src={assets.diamond_icon} alt="" className='w-4.5 dark:invert' />
                <div className='flex flex-col text-sm text-ink dark:text-dark-ink'>
                    <p className='font-medium'>Credits: {user?.credits}</p>
                    <p className='text-xs text-muted dark:text-dark-muted'>Purchase credits to use QuickGPT</p>
                </div>
            </div>

            {/* Dark mode toggle */}
            <div className='flex items-center justify-between gap-2 p-3 mt-4 bg-white/20 dark:bg-black/20 backdrop-blur-xl shadow-md dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)] border border-white/40 dark:border-white/10 rounded-[12px] transition-all '>
                <div className='flex items-center gap-2 text-sm text-ink dark:text-dark-ink'>
                    <img src={assets.theme_icon} alt="" className='w-4 not-dark:invert' />
                    <p>Dark Mode</p>
                </div>
                <label className='relative inline-flex cursor-pointer'>
                    <input
                        onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                        type="checkbox"
                        className='sr-only peer'
                        checked={theme === 'dark'}
                    />
                    <div className={`w-9 h-5 rounded-full transition-all ${theme === 'dark' ? 'bg-accent' : 'bg-muted'}`}>
                        <span className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-4' : 'left-1'}`}></span>
                    </div>
                </label>
            </div>

            {/* User Account */}
            <div className='flex items-center gap-3 p-3 mt-4 bg-white/20 dark:bg-black/20 backdrop-blur-xl shadow-md dark:shadow-[0_4px_16px_rgba(0,0,0,0.2)] border border-white/40 dark:border-white/10 hover:bg-white/30 dark:hover:bg-black/40 hover:shadow-lg rounded-[12px] cursor-pointer transition-all group '>
                <div className="w-8 h-8 rounded-full bg-brand-teal/20 dark:bg-brand-mint/20 text-brand-teal dark:text-brand-mint flex items-center justify-center border border-brand-teal/30 dark:border-brand-mint/30 shadow-sm">
                    <svg className='w-5 h-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </div>
                <p className='flex-1 text-sm text-ink dark:text-dark-ink font-medium truncate '>{user ? user.name : 'Login Your Account'}</p>
                {user && <img onClick={logout} src={assets.logout_icon} className='h-5 cursor-pointer block md:hidden group-hover:block not-dark:invert' />}
            </div>

            <img onClick={() => setIsMenuOpen(false)} src={assets.close_icon} className='absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert' alt="" />
        </div>
    )
}

export default Sidebar