import Image from 'next/image'
import React from 'react'

const ChatDisplay = () => {
  return (
    <div className="h-[calc(100%-150px)] w-full  ">
        <div className="flex items-center justify-start w-full brightness-125 gap-2 p-2 shadow-md border-primary-bottom border-primary-top">
          <Image src="/icons/user.svg" alt="cosmo" width={50} height={50} />
            <h2 className="text-xl">CosmoCatt</h2>
            <div className="ml-auto self-end">
                  <p className="text-sm text-secondary ">Last Message at 12:00</p>
            </div>
        </div>
   gggrtrtret
    </div>
  )
}

export default ChatDisplay