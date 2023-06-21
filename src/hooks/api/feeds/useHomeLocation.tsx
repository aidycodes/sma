import { useAtom } from 'jotai'
import { currentLocationAtom, radiusAtom } from '~/jotai/store'
import { api } from '~/utils/api'

const useHomeLocationFeed = () => {

    const { data:{geoData} } = api.userQuery.getUsersGeoData.useQuery()
    const [ radius ] = useAtom(radiusAtom)
    
    const { data, isError, isLoading, hasNextPage, fetchNextPage } = api.feed.getGeoFeed_home
            .useInfiniteQuery({lat: geoData?.lat, lng: geoData?.lng, radius: radius},
                    {getNextPageParam: (lastPage) => lastPage ? lastPage.nextCursor : undefined
})

    if(geoData?.lat && geoData?.lng && data){
        return {posts:data?.pages?.flatMap(page => page?.posts),
                isError,
                isLoading,
                hasNextPage,
                fetchNextPage
            }

    }
    return {
        posts:[],
        isError,
        isLoading,
        hasNextPage,
        fetchNextPage
    }

}

export default useHomeLocationFeed