   
   import React from 'react'
   
const PostCounter = ({ likes_cnt, comment_cnt}:
    {likes_cnt:number, comment_cnt: number}) => (

<div className="px-6 pt-6 pb-2 flex ">
                <div>{likes_cnt} likes</div>
                <div className="ml-auto">{comment_cnt} comments</div>  
    </div>
     )

export default PostCounter
   
   
