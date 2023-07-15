import React, { useState } from 'react'
import ChatDisplay from './display'
import ChatInput from './input'
import EmojiPicker from 'emoji-picker-react'
import { useOutsideClick } from '~/hooks/useOutsideClick'

export type SetShowEmoji = React.Dispatch<React.SetStateAction<boolean>>
export type SetChatInput = React.Dispatch<React.SetStateAction<string>>
export type ScrollRef = React.MutableRefObject<HTMLDivElement | null>

const Chat = ({ infinteRef }: {infinteRef: ScrollRef}) => {

    const [input, setInput] = useState('')
    const [showEmoji, setShowEmoji] = useState(false)

    const handleClose = () => {
        setShowEmoji(false)
    }
    const ref = React.useRef(null)
    useOutsideClick(ref, handleClose)
      const scrollRef = React.useRef<HTMLDivElement>(null)

  return (
    <div id="chat-section" className="z-40 relative w-[calc(100vw-120px)] md:w-[calc(100vw-240px)] lg:w-[calc(100vw-320px)] flex justify-center  border-primary-top mt-1 ">
        
        <div className=" w-full 2xl:w-[70%] flex flex-col items-center xl:shadow-xl dbo-border z-10     fg">
 
        <ChatDisplay scrollRef={scrollRef} infinteRef={infinteRef}/>
        <div className="bg shadow-xl min-w-[100%] p-4 self-start border-teal-500 border-t-2 relative ">
        <ChatInput scrollRef={scrollRef} input={input} setInput={setInput} setShowEmoji={setShowEmoji} />
        </div>
        <div ref={ref} className="absolute bottom-0 right-0">
            {showEmoji && <EmojiPicker theme='dark' onEmojiClick={(e) => setInput(input => input + e.emoji ) } />}
        </div>
        

        </div>
    </div>
  )
}

export default Chat