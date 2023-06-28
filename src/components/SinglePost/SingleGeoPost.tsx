import React from 'react'
import { api } from '~/utils/api'
import PostItem from '../post'

const SingleGeoPost = ({postid, commentid}: {postid?: string, commentid?: string}) => {

    const { data, isLoading, isError } = api.geoPost.getPost.useQuery({postid:postid})
    const { data: userData, isLoading: userLoading, isError: userError } = api.userQuery.getUserProfile.useQuery()
    if(isLoading || userLoading) return <div>loading</div>
    if(isError || userError) return <div>error</div>
    if(!data?.post) return <div>no post...!!!!xlkjkljkljkl</div>

  return (
    <div>
      <PostItem {...data?.post} user={userData?.user} showAllComments={true} commentRef={commentid && commentid} />
  </div>
  )
}

export default SingleGeoPost