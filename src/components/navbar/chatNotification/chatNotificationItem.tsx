import { Message } from '@prisma/client'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { api } from '~/utils/api'

type ContactListItemProps = {
    chatMembers: any
    chatid: string | undefined
    lastMessage: Message | undefined
}

const ChatNotifcationItem = ({ chatMembers, chatid, lastMessage }: ContactListItemProps) => {

    const router = useRouter()
    const { mutate } = api.chat.deleteChat.useMutation()
    const handleClick = () => {
        router.push(`/chat/${chatid}`)
    }
    const handleDelete = () => {
        mutate({ chatId: 'cljx0jmus0000v5cwnr4wlw7q' })
    }
    const { profile } = chatMembers[0]

    if(chatMembers.length === 1) {
        
  return (
    <div className={`flex border-primary text-secondary hover:backdrop: flex-nowrap items-center
     justify-center  p-2  gap-2 cursor-pointer hover:backdrop-brightness-150 
   'backdrop-brightness-200'} `} onClick={() => handleClick()}>
        <div className={`h-10 w-20 relative  self-start`}>
            <Image alt='avatar' src={profile?.avatar ? profile?.avatar : '/icons/user.svg'} fill className="rounded-[50px] " />
        </div>
        <div className="text-xl w-full  flex-col justify-center ">
            <h2 className="relative">{profile?.username}</h2>
            <div className="  whitespace-nowrap top-8 text-sm self-center  overflow-hidden text-ellipsis  "> 
            {lastMessage?.content ? lastMessage?.content : 'no messages from user'} </div>
        </div>
    </div>
  )
    }

    return (
    <div className={`flex border-primary text-secondary hover:backdrop: flex-nowrap items-center
     justify-center  p-2  gap-2 cursor-pointer hover:backdrop-brightness-150 
   'backdrop-brightness-200'} `} onClick={() => handleClick()}>
        <div className={`h-10 w-20 relative  self-start`}>       
            <Image alt='avatar' src={profile?.avatar ? profile?.avatar : '/icons/user.svg'} fill className="rounded-[50px] " />
        </div>
        <div className="text-xl w-full  flex-col justify-center ">
            <h2 className="relative">{chatMembers.length + ' chatters in group'}</h2>
             <div className="  whitespace-nowrap top-8 text-sm self-center  overflow-hidden text-ellipsis  "> 
            {lastMessage?.content ? lastMessage?.content : 'no messages'} </div>
        </div>
    </div>
  )

}

export default ChatNotifcationItem