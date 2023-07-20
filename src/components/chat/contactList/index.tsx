import { useRouter } from 'next/router'
import React from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import { useDebounce } from '~/hooks/useDebounce'
import { SetCreateMessage } from '~/pages/chat'
import { api } from '~/utils/api'
import ContactListItem from './ContactListItem'
import ContactListNav from './ContactListNav'
import ContactListSkell from './ContactListSkell'

export type SetSearchChat = React.Dispatch<React.SetStateAction<string>>

const ContactList = ({ setCreateMessage, createMessage }: { setCreateMessage: SetCreateMessage, createMessage: boolean }) => {

    const { query } = useRouter()
        const { data:chatList, isLoading, hasNextPage, fetchNextPage   } = api.chat.getChatList.useInfiniteQuery({}, 
      {getNextPageParam: (lastPage) => lastPage ? lastPage.nextCursor : undefined } )

      const [searchChat, setSearchChat] = React.useState('')
      const debouncedSearchTerm = useDebounce(searchChat, 500)

      const { data:searchList, isLoading:searchLoading} = api.chat.searchChats.useQuery({ searchTerm:debouncedSearchTerm })

     

      const flatChats = chatList?.pages?.flatMap(page => page?.chatList?.chats)

      const [ sentryRef ]  = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: hasNextPage || false,
        onLoadMore: fetchNextPage,
        disabled: !hasNextPage,
        rootMargin: '0px 0px 400px 0px',
      })

    const contactMap = flatChats?.map((chat) => (
      chat?.chatid === 'optimistic' ? <div key={chat?.chatid}><ContactListSkell/></div> :
       <div key={chat?.chatid}><ContactListItem chatid={chat?.chatid} chatMembers={chat?.chatmembers} lastMessage={chat?.messages[0]} /></div>
       ))


    if(isLoading || searchLoading) return (
    <div className="border-primary w-[120px] md:w-[240px] lg:w-[320px] h-[calc(100vh-80px)] overflow-y-scroll scrollbar-hide mt-1 border-primary-top">
        <ContactListNav createMessage={createMessage} setCreateMessage={setCreateMessage} setSearchChat={setSearchChat} searchChat={searchChat}/>
        <ContactListSkell/>
    </div>)
    if(debouncedSearchTerm.length > 0 && searchList?.chats.length === 0) return (
    <div className="border-primary w-[120px] md:w-[240px] lg:w-[320px] h-[calc(100vh-80px)] overflow-y-scroll scrollbar-hide mt-1 border-primary-top">
        <ContactListNav createMessage={createMessage} setCreateMessage={setCreateMessage} setSearchChat={setSearchChat} searchChat={searchChat}/>
        <div className="h-10 text-center text-secondary">No Chats Found</div>
    </div>)

    if(searchList?.chats?.length > 0) return (
     <div className="border-primary w-[120px] md:w-[240px] lg:w-[320px] h-[calc(100vh-80px)] overflow-y-scroll scrollbar-hide mt-1 border-primary-top">
        <ContactListNav createMessage={createMessage} setCreateMessage={setCreateMessage} setSearchChat={setSearchChat} searchChat={searchChat}/>
        {searchList?.chats?.map((chat) => <ContactListItem key={chat?.chatid} chatid={chat?.chatid} chatMembers={chat?.chatmembers} lastMessage={chat?.messages[0]} />)}
    </div>)

  return (
    <div className=" border-primary w-[120px] md:w-[240px] lg:w-[320px] h-[calc(100vh-80px)] overflow-y-scroll scrollbar-hide mt-1 border-primary-top">
      <ContactListNav createMessage={createMessage} setCreateMessage={setCreateMessage}  setSearchChat={setSearchChat} searchChat={searchChat}/>
        
        
         
        <div className="flex flex-col flex-start w-full">
        {contactMap}
        {hasNextPage ? <div ref={sentryRef}>
          <ContactListSkell/>
          <ContactListSkell/>
          <ContactListSkell/>
        </div>
        :
        <div className="h-10 text-center text-secondary">No More Chats</div>
        }
        

        </div>
    </div>
  )
}

export default ContactList