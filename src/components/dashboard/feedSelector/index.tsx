import { useAtom } from 'jotai'
import React from 'react'
import { currentLocationAtom, radiusAtom } from '~/jotai/store'
import { api } from '~/utils/api'
import AdditionalOptions from '../AdditionalOptions'
import RadiusSelector from '../radiusSelector'
import FeedButton from './feedButton'

const FeedSelector = 
({ setFeed, feed }:
     {setFeed: React.Dispatch<React.SetStateAction<string>>, feed: string}) => {

  return (
    <div className="fg py-4 lg:py-8 my-2 lg:mx-1 rounded-xl pl-1md:p-2 lg:px-4 lg:m-4 relative   ">
        <div className="flex ml-2 justify-center gap-4 items-center flex-wrap md:flex-nowrap">
            <FeedButton setFeed={setFeed} feed={feed} type="following"/>
            <FeedButton setFeed={setFeed} feed={feed} type="current"/>
            <FeedButton setFeed={setFeed} feed={feed} type="home"/>
            <FeedButton setFeed={setFeed} feed={feed} type="activity"/>
        <RadiusSelector feed={feed}/>

        </div> 

        <div>

        </div>
    </div>
  )
}

export default FeedSelector