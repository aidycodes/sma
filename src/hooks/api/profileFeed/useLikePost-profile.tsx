import { useRouter } from "next/router";
import { toast } from "react-hot-toast"
import { api } from "~/utils/api"
import useCurrentUserProfile from "../useCurrentUserProfile"

export type Cursor = {
    created_at: Date;
    postid: string;
}

const useLikePost = () => {

     const trpc = api.useContext()
     const profile = useCurrentUserProfile()
     const params = useRouter()
    const [page, profileId] = params.asPath.substr(1).split('/')

       return api.post.like.useMutation({
        onMutate: (likedPost) => {
            if(page === 'user' && profileId){
            trpc.userQuery.getUserPosts.cancel()
            trpc.userQuery.getUserPosts.setInfiniteData({id:profileId, postAmt:3},
             (old: any) => {
                if(old){  
                    const updatedPages = old.pages.map((page: any) => {
                        const updatedPosts = page.posts.map((post: any) => {
                            if(post.postid === likedPost.postid){
                                return {...post, likes_cnt: post.likes_cnt + 1,
                                    likes: [...post.likes, {user:
                                        {profile:{userid:profile.userid, userName:profile.currentUser, avatar:profile.avatar} }
                                        }]}
                            }
                            return post
                        })
                        return {...page, posts: updatedPosts}
                    })
                    const newData = {...old, pages: updatedPages}
                     return newData
                }            
        }) }
        if(page === 'dashboard'){
            trpc.feed.getFollowerFeed.cancel()
            trpc.feed.getFollowerFeed.setInfiniteData({postAmt:5}, (oldData: any) => {
                if(oldData){
                  const updatedPages = oldData.pages.map((page: any) => {
                        const updatedPosts = page.posts.map((post: any) => {
                            if(post.postid === likedPost.postid){
                                return {...post, likes_cnt: post.likes_cnt + 1,
                                    likes: [...post.likes, {user:
                                        {profile:{userid:profile.userid, userName:profile.currentUser, avatar:profile.avatar} }
                                        }]}
                            }
                            return post
                        })
                        return {...page, posts: updatedPosts}
                    })
                    const newData = {...oldData, pages: updatedPages}
                     return newData
                }
            })
        }
    },
        onError: (err, variables, context) => {
            trpc.userQuery.getUserPosts.invalidate()
            trpc.feed.getFollowerFeed.invalidate()
            toast.error('Error liking post')
        },
        onSuccess: (data, variables, context) => {
            trpc.userQuery.getUserPosts.invalidate()
            trpc.feed.getFollowerFeed.invalidate()
        }
    })
}

export default useLikePost
