import { api } from '~/utils/api'

const useActivityFeed = () => {
 const { data, isError, isLoading, hasNextPage, fetchNextPage, isFetching } = api.feed.getActivityFeed.useInfiniteQuery({},
  {getNextPageParam: (lastPage) => lastPage ? lastPage.cursor : undefined
}
)

    if(data){
        return { posts:data.pages.flatMap(page => page?.posts),
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

export default useActivityFeed