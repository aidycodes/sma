import React from 'react'
import { api } from '~/utils/api'
import useCurrentUserProfile from '../useCurrentUserProfile'
import { QueryParams } from './useLikeComment-profile'

const useUnlikeComment = (postid: string, commentid: string, queryParams: QueryParams) => {
    const trpc = api.useContext()

    const { userid } = useCurrentUserProfile()

        return api.comment.unlike.useMutation({
    onMutate: async (like) => {
        trpc.userQuery.getUserPosts.cancel()
        trpc.userQuery.getUserPosts.setInfiniteData(queryParams, (oldData: any) => {
            console.log({oldData})
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
    })
}

export default useUnlikeComment