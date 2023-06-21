import { useAtom } from 'jotai'
import { currentLocationAtom, radiusAtom } from '~/jotai/store'
import { api } from '~/utils/api'

const useCurrentLocationFeed = () => {

    const [ currentLocation ] = useAtom(currentLocationAtom)
    const [ radius ] = useAtom(radiusAtom)

    const { data, isError, isLoading, hasNextPage, fetchNextPage } = api.feed.getGeoFeed_current
            .useInfiniteQuery({lat: currentLocation.lat, lng: currentLocation.lng, radius: radius},
                    {getNextPageParam: (lastPage) => lastPage ? lastPage.nextCursor : undefined
})

    if(data){
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

export default useCurrentLocationFeed