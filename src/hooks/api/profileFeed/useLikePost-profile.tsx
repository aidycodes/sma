import { toast } from "react-hot-toast"
import { api } from "~/utils/api"
import useCurrentUserProfile from "../useCurrentUserProfile"

export type Cursor = {
    created_at: Date;
    postid: string;
}

const useLikePost = (profileId: string ) => {

     const trpc = api.useContext()
     const profile = useCurrentUserProfile()


       return api.post.like.useMutation({
        onMutate: (likedPost) => {
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
        })},
        onError: (err, variables, context) => {
            trpc.userQuery.getUserPosts.invalidate()
            toast.error('Error liking post')
        },
        onSuccess: (data, variables, context) => {
            trpc.userQuery.getUserPosts.invalidate()
        }
    })
}

export default useLikePost

/*
                const updatedposts = old.pages.map((post: any) => {
                        console.log({post})
                        return post.posts.map((post: any) => {
                            console.log({post}, 'ssss')
                        if(post.postid === likedPost.postid){
                            return {...post, likes_cnt: post.likes_cnt + 1, 
                                likes: [...post.likes, {user:
                                                        {profile:{userid:profile.userid, userName:profile.currentUser, avatar:profile.avatar}}
                                                         }]}
                        }
                        return post
                    })
                    }) */