import React from 'react'
import useFollowFeed from '~/hooks/api/followingFeed/followfeed'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import PostSkeleton from '~/components/post/skeleton'
import { api } from '~/utils/api'
import PostItem from '../post'

const Feed = () => {

    const [filterFeed, setFilterFeed] = React.useState<string[]>([])

    const profile = api.userQuery.getUserProfile.useQuery()
   
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
                {isLoading || hasNextPage &&
                <div ref={sentryRef}>
                    <PostSkeleton/>
                    <PostSkeleton/>
                    <PostSkeleton/>
                </div>
            }
            </div>
            </div>
        </div>

  )
}

export default Feed