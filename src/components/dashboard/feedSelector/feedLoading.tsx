import React from 'react'
import LoadingSpinner from '~/components/loadingspinner'
import PostSkeleton from '~/components/post/skeleton'

const FeedLoading = () => {
  return (
    <div>
         <div className="text-center text-xl text-gray-500 my-2 flex items-center justify-center gap-2 h-10 md:h-4 relative"><LoadingSpinner size="small"/>Getting Current Location...</div>
        <div>
            <PostSkeleton/>
            <PostSkeleton/>
            <PostSkeleton/>
        </div>
    </div>
  )
}

export default FeedLoading