import React from 'react'
import { toast } from 'react-hot-toast'
import Icon from '~/components/icon'

const PostSettings = () => {
  return (
    <div className="flex flex-col gap-2 w-40  border-primary shadow-xl cursor-pointer "
        onClick={() => toast.success('Post reported!')}>
     <div className="fg p-4 hover:backdrop-brightness-150">
      Report Post
      </div>
    </div>
  )
}

export default PostSettings