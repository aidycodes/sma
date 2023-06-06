import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import { api } from '~/utils/api'
import useCurrentUserProfile from '../useCurrentUserProfile'

const usePostComment = (postid: string) => {

    const trpc = api.useContext()
    const { avatar, username, userid } = useCurrentUserProfile()
    const params = useRouter()
    const [page, profileId] = params.asPath.substr(1).split('/')

     return api.comment.new.useMutation({
        onMutate: async (data) => {
            if(page === 'user' && profileId){
            trpc.userQuery.getUserPosts.cancel()
            trpc.userQuery.getUserPosts.setInfiniteData({id:profileId, postAmt:3}, (oldData: any) => {
       
          const updatedData = oldData?.pages.map((page: any) => {
                    const pages = page?.posts.map((post: any) => {
                        if(post.postid === postid) {
                            return {...post, comment_cnt:post.comment_cnt+1, comments:[...post.comments, {...data, commentid:'opitmistic',
                             likes_cnt:0, likes:[], 
                             created_at:new Date(),
                             updated_at: new Date(),
                             user:{profile:{avatar:avatar, username:username, userid:userid}},
                             userid:userid
                            }]}
                        }
                         return post
                        })
                        return {...page, posts:pages}
                        })
              
              return {...oldData, pages:updatedData}
                    }) 
                }
            if(page === 'dashboard'){
            trpc.feed.getFollowerFeed.cancel()
            trpc.feed.getFollowerFeed.setInfiniteData({postAmt:5}, (oldData: any) => {
          console.log('dkdk')
                const updatedData = oldData?.pages.map((page: any) => {
                    const pages = page?.posts.map((post: any) => {
                        if(post.postid === postid) {
                            return {...post, comment_cnt:post.comment_cnt+1, comments:[...post.comments, {...data, commentid:'opitmistic',
                             likes_cnt:0, likes:[], 
                             created_at:new Date(),
                             updated_at: new Date(),
                             user:{profile:{avatar:avatar, username:username, userid:userid}},
                             userid:userid
                            }]}
                        }
                         return post
                        })
                        return {...page, posts:pages}
                        })

              return {...oldData, pages:updatedData}
                    }) 
                }
                     
            },
            onError: () => {
                toast.error('error creating comment')
                trpc.userQuery.getUserPosts.invalidate({id:profileId, postAmt:3})
                trpc.feed.getFollowerFeed.invalidate({postAmt:3})
            },
            onSuccess: () => {
             trpc.userQuery.getUserPosts.invalidate({id:profileId, postAmt:3})
             trpc.feed.getFollowerFeed.invalidate({postAmt:3})
            }
})
 
}

export default usePostComment