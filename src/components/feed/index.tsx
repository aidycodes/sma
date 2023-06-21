import React from 'react'
import useFollowFeed from '~/hooks/api/feeds/followfeed'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import PostSkeleton from '~/components/post/skeleton'
import PostItem from '../post'

const Feed = () => {

    const [filterFeed, setFilterFeed] = React.useState<string[]>([])

    const { posts, isError, isLoading, hasNextPage, fetchNextPage } = useFollowFeed()
    
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
  
                {postFeed}
                {isLoading || hasNextPage ?
                <div ref={sentryRef}>
                    <PostSkeleton/>
                    <PostSkeleton/>
                    <PostSkeleton/>
                </div>
            : <div className="text-center text-xl text-gray-500 mt-2">No more posts</div> 
            }
            </div>
            </div>
        </div>

  )
}

export default Feed