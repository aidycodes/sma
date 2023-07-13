import React from 'react'
import { api } from '~/utils/api'
import ChatNotifcationItem from './chatNotificationItem'

const ChatNotifications = () => {

    const { data:chatList, isLoading, hasNextPage, fetchNextPage   } = api.chat.getChatList.useInfiniteQuery({}, 
      {getNextPageParam: (lastPage) => lastPage ? lastPage.nextCursor : undefined } )

    const flatChats = chatList?.pages.flatMap(page => page?.chatList?.chats)
    const mappedChatList = flatChats?.map((chat) => <ChatNotifcationItem key={chat?.chatid} chatid={chat?.chatid} chatMembers={chat?.chatmembers} lastMessage={chat?.messages[0]} />)

    const { mutate } = api.chat.deleteAllMessages.useMutation()
  return (
    <div>
      <div className="pt-2 max-h-60 overflow-hidden overflow-y-auto shadow-xl">
           <h2 className="text-lg  p-2 border-b-1 border-primary-bottom shadow-sm text-center" onClick={() => mutate()}>~Del</h2>
    <div>{mappedChatList}</div>
    {(isLoading || hasNextPage) ?
    <div className="flex justify-center text-secondary">Loading...</div>
    :
    <div className="flex justify-center text-secondary">End of notifcations</div>
}
        </div>
    </div>
  )
}

export default ChatNotifications