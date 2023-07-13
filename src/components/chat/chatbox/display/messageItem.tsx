import Image from 'next/image'
import React from 'react'
import { ScrollRef } from '.'

const MessageItem = ({ children, currentUser, scrollRef, avatar } : 
    { children: string, currentUser: boolean, scrollRef?: ScrollRef, avatar?: string }) => {
  return (
    <div className={`flex items-center ${currentUser ? 'flex-row-reverse mr-4' : 'ml-4 flex-row'} `}>
      <div className="h-14 w-14 relative">
        <Image src={avatar ? avatar : '/icons/user.svg'} 
        alt="avatar" fill className="rounded-[50px]" /> 
      </div>
      <div ref={scrollRef} className={`p-4 m-6 rounded-lg bg ${currentUser ? 'bg' : 'altchat'}`}>{children}</div>
    </div>
  )
}

export default MessageItem