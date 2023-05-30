import React from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import PostItem from '~/components/post'
import useLikePost from '~/hooks/api/profileFeed/useLikePost-profile'
import useProfileFeed from '~/hooks/api/profileFeed/useProfileFeed'
import useUnlikePost from '~/hooks/api/profileFeed/useUnlikePost-profile'


const ProfileFeed = () => {

    const { posts, isLoading, hasNextPage, fetchNextPage } = useProfileFeed('WRdW83qzlVMK2qe')
    const like = useLikePost('WRdW83qzlVMK2qe')
    const unlike = useUnlikePost('WRdW83qzlVMK2qe')

    const [sentryRef] = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: hasNextPage ? hasNextPage : false,
        onLoadMore: fetchNextPage,
        disabled: !!isLoading || !hasNextPage,
        rootMargin: '0px 0px 400px 0px',
    })

     const postArray = posts.map((post: any) => (
        <PostItem key={post.postid} {...post} like={like} unlike={unlike}/>
    ))

  return (
            <div>
                {postArray}
                {isLoading || hasNextPage &&
                <div ref={sentryRef}>
                    Loading
                </div>
            }
            </div>

  )
}

export default ProfileFeed