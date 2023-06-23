import React from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import LoadingSpinner from '~/components/loadingspinner'
import PostSkeleton from '~/components/post/skeleton'
import { api } from '~/utils/api'
import useCurrentLocationFeed from '../../../hooks/api/feeds/useCurrentLocationFeed'
import PostItem from '../../post'

type GeoFeedProps = {
    lat: number
    lng: number
}

const GeoFeed = ({lat, lng}: GeoFeedProps) => {

    const [filterFeed, setFilterFeed] = React.useState<string[]>([])

    const profile = api.userQuery.getUserProfile.useQuery()   
    const {  data:geoData, isLoading } = api.userQuery.getUsersGeoData.useQuery()

    const { posts, hasNextPage, fetchNextPage, isLoading:feedIsLoading, isFetching } = useCurrentLocationFeed()

    const postFeed = posts?.map((post: any) => ( <PostItem key={post.postid} {...post} setFilterFeed={setFilterFeed} /> 
    )).filter((post: any) => !filterFeed.includes(post.props.postid))
  
        const [sentryRef] = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: hasNextPage ? hasNextPage : false,
        onLoadMore: fetchNextPage,
        disabled: !!isLoading || !hasNextPage,
        rootMargin: '0px 0px 400px 0px',
    })


    if(!feedIsLoading && posts.length === 0){
         return(
            <div className="text-center text-xl fg p-8 
            rounded-xl text-gray-500 mt-2"
            >No posts here yet, Be the first to post in this area!</div>
            )
     }

     if(isLoading){
        return (
            <div>
            <div className="text-center text-xl text-gray-500 my-2 flex items-center justify-center gap-2 h-10 md:h-4 relative">
                 <><div className="mt-2 md:mt-4"><LoadingSpinner size="small"/></div><div className="md:mt-2"> Getting Current Location...</div></> 
            </div>
                <PostSkeleton/>
                <PostSkeleton/>
                <PostSkeleton/>
            </div>
        )
     }

  return (
        <div>
            
            {feedIsLoading && posts.length === 0 && 
            <div>
                     <div className="text-center text-xl text-gray-500 my-2 flex items-center justify-center gap-2 h-10 md:h-4 relative">
                 <><div className="mt-2 md:mt-4"><LoadingSpinner size="small"/></div><div className="md:mt-2"> Getting Latest Posts...</div></> 
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

export default GeoFeed