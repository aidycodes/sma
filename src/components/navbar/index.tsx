import Image from 'next/image'
import React, { useRef } from 'react'
import { useDebounce } from '~/hooks/useDebounce'
import { api } from '~/utils/api'
import Menu from '../menu'
import Notifcation from '../notifcation'
import SearchBox from './search'
import ChatNotifications from './chatNotification'
import Notify from './notify'
import SettingsMenu from './settings'
import { UserProfile } from '@prisma/client'
import Link from 'next/link'
import useCurrentUserProfile from '~/hooks/api/useCurrentUserProfile'
import { useOutsideClick } from '~/hooks/useOutsideClick'

export type SearchUsers = (UserProfile | null)[] | undefined


const Navbar = () => {
  
   const {data } = api?.userQuery?.getNotifcations?.useInfiniteQuery( {take:10},
    { getNextPageParam:(lastPage) => lastPage?.nextCursor} )

        const { data:chatList   } = api.chat.getChatList.useInfiniteQuery({}, 
      {getNextPageParam: (lastPage) => lastPage ? lastPage.nextCursor : undefined } )

    const hasUnreadChats = chatList?.pages.flatMap(page => page?.chatList?.chats).
          some((chat, i) => i < 10 && chat?.messages[0] && !chat?.messages[0]?.viewed)

      const currentUser = useCurrentUserProfile()
    
       const hasUnreadNotes = data?.pages.flatMap((item: any) => item.notifcations)
              .some((note: any, i) => i < 10 && !note.viewed) 

              const [search , setSearch] = React.useState('')
              const debouncedValue = useDebounce(search, 1000)
              console.log(debouncedValue)
              const { data:searchResults,
                 isFetching, isLoading, isRefetching, isFetched  } = api.userQuery.searchUsers.useQuery({searchTerm:debouncedValue})
          
              const users = searchResults?.users.flatMap(obj => obj.profile)
              const ref = useRef<HTMLDivElement>(null)
              useOutsideClick(ref, () => setSearch(''))
  return (
    <div className="fixed w-full top-0 p-4 lg:p-6 flex justify-around mb-8 shadow-xl fg z-50 ">
   
      <Notifcation />
     
      <div className=" flex justify-around w-full">
        <div className="text-primary text-xl mr-auto flex gap-2 items-center">
          <Link href={`/user/${currentUser?.userid}`}>
           <div className="h-10 w-10  lg:flex rounded-[50px]   ml-auto relative cursor-pointer">
            <Image src={currentUser?.avatar ? currentUser?.avatar :  '/icons/user.svg'}  fill className="rounded-[50px]" alt="user avatar"/>
           </div>
          </Link>
          <h1 className="text-xs md:text-sm mr-2 ">Dashboard</h1>
        </div>
   
        <div className="mr-auto  mt-1 hidden  sm:flex relative">
          <input className="h-[30px] pl-2 sm:w-[300px] lg:w-[400px] xl:w-[500px] rounded-xl"
          onChange={(e) => setSearch(e.target.value) }
          placeholder="Search users..."/>
          { search?.length > 0 && (
          <SearchBox users={users} isFetching={isFetching} isFetched={isFetched} refe={ref}
          isLoading={isLoading} isRefetching={isRefetching} search={search} />
          )}
           
        </div>
          
        <div className="flex gap-4 lg:mr-36 ">
          <div className="relative">
           <label htmlFor='Messages'/>
            <Menu size={35} icon={"comment.svg"} component={<ChatNotifications/>}/> 
            {hasUnreadChats && <div className="absolute w-3 h-3  bg-red-500 rounded-full top-0 right-0"></div>}
            </div>    
            <div className="relative">
             <label htmlFor='Notifications'/>
            <Menu size={35} icon={"bell.svg"} component={<Notify/>}/>
            {hasUnreadNotes && <div className="absolute w-3 h-3  bg-red-500 rounded-full top-0 right-[3px]"></div>}
            </div>
            <div>
            <label htmlFor='settings'/>      
            <Menu size={35}  icon={"setting.svg"} component={<SettingsMenu/>}/>
          </div>
          </div>
       </div>
    </div>
  )
}

export default Navbar