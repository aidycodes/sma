import React from 'react'
import { toast } from 'react-hot-toast'
import { api } from '~/utils/api'
import useCurrentUserProfile from '../useCurrentUserProfile'

export type QueryParams = {
    id: string 
    postAmt: number
}

const useLikeComment= (postid: string, commentid: string, queryParams: QueryParams) => {
    const trpc = api.useContext()
    const { userid, username } = useCurrentUserProfile()

      return api.comment.like.useMutation({
    onMutate: async (like) => {
      trpc.userQuery.getUserPosts.cancel()
      trpc.userQuery.getUserPosts.setInfiniteData(queryParams, (oldData: any) => {
        const updatedData = oldData?.pages.map((page: any) => {
          const posts = page?.posts.map((post: any) => {
            if(post.postid === postid) {
              return {...post, comments:post.comments.map((comment: any) => {
                if(comment.commentid === commentid) {
                  return {...comment, likes_cnt:comment.likes_cnt+1, likes:[...comment.likes, {user:{id:userid, username}}]}
                }
                return comment
              })}
            }
            return post
          })
          return {...page, posts}
        })
        console.log({updatedData})
        return {...oldData, pages:updatedData}
      })
    },
    onError: (error, variables, context) => {
      toast.error('error liking comment')
      trpc.userQuery.getUserPosts.invalidate({id:userid, postAmt:3})
    },
    onSuccess: (data, variables, context) => {
      trpc.userQuery.getUserPosts.invalidate({id:userid, postAmt:3})
    }
      
  })
}

export default useLikeComment