import { useAtom } from 'jotai'
import React from 'react'
import { FeedDirectorAtom, whereToPostAtom } from '~/jotai/store'

const PostTypeComponent = () => {

    const [, setPostType] = useAtom(whereToPostAtom)

  return (
    <div className="w-[180px] fg">
        <div className="py-2 px-6 text-lg hover:backdrop-brightness-200 cursor-pointer"
                  onClick={() => setPostType('Followers')}
        >Followers</div>
           <hr className="border-gray-600 w-[90%] mx-auto"/>
        
        <div className="py-2 px-6 text-md hover:backdrop-brightness-200 cursor-pointer"
                 onClick={() => setPostType('Local Area')}
        >Local Area</div>
          <hr className="border-gray-600 w-[90%] mx-auto"/>
        
        <div className="py-2 px-6 text-md hover:backdrop-brightness-200 cursor-pointer"
                onClick={() => setPostType('Current Location')}
        >Current Location</div>
    </div>
  )
}

export default PostTypeComponent