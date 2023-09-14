import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import { api } from '~/utils/api'
import ChatNotifcationItem from './chatNotificationItem'

const ChatNotifications = () => {

    const { data:chatList, isLoading, hasNextPage, fetchNextPage   } = api.chat.getChatList.useInfiniteQuery({}, 
      {getNextPageParam: (lastPage) => lastPage ? lastPage.nextCursor : undefined } )

    const flatChats = chatList?.pages.flatMap(page => page?.chatList?.chats)
    const mappedChatList = flatChats?.map((chat) => <ChatNotifcationItem key={chat?.chatid} chatid={chat?.chatid} chatMembers={chat?.chatmembers} lastMessage={chat?.messages[0]} />)

        const [ sentryRef ] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasNextPage || false,
    onLoadMore: fetchNextPage,
    disabled: !hasNextPage,
    rootMargin: '0px 0px 400px 0px',
  })

  return (
    <div>
      <div className="pt-2 max-h-60 overflow-hidden overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-2">
           <h2 className="text-2xl font-semibold  p-2 border-b-1 border-primary-bottom shadow-sm text-center" >Chats </h2>
           <Link href="/chat">
            <Image className="cursor-pointer" alt="chats" height="30" width="30" src="/icons/go.svg"/>
          </Link>        
        </div>
      
    <div>{mappedChatList}</div>
    {isLoading || hasNextPage ?
    <div ref={sentryRef} className="flex justify-center text-secondary">Loading...</div>
    :
    <div className="flex justify-center text-secondary">End of notifcations</div>
}
        </div>
    </div>
  )
}

export default ChatNotifications