import React from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import LoadingSpinner from '~/components/loadingspinner'
import PostSkeleton from '~/components/post/skeleton'
import useHomeLocationFeed from '~/hooks/api/feeds/useHomeLocation'
import { api } from '~/utils/api'
import PostItem from '../../post'

type HomeFeedProps = {
    lat: number
    lng: number
}

const HomeFeed = ({lat, lng}: HomeFeedProps) => {

    const [filterFeed, setFilterFeed] = React.useState<string[]>([])
  
    const {  data:geoData, isLoading } = api.userQuery.getUsersGeoData.useQuery()

    const { posts, hasNextPage, fetchNextPage, isLoading:feedIsLoading, isFetching } = useHomeLocationFeed()

    const postFeed = posts?.map((post: any) => ( <PostItem key={post.postid} {...post} setFilterFeed={setFilterFeed} /> 
    )).filter((post: any) => !filterFeed.includes(post.props.postid))
  
        const [sentryRef] = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: hasNextPage ? hasNextPage : false,
        onLoadMore: fetchNextPage,
        disabled: !!isLoading || !hasNextPage,
        rootMargin: '0px 0px 400px 0px',
    })

     const dateid = Date.now() + 'ddds'
    if(!feedIsLoading && posts.length === 0){
         return(
            <div className="text-center text-xl fg p-8 
            rounded-xl text-gray-500 mt-2"
            >No posts here yet, Be the first to post in this area!</div>
            )
     }
  return (
        <div>{feedIsLoading && posts.length === 0 && 
            <div>
                <div className="text-center text-xl text-gray-500 my-2 flex items-center justify-center gap-2 h-10 md:h-4 relative">
                    </div>
                <PostSkeleton/>
                <PostSkeleton/>
                <PostSkeleton/>
            </div>
            }
           <div>
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
       :
 
        <div className="text-center text-xl text-gray-500 mt-2">End of posts</div>
     
        }</div>
                
        </div>
    
  )
}

export default HomeFeed