import React from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import PostSkeleton from '~/components/post/skeleton'
import { api } from '~/utils/api'
import PostItem from '../post'

type GeoFeedProps = {
    lat: number
    lng: number
}

const GeoFeed = ({lat, lng}: GeoFeedProps) => {

    const [filterFeed, setFilterFeed] = React.useState<string[]>([])

    const profile = api.userQuery.getUserProfile.useQuery()   
    const {  data:geoData, isLoading } = api.userQuery.getUsersGeoData.useQuery()

    const { data, hasNextPage, fetchNextPage, isLoading:mainLoading } = api.feed.getGeoFeed_current.useInfiniteQuery({ lat:lat, lng:lng}, 
        {getNextPageParam: (lastPage) => lastPage ? lastPage.nextCursor : undefined}) 

const posts = data?.pages.flatMap(page => page?.posts)
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

  return (
               <div>{mainLoading && !posts && 
            <div>
            <PostSkeleton/>
            <PostSkeleton/>
            <PostSkeleton/>
            </div>
            }
        <div>
           <div className="">
                {postFeed}
                {isLoading || hasNextPage &&
                <div ref={sentryRef}>
                    <PostSkeleton/>
                    <PostSkeleton/>
                    <PostSkeleton/>
                </div>
            }
            {!hasNextPage && posts?.length > 0
            && <div className="text-center text-xl text-gray-500 mt-2">No more posts</div>
            }
            {
                !isLoading && posts?.length === 0 && <div className="text-center text-xl text-gray-500 mt-2">No posts</div>
            }
            </div>
            </div>
        </div>
  )
}

export default GeoFeed