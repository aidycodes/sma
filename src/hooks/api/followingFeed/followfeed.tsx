import { api } from '~/utils/api'

const useFollowFeed = () => {
 const { data, isError, isLoading, hasNextPage, fetchNextPage } = api.feed.getFollowerFeed.useInfiniteQuery({postAmt:5},
  {getNextPageParam: (lastPage) => lastPage ? lastPage.nextCursor : undefined
})

    if(data){
        return {posts:data.pages.flatMap(page => page?.posts),
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

export default useFollowFeed