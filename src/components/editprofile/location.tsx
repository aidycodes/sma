import React, { useEffect } from 'react'
import { useGeolocation } from '~/hooks/useGeolocation'


const fetchReverseGeocode = async (lat: number, lng: number) => {
    const res = await fetch('/api/reversegeocode', {
               method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({lat, lng})
                })
                .then(res => res.json())
                .then(data => {
                    return data
                })
                console.log(res)
            }

type LocationInfomation = {
    city: string
    country: string
    county: string
    state: string
}            

const Location = () => {

    const [locationInfomation, setLocationInfomation] = React.useState<LocationInfomation | null>(null)

    const location = useGeolocation()
    console.log(location)

    const goecode = () => {
        if (location) {
          const Linfo = fetchReverseGeocode(location?.lat, location?.lng) 
            setLocationInfomation(Linfo)
        }
    }
console.log({locationInfomation})
  return (
     <div className="fg p-8 rounded-md shadow-md mt-12">
        <h1 className="text-center pb-4 font-semibold tracking-widest">Location</h1>
        <h2 className="font-semibold tracking-widest pb-4">Current Location</h2>
        <div className="flex flex-col gap-4">
            <h2 className="font-semibold tracking-widest pb-4">city</h2>
            <input className="rounded-md p-1 outline-none" value={locationInfomation?.city} />
            <h2 className="font-semibold tracking-widest pb-4">Longitude</h2>
            <input className="rounded-md p-1 outline-none" value={location?.lng} />
            <button className="outline rounded-md p-1 cursor-pointer" 
            onClick={() => location && fetchReverseGeocode(location?.lat, location?.lng)} >Location</button>
            </div>

    </div>
  )
}

export default Location