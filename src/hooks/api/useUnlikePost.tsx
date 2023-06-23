import { api } from '~/utils/api'
import { useRouter } from "next/router";
import { toast } from "react-hot-toast"
import useCurrentUserProfile from './useCurrentUserProfile'
import { useAtom } from "jotai";
import { currentLocationAtom, FeedDirectorAtom, radiusAtom } from "~/jotai/store";

const useUnlikePost = (type: string = 'normal') => {

    const trpc = api.useContext()
    const profile = useCurrentUserProfile()
    const [ radius ] = useAtom(radiusAtom)
    const params = useRouter()
    const [page, profileId] = params.asPath.substr(1).split('/')
    const [ [, procedure] ] = useAtom(FeedDirectorAtom)
    const [currentLocation] = useAtom(currentLocationAtom)
    const postType = type === 'geo' ? 'geoPost' : 'post' 

    return  api[postType].unlike.useMutation({
        onMutate: (unlikedPost) => {
            if(page === 'user' && profileId){
            trpc.userQuery.getUserPosts.cancel()
             trpc.userQuery.getUserPosts.setInfiniteData({id:profileId, postAmt:3},
             (old: any) => {
                if(old){            
            return unLikePost(old, unlikedPost, profile?.userid)               
        }})
    }   
    if(page === 'dashboard' ){     
        trpc.feed.getFollowerFeed.cancel()
             trpc.feed.getFollowerFeed.setInfiniteData({postAmt:5},
             (old: any) => {
                if(old){            
            return unLikePost(old, unlikedPost, profile?.userid)       
        }}) 

        trpc.feed.getGeoFeed_current.cancel()
            trpc.feed.getGeoFeed_current.setInfiniteData(
                {lat: currentLocation.lat,
                lng:currentLocation.lng,
                radius:radius},
             (old: any) => {
                if(old){
                     return unLikePost(old, unlikedPost, profile?.userid)
                    }
                })
            }
        trpc.feed.getGeoFeed_current.cancel()
            trpc.feed.getGeoFeed_current.setInfiniteData(
                {lat: currentLocation.lat,
                lng:currentLocation.lng,
                radius:radius},
             (old: any) => {
                if(old){
                     return unLikePost(old, unlikedPost, profile?.userid)
                    }
                })
            
        
        trpc.feed.getGeoFeed_home.cancel()
            trpc.feed.getGeoFeed_home.setInfiniteData(
                {lat: currentLocation.lat,
                lng:currentLocation.lng,
                radius:radius},
             (old: any) => {
                if(old){
                     return unLikePost(old, unlikedPost, profile?.userid)
                    }
                })
            
        trpc.feed.getActivityFeed.cancel()
            trpc.feed.getActivityFeed.setInfiniteData(
                {},
             (old: any) => {
                if(old){
                     return unLikePost(old, unlikedPost, profile?.userid)
                    }
                })
                                
        
    },
    onError: (err, variables, context) => {
        toast.error('error unliking post')
    },
    onSettled: (data, error, variables, context) => {
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

export default useUnlikePost

function unLikePost(data: any, unlikedPost: { postid: string }, userid: string) {
                
    const unliked = data.pages.flatMap((page: any) => page.posts)
                       .find((post: any) => post.postid === unlikedPost.postid)
           
            if(!unliked){
                return {...data, ...data.pages}
            }
    const likes = unliked.likes.filter((like: any) => like.user.profile.userid !== userid)

    const pages = data.pages.map((page: any) => {
                    const post = page.posts.map((post: any) => {
                        if(post.postid === unlikedPost.postid){
                            return {...post, likes_cnt: post.likes_cnt - 1, likes: likes}
                          }
                            return post
                    })
                return {...page, posts: post} 
                })
    return {...data, pages }
}