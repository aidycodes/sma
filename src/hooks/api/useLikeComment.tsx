import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { api } from '~/utils/api'
import useCurrentUserProfile from './useCurrentUserProfile'
import { useAtom } from "jotai";
import { currentLocationAtom, FeedDirectorAtom, radiusAtom } from "~/jotai/store";

export type QueryParams = {
    id: string 
    postAmt: number
}

const useLikeComment= (postid: string, commentid: string, type: string = 'normal') => {
    const trpc = api.useContext()
    const { userid, username } = useCurrentUserProfile()
    
    const router = useRouter()

    const [page, profileId] = router.asPath.substr(1).split('/')
    const [ [, procedure] ] = useAtom(FeedDirectorAtom)
    const [currentLocation] = useAtom(currentLocationAtom)
    const [ radius ] = useAtom(radiusAtom)

    const postType = type === 'geo' ? 'geoComment' : 'comment' 

      return api[postType].like.useMutation({
    onMutate: async () => {
      if(page === 'user' && profileId){
      trpc.userQuery.getUserPosts.cancel()
      trpc.userQuery.getUserPosts.setInfiniteData({id:profileId, postAmt:3}, (oldData: any) => {
        return optimisticLikeComment(commentid, oldData, postid, userid, username)
      })
    }
    if(page === 'dashboard' ){     
        trpc.feed.getFollowerFeed.cancel()
             trpc.feed.getFollowerFeed.setInfiniteData({postAmt:5},
              (data: any) => {
               if(data){
        return optimisticLikeComment(commentid, data, postid, userid, username) 
               }    
        }) 

        trpc.feed.getGeoFeed_current.cancel()
            trpc.feed.getGeoFeed_current.setInfiniteData(
                {lat: currentLocation.lat,
                lng:currentLocation.lng,
                radius:radius},
              (data: any) => {
                if(data){
        return optimisticLikeComment(commentid, data, postid, userid, username)
                }
                })
                  
        trpc.feed.getGeoFeed_home.cancel()
            trpc.feed.getGeoFeed_home.setInfiniteData(
                {lat: currentLocation.lat,
                lng:currentLocation.lng,
                radius:radius},
             (data: any) => {
              if(data){
        return optimisticLikeComment(commentid, data, postid, userid, username)
              }
                })
            
        trpc.feed.getActivityFeed.cancel()
            trpc.feed.getActivityFeed.setInfiniteData(
                {},
              (data: any) => {
                if(data){
        return optimisticLikeComment(commentid, data, postid, userid, username)
              }
                })
              }
    },
   
    onError: (error) => {
      toast.error("Error liking comment")
      console.log({error})
      trpc.userQuery.getUserPosts.invalidate()
       trpc.feed.getFollowerFeed.invalidate()
    },
    onSuccess: () => {
            if(page === 'user' && profileId){
                trpc.userQuery.getUserPosts.invalidate()
        }
            if(page === 'dashboard' && procedure === 'getFollowerFeed'){
                trpc.feed.getFollowerFeed.invalidate()
        }
            if(page === 'dashboard' && procedure === 'getGeoFeed_current'){
                trpc.feed.getGeoFeed_current.invalidate()
        }
            if(page === 'dashboard' && procedure === 'getGeoFeed_home'){
                trpc.feed.getGeoFeed_home.invalidate()
        }
            if(page === 'dashboard' && procedure === 'getActivityFeed'){
                trpc.feed.getActivityFeed.invalidate()

        }
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