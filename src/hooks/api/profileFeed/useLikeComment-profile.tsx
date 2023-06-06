import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { api } from '~/utils/api'
import useCurrentUserProfile from '../useCurrentUserProfile'
import { useAtom } from "jotai";
import { currentLocationAtom, FeedDirectorAtom } from "~/jotai/store";

export type QueryParams = {
    id: string 
    postAmt: number
}

const useLikeComment= (postid: string, commentid: string) => {
    const trpc = api.useContext()
    const { userid, username } = useCurrentUserProfile()
    
    const router = useRouter()

    const [page, profileId] = router.asPath.substr(1).split('/')
    const [ [type, procedure] ] = useAtom(FeedDirectorAtom)
    const [currentLocation] = useAtom(currentLocationAtom)

    const postType = type === 'geo' ? 'geoComment' : 'comment' 

      return api[postType].like.useMutation({
    onMutate: async (like: any) => {
      if(page === 'user' && profileId){
      trpc.userQuery.getUserPosts.cancel()
      trpc.userQuery.getUserPosts.setInfiniteData({id:profileId, postAmt:3}, (oldData: any) => {
        return optimisticLikeComment(commentid, oldData, postid, userid, username)
      })
    }
      if(page === 'dashboard' && type !== 'geo'){
             trpc.feed.getFollowerFeed.cancel()
      trpc.feed.getFollowerFeed.setInfiniteData({postAmt:5}, (data: any) => {
        return optimisticLikeComment(commentid, data, postid, userid, username)
      })

      }
      if(page === 'dashboard' && type === 'geo' && currentLocation){
              trpc.feed.getGeoFeed_current.cancel()
      trpc.feed.getGeoFeed_current.setInfiniteData({lat:currentLocation.lat, lng:currentLocation.lng}, (data: any) => {
        return optimisticLikeComment(commentid, data, postid, userid, username)
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

function optimisticLikeComment(commentid: string, data: any, postid: string, userid: string, username: string) {
     const updatedData = data?.pages.map((page: any) => {
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
        return {...data, pages:updatedData}
      }