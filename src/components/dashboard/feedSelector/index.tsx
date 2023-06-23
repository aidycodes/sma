import { useAtom } from 'jotai'
import React from 'react'
import { currentLocationAtom, radiusAtom } from '~/jotai/store'
import { api } from '~/utils/api'
import FeedButton from './feedButton'

const FeedSelector = 
({ setFeed, feed }:
     {setFeed: React.Dispatch<React.SetStateAction<string>>, feed: string}) => {

        const context = api.useContext()
        const [, setRadius] = useAtom(radiusAtom)
        const [CL, currentLocation ] = useAtom(currentLocationAtom)
console.log({CL})
        const handleRadius = (radius: string) => {
             setRadius(+radius)
             context.feed.getGeoFeed_current.reset()   
        }
        console.log(feed)
  return (
    <div className="fg py-4 lg:py-8 my-2 lg:mx-1 rounded-xl pl-1md:p-2 lg:px-4 lg:m-4   ">
        <div className="flex ml-2 justify-center gap-4 items-center flex-wrap md:flex-nowrap">
            <FeedButton setFeed={setFeed} feed={feed} type="following"/>
            <FeedButton setFeed={setFeed} feed={feed} type="current"/>
            <FeedButton setFeed={setFeed} feed={feed} type="home"/>
            <FeedButton setFeed={setFeed} feed={feed} type="activity"/>
     
        <div className="md:ml-auto">
           <div className={`flex flex-col items-center mt-auto   md:mr-8 md:mb-8 ${feed === 'following' || feed === 'activity' && 'opacity-30'}`}>
             <label htmlFor="distance">Distance</label>
            <select onChange={(e) => handleRadius(e.target.value)} name='distance' className={`rounded-xl p-2 text-black bg-gray-400`} disabled={feed === 'following' || feed === 'activity'}>             
            <option className="text-black font-semibold rounded-md" value={5}>5 Miles</option>
            <option className="text-black font-semibold rounded-md" value={10}>10 Miles</option>
            <option className="text-black font-semibold rounded-md"  value={20}>20 Miles</option>
            <option className="text-black font-semibold rounded-md" value={50}>50 Miles</option>
            </select>
        </div>
        
        </div>
        </div> 
        <div>

        </div>
    </div>
  )
}

export default FeedSelector