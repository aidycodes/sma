import React from 'react'
import { createPortal } from 'react-dom'
import { useOutsideClick } from '~/hooks/useOutsideClick'
import NewChat from '.'

const NewChatModal = ( { setCreateMessage }:
   { setCreateMessage:React.Dispatch<React.SetStateAction<boolean>>}) => {
 
    const ref = React.useRef(null)


    const handleClose = () => {
        setCreateMessage(false)
    }

     useOutsideClick(ref, handleClose)

  return (
    <>
    {createPortal(
    <div className="absolute  h-full w-full bg-[rgba(55,65,81,0.2)] fadeIn z-40 ">
      <div ref={ref} className='bg my-auto mx-auto min-h-[420px] w-[350px] md:w-[600px] mt-20 shadow-lg rounded-xl z-40 dbo-border'>
      <NewChat/>
      </div>
    </div>, document.getElementById('chat-section') as HTMLElement)}
    </>
  )
}

export default NewChatModal