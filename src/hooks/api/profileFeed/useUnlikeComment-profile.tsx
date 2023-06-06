import React from 'react'
import { api } from '~/utils/api'
import useCurrentUserProfile from '../useCurrentUserProfile'
import { QueryParams } from './useLikeComment-profile'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'

const useUnlikeComment = (postid: string, commentid: string) => {
    const trpc = api.useContext()

    const { userid } = useCurrentUserProfile()
    const router = useRouter()
      const [page, profileId] = router.asPath.substr(1).split('/')

        return api.comment.unlike.useMutation({
    onMutate: async (like) => {
        if(page === 'user' && profileId){
       
        trpc.userQuery.getUserPosts.cancel()
        trpc.userQuery.getUserPosts.setInfiniteData({id:profileId, postAmt:3}, (oldData: any) => {
          const updatedData = oldData?.pages.map((page: any) => {
                const pages = page?.posts.map((post: any) => {
                    if(post.postid === postid) {
                        return {...post, comments:[...post.comments.map((comment: any) => {
                            if(comment.commentid === commentid) {
                                return {...comment, likes_cnt:comment.likes_cnt-1,
                                 likes:[...comment.likes.filter((like: any) => like.user.id !== userid)]}
                            }
                            return comment
                        })]}
                    }
                     return post
                    })
                    return {...page, posts:pages}
                    })
          
          return {...oldData, pages:updatedData}
                })          
        }
        if(page === 'dashboard'){
        trpc.feed.getFollowerFeed.cancel()
                trpc.feed.getFollowerFeed.setInfiniteData({postAmt:5}, (oldData: any) => {
          const updatedData = oldData?.pages.map((page: any) => {
                const pages = page?.posts.map((post: any) => {
                    if(post.postid === postid) {
                        return {...post, comments:[...post.comments.map((comment: any) => {
                            if(comment.commentid === commentid) {
                                return {...comment, likes_cnt:comment.likes_cnt-1,
                                 likes:[...comment.likes.filter((like: any) => like.user.id !== userid)]}
                            }
                            return comment
                        })]}
                    }
                     return post
                    })
                    return {...page, posts:pages}
                    })
          
          return {...oldData, pages:updatedData}
                }) 
        
    }},
    onError: (error: any) => {
        console.log({error})
        toast.error('error unliking comment')
    },
    onSettled: () => {
             trpc.userQuery.getUserPosts.invalidate({id:userid, postAmt:3})
       trpc.feed.getFollowerFeed.invalidate({postAmt:5})
    }
    })
}

export default useUnlikeComment