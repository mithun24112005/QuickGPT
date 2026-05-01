import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import moment from 'moment'
import Markdown from 'react-markdown'
import Prism from 'prismjs'

const Message = ({message}) => {
  useEffect(()=>{
    Prism.highlightAll()
  },[message.content])
  return (
    <div>
      {message.role==='user'?(
        <div className='flex items-start justify-end my-4 gap-2'>
          <div className='flex flex-col gap-2 p-2 px-4 bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-lg dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)] border border-white/50 dark:border-white/20 rounded-[16px] max-w-2xl'>
            <p className='text-sm text-ink dark:text-dark-ink'>{message.content}</p>
            <span className='text-xs text-muted dark:text-dark-muted'>{moment(message.timestamp).fromNow()}</span>
          </div>
          <img src={assets.user_icon} alt="" className='w-8 rounded-full' />
        </div>
      ):(
        <div className='inline-flex flex-col gap-2 p-2 px-4 max-w-2xl bg-white/20 dark:bg-black/20 backdrop-blur-2xl shadow-lg dark:shadow-[0_4px_16px_rgba(0,0,0,0.3)] border border-white/40 dark:border-white/10 rounded-[16px] my-4'>
          {message.isImage ? (
            <img src={message.content} className='w-full max-w-md mt-2 rounded-md'/>
          ):(
            <div className='text-sm text-ink dark:text-dark-ink reset-tw'>
              <Markdown>{message.content}</Markdown>
            </div>
          )}
          <span className='text-xs text-muted dark:text-dark-muted'>{moment(message.timestamp).fromNow()}</span>
        </div>
      )}
    </div>
  )
}

export default Message
