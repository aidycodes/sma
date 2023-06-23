import { useAtom } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { createPortal } from 'react-dom'
import useCurrentUserProfile from '~/hooks/api/useCurrentUserProfile'
import { FeedDirectorAtom } from '~/jotai/store'
import CreatePostPopup from './popup'


const placeHolderHelper = (feed: string) => {
  switch(feed){
    case 'getGeoFeed_current':
      return 'Create a post to your current location...'
    case 'getGeoFeedPrimaryLocation':
      return 'Create a post to your local area...'
  case 'getFollowerFeed':
     return 'Create a post to your followers...'
     default: return 'Create a post'
  }
}

const CreatePost = () => {

  const profile = useCurrentUserProfile()
  const [ currentFeed ] = useAtom(FeedDirectorAtom)
  const [popup, setPopup] = React.useState(false)
  const [options, setOptions] = React.useState(false)

  const handlePopup = (options: boolean) => {
    setPopup(!popup)
    setOptions(options)
  }

  return (
    <div className='flex flex-col h-[200px]  justify-center items-center gap-4 fg mx-1 rounded-xl pl-1 md:m-4 md:p-2 lg:px-8 lg:pt-2 '>
    <div className="flex items-center justify-center w-full gap-2 m-2">
    <Link href={`/user/${profile?.userid}`} passHref shallow={true}>
      <div className="relative h-14 w-14 lg:h-16 lg:w-16 box-shadow-md rounded-[100px] ">
        <Image className="rounded-[100px] " src={profile?.avatar ? profile?.avatar : '/icons/user.svg'} fill alt="user" />
      </div>
    </Link>
      <div className="h-12 rounded-[100px] cursor-pointer fakeTextBox flex-grow px-4 resize-none focus:h-36 transition-all duration-500 flex items-center"
        onClick={() => handlePopup(false)}>
        <span>{currentFeed[1] && placeHolderHelper(currentFeed[1])}</span>
      </div>
    </div>
    <hr className="border-gray-600 w-full"/>
    <div className="flex items-center p-2 justify-around w-full lg:justify-between" >
      <div className="flex rounded-xl backdrop-brightness-150m cursor-pointer hover:brightness-125 " onClick={() => handlePopup(true)}>
        <Image src="/icons/image.svg" width={24} height={24} alt="image" />
        <button className=" rounded-xl p-2 text-white">Add Image</button>
      </div>
        <div className="flex rounded-xl backdrop-brightness-150m cursor-pointer  hover:brightness-125 " onClick={() => { handlePopup(true) }}>
        <Image src="/icons/smile-beam.svg" width={24} height={24} alt="image"  />
        <button className=" rounded-xl p-2 text-white">Add Feeling</button>
      </div>
    </div>
   {   popup && createPortal(
    <CreatePostPopup setPopup={setPopup} options={options}/>
   , document.body)
  }
    </div>
  )
}

export default CreatePost