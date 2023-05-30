import React from 'react'
import { api } from '~/utils/api'

const useProfileFeed = (profileId: string) => {
 const { data, isError, isLoading, hasNextPage, fetchNextPage } = api.userQuery.getUserPosts.useInfiniteQuery({id:'WRdW83qzlVMK2qe', postAmt:3},
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

export default useProfileFeed