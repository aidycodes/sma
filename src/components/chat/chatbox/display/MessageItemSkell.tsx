import React from 'react'

const MessageItemSkell = () => {
  return (
    <div className="flex flex-col"> 
        <div className={`w-[150px] h-[10px] opacity-20 p-8 m-6 rounded-lg bg skeleton-box`}></div>
        <div className={`w-[150px] h-[10px] opacity-20 p-8 m-6 rounded-lg bg skeleton-box ml-auto`}></div>
        <div className={`w-[150px] h-[10px] opacity-20 p-8 m-6 rounded-lg bg skeleton-box`}></div>
    </div>
  )
}

export default MessageItemSkell