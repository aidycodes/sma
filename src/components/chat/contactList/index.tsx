import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { SetCreateMessage } from '~/pages/chat'
import { api } from '~/utils/api'
import ContactListItem from './ContactListItem'
import ContactListSkell from './ContactListSkell'

const ContactList = ({ setCreateMessage, createMessage }: { setCreateMessage: SetCreateMessage, createMessage: boolean }) => {

     const { data, isLoading  } = api.userQuery.getUserProfile.useQuery()
    const { query } = useRouter()
        const { data:chatList   } = api.chat.getChatList.useInfiniteQuery({}, 
      {getNextPageParam: (lastPage) => lastPage ? lastPage.nextCursor : undefined } )

      const flatChats = chatList?.pages.flatMap(page => page?.chatList?.chats)

    const contactMap = flatChats?.map((chat) => (
      chat?.chatid === 'optimistic' ? <div key={chat?.chatid}><ContactListSkell/></div> :
       <div key={chat?.chatid}><ContactListItem chatid={chat?.chatid} chatMembers={chat?.chatmembers} lastMessage={chat?.messages[0]} /></div>
       ))


    if(isLoading) return (
    <div className="border-primary w-[120px] md:w-[240px] lg:w-[320px] h-[calc(100vh-80px)] overflow-y-scroll scrollbar-hide mt-1 border-primary-top">
        <h4 className="text-secondary text-center">Recent chats</h4>
        <ContactListSkell/>
    </div>)

  return (
    <div className=" border-primary w-[120px] md:w-[240px] lg:w-[320px] h-[calc(100vh-80px)] overflow-y-scroll scrollbar-hide mt-1 border-primary-top">
        <div className="flex justify-center items-center">
        <div className="text-secondary text-center pl-6 md:pl-8 font-semibold ">Chats</div>
        <div className=" p-1 ml-auto  flex items-center">
          <div>
          <input className="h-6 m-2 rounded-xl pl-4 hidden lg:flex lg:w-40" placeholder="search"/>
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
        <div className="flex flex-col flex-start w-full">
        {contactMap}

        </div>
    </div>
  )
}

export default ContactList