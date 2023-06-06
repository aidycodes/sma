import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { api } from '~/utils/api'
import useCurrentUserProfile from '../useCurrentUserProfile'

export type QueryParams = {
    id: string 
    postAmt: number
}

const useLikeComment= (postid: string, commentid: string) => {
    const trpc = api.useContext()
    const { userid, username } = useCurrentUserProfile()
    
    const router = useRouter()

    const [page, profileId] = router.asPath.substr(1).split('/')

      return api.comment.like.useMutation({
    onMutate: async (like: any) => {
      if(page === 'user' && profileId){
      trpc.userQuery.getUserPosts.cancel()
      trpc.userQuery.getUserPosts.setInfiniteData({id:profileId, postAmt:3}, (oldData: any) => {
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
        return {...oldData, pages:updatedData}
      })
    }
      if(page === 'dashboard'){
             trpc.feed.getFollowerFeed.cancel()
      trpc.feed.getFollowerFeed.setInfiniteData({postAmt:5}, (oldData: any) => {
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
        return {...oldData, pages:updatedData}
      })

      }
    },
    onError: (error) => {
      toast.error('error liking comment')
      console.log({error})
      trpc.userQuery.getUserPosts.invalidate({id:userid, postAmt:3})
       trpc.feed.getFollowerFeed.invalidate({postAmt:5})
    },
    onSuccess: () => {
      trpc.userQuery.getUserPosts.invalidate({id:userid, postAmt:3})
       trpc.feed.getFollowerFeed.invalidate({postAmt:5})
    }
      
  })
}

export default useLikeComment