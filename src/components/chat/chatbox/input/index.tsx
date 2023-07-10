import Image from 'next/image'
import React from 'react'
import { SetChatInput, SetShowEmoji } from '..'

const ChatInput
 = ({ input, setInput, setShowEmoji }: { input: string, setInput: SetChatInput , setShowEmoji: SetShowEmoji }) => {
  return (
    <div className="min-w-full flex gap-2 items-center mb-4 h-8  ">
        <input className="w-full rounded-[150px] h-8 pl-4" value={input} onChange={(e) => setInput(e.target.value)} />
        <div className="flex justify-around items-center   ">
        <button className="bg-primary p-2 h-18 w-18 hover:backdrop-brightness-125 ">
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
