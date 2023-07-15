import { createId } from '@paralleldrive/cuid2'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import useCurrentUserProfile from '~/hooks/api/useCurrentUserProfile'
import { api } from '~/utils/api'
import { SetChatInput, SetShowEmoji } from '..'

const ChatInput = ({ input, setInput, setShowEmoji }:
   { input: string, setInput: SetChatInput , setShowEmoji: SetShowEmoji }) => {

  const trpc = api.useContext()
  
  const profile = useCurrentUserProfile()
  const { mutate } = api.chat.Postmessage.useMutation({
    onMutate: (variables) => {
      
    const data =  trpc.chat.getMessages.getInfiniteData({ chatId: query?.id as string })
        const dummyMessage = {
          messageid: createId(),
          content: variables.message,
          userid: profile?.userid as string,
          user: {profile},
          chatid: variables.chatId,
          viewed: false,
          created_at: new Date(),
          updated_at: new Date(),
        }
        trpc.chat.getMessages.setInfiniteData( { chatId: query?.id as string }, (data) => {
          console.log({data})
          if(data?.pages[0]?.messages){
            const newPages = data.pages.map((page, i) => {
              if(i === 0 ){
                return {...page, messages: [...page?.messages, dummyMessage]}
              }
              return {...page}
            })
            console.log({newPages})
       
          return {...data, pages: newPages  }
          
        }
        }) 

      
    },
    onSuccess: () => {
       
    }
  })

  const { query } = useRouter()

  const handlePostMessage = () => {
    mutate({ message: input, chatId:query?.id as string })
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePostMessage()
    }
  }

  return (
    <div className="min-w-full flex gap-2 items-center mb-4 h-8  ">
        <input className="w-full rounded-[150px] h-8 pl-4" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => handleKeyDown(e)} />
        <div className="flex justify-around items-center   ">
        <button className="bg-primary p-2 h-18 w-18 hover:backdrop-brightness-125"  onClick={() => handlePostMessage()}>
            <Image src="/icons/send.svg" alt="send" width={50} height={50} />  
        </button>
        <button className="bg-primary p-2 h-18 w-18 hover:backdrop-brightness-125" onClick={() => setShowEmoji(e => !e)}>
            <Image src="/icons/smile.svg" alt="send" width={50} height={50} />      
        </button>
        
        </div>
        
    </div>
  )
}

export default ChatInput
