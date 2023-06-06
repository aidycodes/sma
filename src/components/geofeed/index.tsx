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

    if(!lat || !lng ) return <div className="mt-16">you must enable your location settings</div>


    const profile = api.userQuery.getUserProfile.useQuery()   
    const {  data:geoData, isLoading } = api.userQuery.getUsersGeoData.useQuery()
    const { data, hasNextPage, fetchNextPage } = api.feed.getGeoFeed_current.useInfiniteQuery({ lat:lat, lng:lng}, 
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
 console.log({hasNextPage})

  return (
               <div>{isLoading && posts?.length === 0 && 
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

export default GeoFeed