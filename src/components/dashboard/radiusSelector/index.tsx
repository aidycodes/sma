import { useAtom } from 'jotai'
import React from 'react'
import { FeedDirectorAtom, radiusAtom } from '~/jotai/store'
import { api } from '~/utils/api'

const RadiusSelector
 = ( { feed }: { feed: string} ) => {

    const [, setRadius ] = useAtom(radiusAtom)
    const context = api.useContext()
    const handleRadius = (radius: string) => {
            if(feed === 'current'){
             setRadius(+radius)
             context.feed.getGeoFeed_current.reset()
            }
            if(feed === 'home'){
                setRadius(+radius)
                context.feed.getGeoFeed_home.reset()
            }   
        }

  return (
            <div className="md:ml-auto">
           <div className={`flex flex-col items-center mt-auto   md:mr-4 md:mb-8 md:mt-2 lg:mr-2 ${feed === 'follower' || feed === 'activity' ? 'opacity-30 blur-[2px]' : 'opacity-100'}`}>
             <label className="opacity-60" htmlFor="distance">Distance</label>
            <select onChange={(e) => handleRadius(e.target.value)} name='distance' className={`rounded-xl p-1 text-black bg-zinc-500 ${feed === 'follower' || feed === 'activity' ? 'cursor-default' :  'cursor-pointer'} }`} 
                    disabled={feed === 'follower' || feed === 'activity'}>             
            <option className="text-black font-semibold rounded-md" value={5}>5 Miles</option>
            <option className="text-black font-semibold rounded-md" value={10}>10 Miles</option>
            <option className="text-black font-semibold rounded-md"  value={20}>20 Miles</option>
            <option className="text-black font-semibold rounded-md" value={50}>50 Miles</option>
            </select>
        </div>
        
        </div>
  )
}

export default RadiusSelector
