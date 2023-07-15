import { atom } from 'jotai'
import { use, useRef } from 'react'


export const FeedDirectorAtom = atom(['geo', 'getFollowerFeed']
, (get, set, arg) => {
    if(arg === 'following'){
    set(FeedDirectorAtom, ['feed', 'getFollowerFeed'])
    }
    if(arg === 'current'){
        set(FeedDirectorAtom,['geo', 'getGeoFeed_current'])
    }
    if(arg === 'home'){
        set(FeedDirectorAtom,['geo', 'getGeoFeed_home'])
    }
    if(arg === 'activity'){
        set(FeedDirectorAtom,['feed', 'getActivityFeed'])
    }
}
)

export const radiusAtom = atom(5,
    (get, set, arg) => {
        set(radiusAtom, arg)
    })

export const currentLocationAtom = atom({lat:0, lng:0})

export const whereToPostAtom = atom('Followers')



