import React from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import PostSkeleton from '~/components/post/skeleton'
import PostItem from '~/components/post'
import useLikePost from '~/hooks/api/useLikePost'
import useProfileFeed from '~/hooks/api/feeds/useProfileFeed'
import useUnlikePost from '~/hooks/api/useUnlikePost'
import { useRouter } from 'next/router'


const ProfileFeed = () => {

    const [filterFeed, setFilterFeed] = React.useState<string[]>([])

    const router = useRouter()
    const  { id }  = router.query

    const { posts, isLoading, hasNextPage, fetchNextPage } = useProfileFeed(id)
    
    const [sentryRef] = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: hasNextPage ? hasNextPage : false,
        onLoadMore: fetchNextPage,
        disabled: !!isLoading || !hasNextPage,
        rootMargin: '0px 0px 400px 0px',
    })
                        
     const postArray = posts.map((post: any, i: number) => (
        <PostItem key={post.postid + i} {...post} setFilterFeed={setFilterFeed} />
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