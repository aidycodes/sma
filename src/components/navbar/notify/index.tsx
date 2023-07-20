import Item from '~/components/navbar/notify/notifyitem'
import React from 'react'
import Image from 'next/image'
import { getQueryKey } from '@trpc/react-query'
import { api } from '~/utils/api'
import useInfiniteScroll from 'react-infinite-scroll-hook';
import Loading from '~/components/loading'


const Notify = () => {

  const {data, isLoading, isError,
     hasNextPage, fetchNextPage} = api?.userQuery?.getNotifcations?.useInfiniteQuery( {take:10},
    { getNextPageParam:(lastPage) => lastPage?.nextCursor} )

    const queryKey = getQueryKey(api.userQuery.getNotifcations, {take:10}, 'infinite')

    const newarray = data?.pages.flatMap((item: any) => item.notifcations) 

    const [sentryRef] = useInfiniteScroll({
    loading:isLoading,
    hasNextPage: hasNextPage || false,
    onLoadMore: fetchNextPage,
    disabled: isError,
    rootMargin: '0px 0px -400px 0px',
  });

    if(isLoading) return <Loading/>
    if(isError) return <div>Error...</div>
 
    if(data === null || data.pages.length === 0){
        return (
             <div className="p-4 flex justify-center items-center flex-col">
                <h4>No Notifcations</h4>
                <Image className="opacity-60" src='icons/comment-alt-message.svg' width={100} height={100} alt='logo' />
            </div>
        )
    }
  return (
 
    <div>
      <div className="pt-2 max-h-60 overflow-hidden overflow-y-auto">
           <h2 className="text-lg  p-2 border-b-1 border-primary-bottom shadow-sm">Notifcations</h2>
    {newarray?.map((item: any, i) => {  
           return(   
           <div ref={i === newarray.length-2 ? sentryRef : undefined} key={item.nofiy_user_id} >
              <Item  key={item.nofiy_user_id} content={item.content} type={item.type} link={item.relativeid} commentid={item.commentid}
                viewed={item.viewed} id={item.nofiy_user_id} queryKey={queryKey}    
              />
            </div>)}
               )
    }
    {(isLoading || hasNextPage) ?
    <Loading/>
    : 
    <div className="flex justify-center text-secondary">End of notifcations</div>
}
</div>
    </div>

  )
}

export default Notify


   // <div  className="absolute right-0 lg:left-0 fg w-56 border-primary shadow-xl rounded-md"> 
    
      
        {/* <div className="pt-2 max-h-60 overflow-hidden overflow-y-auto"> */}
    {/* {data?.pages[0]?.notifcations.map((item: any) => (  
              <Item key={item.nofiy_user_id} content={item.content} type={item.type} link={item.relativeId} 
                viewed={item.viewed} id={item.nofiy_user_id} queryKey={queryKey}                      
               />))
    } */}
    

