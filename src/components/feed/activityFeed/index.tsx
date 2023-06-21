import React from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import PostSkeleton from '~/components/post/skeleton'
import PostItem from '~/components/post'
import useActivityFeed from '~/hooks/api/feeds/useActivityFeed'
import LoadingSpinner from '~/components/loadingspinner'


const ActivityFeed = () => {

    const [filterFeed, setFilterFeed] = React.useState<string[]>([])

    const { posts, isError, isLoading, hasNextPage, fetchNextPage, isFetching } = useActivityFeed()
    
    const postFeed = posts.map((post: any) => ( <PostItem key={post.postid} {...post} setFilterFeed={setFilterFeed} /> 
    )).filter((post: any) => !filterFeed.includes(post.props.postid))
  
        const [sentryRef] = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: hasNextPage ? hasNextPage : false,
        onLoadMore: fetchNextPage,
        disabled: !!isLoading || !hasNextPage,
        rootMargin: '0px 0px 400px 0px',
    })


  return (
               <div>{isLoading && posts.length === 0 && 
            <div>
            <PostSkeleton/>
            <PostSkeleton/>
            <PostSkeleton/>
            </div>
            }
        <div >
           <div className="">
       
            <div className="text-center text-xl text-gray-500 my-2 flex items-center justify-center gap-2 h-10 md:h-4 relative">
                {isFetching && <><div className="mt-2 md:mt-4"><LoadingSpinner size="small"/></div><div className="md:mt-2"> Checking for New Posts...</div></> }
            </div>

                {postFeed}

                {isLoading || hasNextPage ?
                <div ref={sentryRef}>
                    <PostSkeleton/>
                    <PostSkeleton/>
                    <PostSkeleton/>
                </div>

                : isError ? <div className="text-center text-xl text-gray-500 mt-2">An error has occoured</div>
                : <div className="text-center text-xl text-gray-500 mt-2">No more posts</div>
            }
            </div>
            </div>
        </div>

  )
}

export default ActivityFeed