import { atom, useAtom } from 'jotai'

export const FeedDirectorAtom = atom(['geo', 'getGeoFeed_current']
, (get, set, arg) => {
    set(FeedDirectorAtom, arg)
}
)

export const currentLocationAtom = atom({lat:0, lng:0})
