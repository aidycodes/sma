import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { api } from '~/utils/api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import useCurrentUserProfile from '~/hooks/api/useCurrentUserProfile'
import MessageItem from './messageItem'
import MultiAvatar from './MultiAvatar'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import LoadingSpinner from '~/components/loadingspinner'

dayjs.extend(relativeTime)

export type ScrollRef = React.MutableRefObject<HTMLDivElement | null>

const ChatDisplay = ({scrollRef}: {scrollRef: ScrollRef}) => {

  const router = useRouter()
  const { data } = api.chat.getMessages.useQuery({ chatId: router.query.id as string})

  const { data:in2, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage,   } = api.chat.getMessages.useInfiniteQuery({ chatId: router.query.id as string},
    { getNextPageParam: (lastPage) => lastPage?.nextCursor ? lastPage?.nextCursor : undefined})
  const messageArray = in2?.pages?.flatMap((page: any) => page?.messages)

  const   user  = useCurrentUserProfile()
//  const scrollRef = React.useRef<HTMLDivElement>(null)
  const infinteRef = React.useRef<HTMLDivElement>(null)

  const [ sentryRef ] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasNextPage || false,
    onLoadMore: fetchNextPage,
    disabled: !hasNextPage,
    rootMargin: '0px 0px 400px 0px',
  })


  const messages = messageArray?.sort((a, b) => a.created_at - b.created_at).map((message: any, i) => (
     <div key={message?.messageid} className={`${user?.userid === message?.userid ? 'ml-auto' : 'mr-auto'}`}>
    <MessageItem  currentUser={message?.userid === user?.userid} avatar={message?.user?.profile?.avatar}>{message?.content}</MessageItem></div>
    ))

  const chatmembers = data?.chat?.chatmembers.map((member, i) => (
  <span>{member?.profile?.username}{i < data?.chat?.chatmembers?.length-1 && ', ' }</span>
  ))

    useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: 'auto', block: 'end',  inline: 'start' })
    }, [data?.chat])

    useEffect(() => {
      if(isFetchingNextPage) return
      if(messageArray?.find(message => message?.messageid === 'optimistic')) return
      infinteRef.current?.scrollBy(0, 450)
    }, [isFetchingNextPage])
   
  return (
    <div className="h-[calc(100%-150px)] w-full  ">
        <div className="flex items-center justify-start w-full brightness-125 min-h-[80px] gap-2 p-2 shadow-md border-primary-bottom border-primary-top">
            {isLoading ? <p className="text-center text-secondary h-[50px] w-[50px] rounded-[50px] skeleton-box font-semibold opacity-20"></p> :
          <MultiAvatar images={data?.chat?.chatmembers.map(member => member?.profile?.avatar)} />
}            { isLoading ? <div className="text-xl ml-16 skeleton-box w-[200px] h-4 rounded-xl opacity-20 "></div>
             : <h2 className="text-xl ml-16 ">{chatmembers}</h2> }
            <div className="ml-auto self-end">
                  <p className="text-sm text-secondary ">{data?.chat?.messages?.length > 0 && data?.chat?.updated_at ? `Last Message' ${dayjs(data?.chat?.updated_at).fromNow()}` : '' }</p>
            </div>
        </div>
      <div id="some-id" className="flex h-[calc(100%-110px)] overflow-y-scroll " ref={infinteRef}>
        <div className="mt-auto flex flex-col w-full">
          {data?.error && <p className="text-center text-secondary font-semibold">{data?.error}</p>}
          {!data?.error && data?.messages?.length === 0 && <p className="text-center text-secondary font-semibold">No messages yet</p>}
          {isLoading && <p className="text-center text-secondary font-semibold">Loading...</p>}
       {hasNextPage && <div className="flex items-center justify-center gap-2 text-center text-xl mt-8 text-secondary font-semibold" ref={sentryRef}><LoadingSpinner size="small"/><span className="mb-1">Loading...</span></div>}
      <div></div>
       {messages}
       <div ref={scrollRef}></div>
       </div>
      </div>
    </div>
  )
}

export default ChatDisplay

