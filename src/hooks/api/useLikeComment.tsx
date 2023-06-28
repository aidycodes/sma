import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { api } from '~/utils/api'
import useCurrentUserProfile from './useCurrentUserProfile'
import { useAtom } from "jotai";
import { currentLocationAtom, FeedDirectorAtom, radiusAtom } from "~/jotai/store";
import { TypeOf } from 'zod';

export type QueryParams = {
    id: string 
    postAmt: number
}

const useLikeComment= (postid: string, commentid: string, type: string = 'normal') => {
    const trpc = api.useContext()
    const { userid, username } = useCurrentUserProfile()
    
    const router = useRouter()

    const [page, queryParam] = router.asPath.substr(1).split('/')
    const [ [, procedure] ] = useAtom(FeedDirectorAtom)
    const [currentLocation] = useAtom(currentLocationAtom)
    const [ radius ] = useAtom(radiusAtom)

    const postType = type === 'geo' ? 'geoComment' : 'comment' 

      return api[postType].like.useMutation({
    onMutate: async () => {

      if(page === 'user' && queryParam){
         trpc.userQuery.getUserPosts.cancel()
      trpc.userQuery.getUserPosts.setInfiniteData({id:queryParam, postAmt:3}, (oldData: any) => {
        if(oldData){
        return optimisticLikeComment(commentid, oldData, postid, userid, username, 'add')
        }
      })
    }
    if(page === 'geopost'){
        trpc.geoPost.getPost.cancel()
        trpc.geoPost.getPost.setData({postid:queryParam}, (data: any) => {
            if(data){
                return { post:{...data.post, comments:
                  data.post.comments.map(comment => {
                    return commentid === comment.commentid ? 
                    {...comment, commentid:'opitmistic', likes_cnt:comment.likes_cnt+1, 
                    likes:[...comment.likes, {user:{id:userid, username}} ]}
                    : comment
                      }), } }
            }
          })
        }
      if(page === 'post'){
        trpc.post.getPost.cancel()
        trpc.post.getPost.setData({postid:queryParam}, (data: any) => {
            if(data){
                return { post:{...data.post, comments:
                  data.post.comments.map(comment => {
                    return commentid === comment.commentid ? 
                    {...comment, commentid:'opitmistic', likes_cnt:comment.likes_cnt+1, 
                    likes:[...comment.likes, {user:{id:userid, username}} ]}
                    : comment
                      }), } }
            }
          })
        }
    if(page === 'dashboard' ){     
        trpc.feed.getFollowerFeed.cancel()
             trpc.feed.getFollowerFeed.setInfiniteData({postAmt:5},
              (data: any) => {
               if(data){
        return optimisticLikeComment(commentid, data, postid, userid, username, 'add') 
               }
                    
        }) 

        trpc.feed.getGeoFeed_current.cancel()
            trpc.feed.getGeoFeed_current.setInfiniteData(
                {lat: currentLocation.lat,
                lng:currentLocation.lng,
                radius:radius},
              (data: any) => {
                if(data){
        return optimisticLikeComment(commentid, data, postid, userid, username, 'add')
                }
                })
                  
        trpc.feed.getGeoFeed_home.cancel()
            trpc.feed.getGeoFeed_home.setInfiniteData(
                {lat: currentLocation.lat,
                lng:currentLocation.lng,
                radius:radius},
             (data: any) => {
              if(data){
        return optimisticLikeComment(commentid, data, postid, userid, username, 'add')
              }
                })
            
        trpc.feed.getActivityFeed.cancel()
            trpc.feed.getActivityFeed.setInfiniteData(
                {},
              (data: any) => {
                if(data){
        return optimisticLikeComment(commentid, data, postid, userid, username, 'add')
              }
                })
              }
         
    },
   
    onError: (error, variable, context  ) => {
      toast.error("Error liking comment")
    },
    onSettled: () => {
            if(page === 'user' && queryParam){
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
            if(page === 'geopost'){
                trpc.geoPost.getPost.invalidate()
            }
            if(page === 'post'){
                trpc.post.getPost.invalidate()
              }
            }
      
  })
}

export default useLikeComment

function optimisticLikeComment(commentid: string, data: any, postid: string, userid: string, username: string, type: string) {
     const updatedData = data?.pages.map((page: any) => {
          const posts = page?.posts.map((post: any) => {
            if(post.postid === postid) {
              return {...post, comments:post.comments.map((comment: any) => {
                if(comment.commentid === commentid) {
                  if(type === 'add'){
                  return {...comment, commentid:'opitmistic', likes_cnt:comment.likes_cnt+1, likes:[...comment.likes, {user:{id:userid, username}}]}
                  }
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
    