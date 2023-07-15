import { useRouter } from 'next/router'
import React from 'react'
import { api } from '~/utils/api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import MultiAvatar from './MultiAvatar'
import ScrollContainer from './ScrollContainer'

dayjs.extend(relativeTime)

export type ScrollRef = React.MutableRefObject<HTMLDivElement | null>

const ChatDisplay = () => {

  const router = useRouter()

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage,   } = api.chat.getMessages.useInfiniteQuery({ chatId: router.query.id as string},
    { getNextPageParam: (lastPage) => lastPage?.nextCursor ? lastPage?.nextCursor : undefined})
  
  const messageArray = data?.pages?.flatMap((page: any) => page?.messages)
  const chatmembersArray = data?.pages?.flatMap((page: any) => page?.chat?.chatmembers)
 
  const chatmembers = chatmembersArray?.map((member, i) => (
  <span>{member?.profile?.username}{i < data?.chat?.chatmembers?.length-1 && ', ' }</span>
  ))
console.log({data})

  return (
    <div className="h-[calc(100%-150px)] w-full  ">
        <div className="flex items-center justify-start w-full brightness-125 min-h-[80px] gap-2 p-2 shadow-md border-primary-bottom border-primary-top">
            {isLoading ? <p className="text-center text-secondary h-[50px] w-[50px] rounded-[50px] skeleton-box font-semibold opacity-20"></p> :
          <MultiAvatar images={chatmembersArray?.map(member => member?.profile?.avatar)} />
}            { isLoading ? <div className="text-xl ml-16 skeleton-box w-[200px] h-4 rounded-xl opacity-20 "></div>
             : <h2 className="text-xl ml-16 ">{chatmembers}</h2> }
            <div className="ml-auto self-end">
                  <p className="text-sm text-secondary ">{data?.chat?.messages?.length > 0 && data?.chat?.updated_at ? `Last Message' ${dayjs(data?.chat?.updated_at).fromNow()}` : '' }</p>
            </div>
        </div>
  
       <ScrollContainer isLoading={isLoading} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage}
         fetchNextPage={fetchNextPage}>{messageArray}</ScrollContainer>
             
    </div>
  )
}

export default ChatDisplay

