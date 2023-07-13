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

const ContactListItem = ({ chatMembers, chatid, lastMessage }: ContactListItemProps) => {

    const router = useRouter()
    const { mutate } = api.chat.deleteChat.useMutation()
    const handleClick = () => {
        router.push(`/chat?id=${chatid}`, `/chat/${chatid}`)
    }
    const handleDelete = () => {
        mutate({ chatId: 'cljx0jmus0000v5cwnr4wlw7q' })
    }
    const { profile } = chatMembers[0]

    if(chatMembers.length === 1) {
        
  return (
    <div className={`flex border-primary text-secondary hover:backdrop: flex-wrap md:flex-nowrap items-center justify-center md:justify-start p-2 md:gap-4 gap-2 cursor-pointer hover:md:backdrop-brightness-150
     ${router.query.id === chatid && 'backdrop-brightness-200'} `} onClick={() => handleClick()}>
        
        <div className={`h-24 w-24 md:w-32 md:h-20 relative rounded-[100px]  cursor-pointer hover:opacity-60 md:hover:opacity-100 ${router.query.id === profile?.userid ? 'border-[1px] md:border-none' : null} `}>
            <Image alt='avatar'  src={profile?.avatar ? profile?.avatar : '/icons/user.svg'} fill className="rounded-[50px] " />
        </div>
        <div className="text-xl hidden w-full md:flex flex-col h-[100px] justify-center ">
            <h2 className="relative">{profile?.username}</h2>
            <div className=" w-[120px] lg:w-[200px] whitespace-nowrap top-8 text-sm self-center hidden md:block overflow-hidden text-ellipsis h-10 "> 
            {lastMessage?.content ? lastMessage?.content : 'no messages from user'} </div>
   
        </div>
        
    </div>
  )
    }

    return (
            <div className={`flex border-primary text-secondary hover:backdrop: flex-wrap md:flex-nowrap items-center justify-center md:justify-start p-2 md:gap-4 gap-2 cursor-pointer hover:md:backdrop-brightness-150
     ${router.query.id === chatid && 'backdrop-brightness-200'} `} onClick={() => handleClick()}>
        
        <div className={`h-24 w-24 md:w-32 md:h-20 relative rounded-[100px]  cursor-pointer hover:opacity-60 md:hover:opacity-100 ${router.query.id === profile?.userid ? 'border-[1px] md:border-none' : null} `}>
              <Image alt='avatar'  src={profile?.avatar ? profile?.avatar : '/icons/user.svg'} fill className="rounded-[50px] " />
            
        </div>
        <div className="text-xl hidden w-full md:flex flex-col h-[100px] justify-center ">
            <h2 className="relative">{chatMembers.length + ' chatters in group'}</h2>
            <h2 className=" w-[120px] lg:w-[200px] whitespace-nowrap top-8 text-sm self-center hidden md:block overflow-hidden text-ellipsis h-10 "> 
            {lastMessage?.content ? lastMessage?.content : 'no messages'} </h2>
       
        </div>
    </div>
  )

}

export default ContactListItem