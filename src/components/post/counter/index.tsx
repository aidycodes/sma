

const PostCounter = ({ likes_cnt, comment_cnt, userLikes}:
    {likes_cnt:number, comment_cnt: number, userLikes: boolean}) => (

<div className="px-6 pt-6 pb-2 flex ">
                <div>{!userLikes ? `${likes_cnt} like${likes_cnt < 2 && likes_cnt > 0 ? '' : 's'}`:
                    likes_cnt === 1 ? `You like this post` :
                    likes_cnt === 2 ? `You and 1 person like this post` :
                 `You and ${likes_cnt} people like this post`} </div>
                <div className="ml-auto">{comment_cnt} comments</div>  
    </div>
     )

export default PostCounter
   
   
