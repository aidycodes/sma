import React from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import PostItem from '~/components/post'
import PostSkeleton from '~/components/post/skeleton'
import useLikePost from '~/hooks/api/profileFeed/useLikePost-profile'
import useProfileFeed from '~/hooks/api/profileFeed/useProfileFeed'
import useUnlikePost from '~/hooks/api/profileFeed/useUnlikePost-profile'


const ProfileFeed = () => {

    const [filterFeed, setFilterFeed] = React.useState<string[]>([])


const params = {id:'WRdW83qzlVMK2qe'}
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

 
                        
     const postArray = posts.map((post: any, i: number) => (
        <PostItem key={post.postid + i} {...post} like={like} unlike={unlike} setFilterFeed={setFilterFeed} />
    )).filter((post: any) => !filterFeed.includes(post.props.postid))

  return (
            <div>{isLoading && posts.length === 0 && 
            <div>
            <PostSkeleton/>
            <PostSkeleton/>
            <PostSkeleton/>
            </div>
            }
                {postArray}
                {isLoading || hasNextPage &&
                <div ref={sentryRef}>
                    <PostSkeleton/>
                    <PostSkeleton/>
                </div>
            }
            </div>

  )
}

export default ProfileFeed