import { api } from '~/utils/api'

const useFollowFeed = () => {
 const { data, isError, isLoading, hasNextPage, fetchNextPage, isFetching } = api.feed.getFollowerFeed.useInfiniteQuery({postAmt:5},
  {getNextPageParam: (lastPage) => lastPage ? lastPage.nextCursor : undefined
})

    if(data){
        return {posts:data.pages.flatMap(page => page?.posts),
                isError,
                isLoading,
                hasNextPage,
                fetchNextPage,
                isFetching
            }

    }
    return {
        posts:[],
        isError,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetching
    }
}

export default useFollowFeed