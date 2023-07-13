import Image from 'next/image'
import React from 'react'
import { SetCreateMessage } from '~/pages/chat'
import { SetSearchChat } from '.'

const ContactListNav = ({createMessage, setCreateMessage, searchChat, setSearchChat}:
     {createMessage: boolean, setCreateMessage: SetCreateMessage, searchChat: string, setSearchChat: SetSearchChat }) => {
  return (
    <div>
    <div className="flex justify-center items-center">
        <div className="text-secondary text-center pl-6 md:pl-8 font-semibold ">Chats</div>
        <div className=" p-1 ml-auto  flex items-center">
          <div>
          <input className="h-6 m-2 rounded-xl pl-4 hidden lg:flex lg:w-40" placeholder="search"
           onChange={(e) => setSearchChat(e.target.value)} value={searchChat} />
          </div>
          
          { !createMessage ? <button key="open" className="hover:backdrop-brightness-150 cursor-pointer rounded-lg" onClick={() => setCreateMessage(true)} disabled={createMessage}> 
              <Image src="/icons/envelope-add.svg" alt="cosmo" width={40} height={40} />
                </button>
          :
            <button key="close" className="hover:backdrop-brightness-150 cursor-pointer rounded-lg" >
               <Image src="/icons/envelope-add.svg" alt="cosmo" width={40} height={40} />
            </button>
            
          }
     
        </div>
        </div>
    </div>
  )
}

export default ContactListNav