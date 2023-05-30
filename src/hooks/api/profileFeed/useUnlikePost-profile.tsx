import { api } from '~/utils/api'
import useCurrentUserProfile from '../useCurrentUserProfile'

const useUnlikePost = (profileId: string) => {

    const trpc = api.useContext()
      const profile = useCurrentUserProfile()

    return  api.post.unlike.useMutation({
        onMutate: (unlikedPost) => {
            trpc.userQuery.getUserPosts.cancel()
             trpc.userQuery.getUserPosts.setInfiniteData({id:profileId, postAmt:3},
             (old: any) => {
                if(old){
                   
                 
            const post =  old.pages.flatMap((page: any) => page.posts)
                       .find((post: any) => post.postid === unlikedPost.postid)
                       
                    
                 console.log({old})   
                   //const post = old.posts.find((post: any) => post.postid === unlikedPost.postid)

                    const unliked = post.likes.filter((like: any) => like.user.profile.userid !== profile?.userid)
                   //return {...old, pages: 
                       const wtf =     old.pages.map((page: any) => {
                       const post = page.posts.map((post: any) => {
                          if(post.postid === unlikedPost.postid){
                            return {...post, likes_cnt: post.likes_cnt - 1, likes: unliked}
                          }
                          return post
                    })
                            return {...page, posts: post}
                   
                })
                    console.log({wtf})
                return {...old, pages: wtf}
               
        }})
    },
    onError: (err, variables, context) => {
        trpc.userQuery.getUserPosts.invalidate()
    },
    onSettled: (data, error, variables, context) => {
        trpc.userQuery.getUserPosts.invalidate()
    }
})
 

}

export default useUnlikePost