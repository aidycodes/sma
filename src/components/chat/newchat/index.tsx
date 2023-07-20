import Image from 'next/image'
import React, { useState } from 'react'
import { Josefin_Sans  } from 'next/font/google';
import SearchBox from '~/components/searchbox';
import { UserProfile } from '@prisma/client';
import SelectedDisplay from './selectFollowing/selectedDisplay';
import { api } from '~/utils/api';
import Loading from '~/components/loading';
import { useRouter } from 'next/router';

const jose = Josefin_Sans({ subsets: ['latin'], weight:'300' });

export type SetSelectedUser = React.Dispatch<React.SetStateAction<UserProfile[]>>
export type SetSearchTerm = React.Dispatch<React.SetStateAction<string>>

const NewChat = () => {

    const [searchTerm, setsearchTerm] = useState("")
    const [selectedUser, setselectedUser] = useState<UserProfile[]>([])
    const trpc = api.useContext()
    const router = useRouter()

    const { mutate, isLoading, data  } = api.chat.createChat.useMutation({
      onMutate: () => {
        trpc.chat.getChatList.setInfiniteData({}, (old) => {
          return {
            ...old,
            pages: old?.pages.map((page) => {
              return {
                ...page,
                chatList: {
                  ...page?.chatList,
                  chats: [
                    {
                      chatid: "optimistic",
                      chatmembers: selectedUser.map(user => user.userid),
                      messages: [],
                      lastMessage: null
                    },
                    ...page?.chatList.chats
                  ]
                } } }) } }) },

      onSuccess: () => {
        setselectedUser([])
        setsearchTerm("")
        trpc.chat.getChatList.invalidate()
      }
    })

    React.useEffect(() => {
      if(data) {
        router.push(`/chat?id=${data.chat.chatid}`, `/chat/${data.chat.chatid}`)

      }
    },[data])

  return (
     <div className="flex flex-col mx-8 gap-4 items-center relative ">
        <div className="w-full text-center mt-8">
            
         <h2 className={`text-xl ${jose.className} `}>Create New Chat</h2>
         <Image className="ml-auto self-start absolute right-[-28px] top-1 cursor-pointer" src='/icons/cross.svg' width={25} height={10} alt="line" />
         
         <hr className="h-px my-4 bg-gray-700 border-0 "/>
        </div>
        <div className="mt-4 relative w-full">
          <input type="text" placeholder="Search for a user" className="rounded-lg pl-2 p-1 w-full" value={searchTerm} onChange={(e) => setsearchTerm(e.target.value)} />
          {searchTerm && <SearchBox selectedUser={selectedUser} searchTerm={searchTerm} setSearchTerm={setsearchTerm} setselectedUser={setselectedUser}/>}
        </div>
            <SelectedDisplay selectedUser={selectedUser} setSelectedUser={setselectedUser}/>
        <div>
            <button className="bg-primary text-white bg-blue-700 rounded-lg px-4 py-2 mt-8 mb-4"
            onClick={() => mutate({users:selectedUser.map(user => user.userid)})}>{!isLoading ? 'Create Chat' : <Loading/>}</button>
        </div>
       </div>
  )
}

export default NewChat