import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState, useCallback } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook';
import LoadingSpinner from '~/components/loadingspinner';
import useCurrentUserProfile from '~/hooks/api/useCurrentUserProfile';
import MessageItem from './messageItem';

type DivRef = React.LegacyRef<HTMLDivElement | undefined>

const ScrollContainer = ({ children, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage }:
     { children: unknown, hasNextPage: boolean | undefined, isLoading: boolean, fetchNextPage: any, isFetchingNextPage: boolean}) => {
    
    const outerDiv: DivRef = useRef(null);
    const innerDiv: DivRef = useRef(null);
    const prevInnerDivHeight = useRef(null);
    const prevInfiniteDivHeight = useRef(null)
    
    const router = useRouter()
    const prevPage = useRef(router.query.id);

     const [showScrollButton, setShowScrollButton] = useState(false);
     

     const user = useCurrentUserProfile()

      const messages = children?.sort((a, b) => a.created_at - b.created_at).map((message: any, i) => (
     <div key={message?.messageid} className={`${user?.userid === message?.userid ? 'ml-auto' : 'mr-auto'}`}>
    <MessageItem  currentUser={message?.userid === user?.userid} avatar={message?.user?.profile?.avatar}>{message?.content}</MessageItem></div>
    ))

  useEffect(() => {
    const outerDivHeight = outerDiv?.current?.clientHeight;
    const innerDivHeight = innerDiv?.current?.clientHeight;
    const outerDivScrollTop = outerDiv?.current?.scrollTop;

    if (
      !prevInnerDivHeight.current ||
      outerDivScrollTop === prevInnerDivHeight.current - outerDivHeight
    ) {
      outerDiv?.current?.scrollTo({
        top: innerDivHeight! - outerDivHeight!,
        left: 0,
        behavior: prevInnerDivHeight.current ? "smooth" : "auto"
      });
    }
    else {
      setShowScrollButton(true);
    };

    prevInnerDivHeight.current = innerDivHeight;
  }, [children]);

   useEffect(() => {
    if(prevPage.current === router.query.id){
    const outerDivHeight = outerDiv?.current?.clientHeight;
    const innerDivHeight = innerDiv?.current?.clientHeight;
    const outerDivScrollTop = outerDiv?.current?.scrollTop;

    if (
      !prevInnerDivHeight.current ||
      outerDivScrollTop === prevInnerDivHeight.current - outerDivHeight
    ) {
      outerDiv?.current?.scrollTo({
        top: innerDivHeight! - outerDivHeight!,
        left: 0,
        behavior: prevInnerDivHeight.current ? "smooth" : "auto"
      });
    }
    else {
      setShowScrollButton(true);
    };

    prevInnerDivHeight.current = innerDivHeight;
}
  }, [children]); 

  useEffect(() => {
    const outerDivHeight = outerDiv?.current?.clientHeight;
    const innerDivHeight = innerDiv?.current?.clientHeight;
    const outerDivScrollTop = outerDiv?.current?.scrollTop;

    if (
      !prevInnerDivHeight.current ||
      outerDivScrollTop === prevInnerDivHeight.current - outerDivHeight
    ) {
      outerDiv?.current?.scrollTo({
        top: innerDivHeight! - outerDivHeight!,
        left: 0,
        behavior: prevInnerDivHeight.current ? "smooth" : "auto"
      });
    }
    else {
      setShowScrollButton(true);
    };

    prevInnerDivHeight.current = innerDivHeight;
  }, []);

  useEffect(() => {
    prevPage.current = router.query.id
    const outerDivHeight = outerDiv?.current?.clientHeight;
    const innerDivHeight = innerDiv?.current?.clientHeight;
    const outerDivScrollTop = outerDiv?.current?.scrollTop;
    outerDiv?.current?.scrollTo({
        top: innerDivHeight! - outerDivHeight!,
        left: 0,
        behavior: "auto"
      });
  },[router.query.id])

  const handleScrollButtonClick = useCallback(() => {
    const outerDivHeight = outerDiv?.current?.clientHeight;
    const innerDivHeight = innerDiv?.current?.clientHeight;

    outerDiv?.current?.scrollTo({
      top: innerDivHeight! - outerDivHeight!,
      left: 0,
      behavior: "smooth"
    });

    setShowScrollButton(false);
  }, []);

  const handleScrolledDiv = () => {
     const outerDivHeight = outerDiv?.current?.clientHeight;
    const innerDivHeight = innerDiv?.current?.clientHeight;
    const outerDivScrollTop = outerDiv?.current?.scrollTop;
    
    if (
      !prevInnerDivHeight.current ||
      outerDivScrollTop === prevInnerDivHeight.current - outerDivHeight
    ) {
        setShowScrollButton(false);
    }
    else {
        setShowScrollButton(true);
        }
  }
    const [ sentryRef ] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasNextPage || false,
    onLoadMore: fetchNextPage,
    disabled: !hasNextPage,
    rootMargin: '0px 0px 400px 0px',
  })

  useEffect(() => {

    const outerDivHeight = outerDiv?.current?.clientHeight;
    const innerDivHeight = innerDiv?.current?.clientHeight;
    const outerDivScrollTop = outerDiv?.current?.scrollTop;
    const number = prevInfiniteDivHeight.current

    if(!isFetchingNextPage){
        outerDiv?.current?.scrollTo({
        top: innerDivHeight! - number!,
        left: 0,
        behavior: "auto"
        });
    }
    prevInfiniteDivHeight.current = innerDivHeight
    },[isFetchingNextPage])
  
  return (
    <div
      style={{
        position: "relative",
        height: "100%"
      }}

    >
      <div
        ref={outerDiv}
         className="relative h-[calc(100%-110px)] overflow-y-scroll"
               onScroll={() => {
        handleScrolledDiv()
      }}
      >
        <div className="flex flex-col jusity-end min-h-full">
        <div
          ref={innerDiv}
          style={{
            position: "relative"
          }}
          className="mt-auto"
        >
           {hasNextPage && 
        <div className="flex items-center justify-center gap-2 text-center text-xl mt-8 text-secondary font-semibold" 
        ref={sentryRef}><LoadingSpinner size="small"/><span className="mb-1">Loading...</span></div>}
          {messages}
          
        </div>
        </div>
      </div>
      { showScrollButton && messages?.length > 8 && (
      <button
      disabled={!showScrollButton}
        style={{
          position: "absolute",
          color: "white",
          transform: "translateX(-50%)",       
          pointerEvents: showScrollButton ? "auto" : "none"
        }}
        className="p-4 bottom-24 left-[50%] w-[200px] bg rounded-xl opacity-50 hover:opacity-100 right-0 "
        onClick={handleScrollButtonClick}
      >
        Scroll To Bottom
      </button>
      
      )}
      {isLoading && <p className="text-center text-secondary font-semibold">Loading...</p>}
    </div>
  )

}

export default ScrollContainer