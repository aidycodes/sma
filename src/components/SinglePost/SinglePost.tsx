import React from 'react'
import { api } from '~/utils/api'
import PostItem from '../post'

const SinglePost = ({postid, commentid}: {postid?: string, commentid?: string}) => {

    const { data, isLoading, isError } = api.post.getPost.useQuery({postid:postid})
  
    if(isLoading) return <div>loading</div>
    if(isError) return <div>error</div>
    if(!data?.post) return <div>no post</div>

  

  return (
    <div>
      <PostItem {...data?.post} user={data?.post.user} showAllComments={true} commentRef={commentid && commentid} />
  </div>
  )
}

export default SinglePost