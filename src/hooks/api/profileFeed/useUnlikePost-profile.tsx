import { api } from '~/utils/api'
import { useRouter } from "next/router";
import { toast } from "react-hot-toast"
import useCurrentUserProfile from '../useCurrentUserProfile'
import { useAtom } from "jotai";
import { currentLocationAtom, FeedDirectorAtom } from "~/jotai/store";

const useUnlikePost = () => {

    const trpc = api.useContext()
    const profile = useCurrentUserProfile()
    const params = useRouter()
    const [page, profileId] = params.asPath.substr(1).split('/')
    const [ [type, procedure] ] = useAtom(FeedDirectorAtom)
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
    if(page === 'dashboard' && type !== 'geo'){     
        trpc.feed.getFollowerFeed.cancel()
             trpc.feed.getFollowerFeed.setInfiniteData({postAmt:5},
             (old: any) => {
                if(old){            
            return unLikePost(old, unlikedPost, profile?.userid)       
        }})
    
    }
    if(page === 'dashboard' && type === 'geo' && currentLocation){
        trpc.feed.getGeoFeed_current.cancel()
            trpc.feed.getGeoFeed_current.setInfiniteData(currentLocation, (old: any) => {
                if(old){
                     return unLikePost(old, unlikedPost, profile?.userid)
                    }
                })
            }
    },
    onError: (err, variables, context) => {
        trpc.userQuery.getUserPosts.invalidate()
        trpc.feed.getFollowerFeed.invalidate()
    },
    onSettled: (data, error, variables, context) => {
        trpc.userQuery.getUserPosts.invalidate()
        trpc.feed.getFollowerFeed.invalidate()
    }
})
 

}

export default useUnlikePost

function unLikePost(data: any, unlikedPost: { postid: string }, userid: string) {
                const unliked = data.pages.flatMap((page: any) => page.posts)
                       .find((post: any) => post.postid === unlikedPost.postid)
                        .likes.filter((like: any) => like.user.profile.userid !== userid)
                       
            const pages = data.pages.map((page: any) => {
                    const post = page.posts.map((post: any) => {
                        if(post.postid === unlikedPost.postid){
                            return {...post, likes_cnt: post.likes_cnt - 1, likes: unliked}
                          }
                            return post
                    })
                return {...page, posts: post} 
                })
    return {...data, pages }
}