import Image from 'next/image'
import React from 'react'
import { DetailedGeoUser } from '~/server/api/routers/geocoding'
import { Bai_Jamjuree } from 'next/font/google'
import Loading from '~/components/loading'
import LoadingSpinner from '~/components/loadingspinner'

const bai = Bai_Jamjuree({
    subsets: ['latin'],
  weight: '300',
  style: 'normal',
})

type LocationDisplayProps = {
    streetName?: string | null
    city?: string | null
    country?: string | null
    state?: string | null
    zipcode?: string | null
    isLoading: boolean
    isGeo: boolean
    disable: React.Dispatch<React.SetStateAction<boolean>>
}

const LocationDisplay = 
(props: LocationDisplayProps ) => {
    const { streetName, city, country,
         state, zipcode, isLoading, isGeo, disable } = props

    if (!isGeo) return (
          <div className="flex mt-2    items-center text-lg rounded-xl lg:w-[90%]  ">
            <Image className="hover:brightness-150 cursor-pointer" 
                src="/icons/cross.svg" width={20} height={20} alt="pin" onClick={() => disable(true)}/>
              <span className={`${bai.className} text-sm`}>Current Location:</span>
            <span className={`${bai.className} text-sm`}>Please enable your location settings to use this service</span>
          </div>
    )
 
  return (
    <div className="flex  items-center  rounded-xl lg:w-[90%] text-sm ">
        <Image src="/icons/location-point.svg" width={20} height={20} alt="pin" />
        <span className={`${bai.className}`}>Current Location:</span>
       
        
        : <div className="text-center lg:flex text-sm ">
            <span className={`${bai.className} hidden lg:block`}>{streetName} </span>
            <span className={`${bai.className}`}>{city} </span>
            <span className={`${bai.className}`}>{state} </span>
            <span className={`${bai.className}`}>{country} </span>
            <span className={`${bai.className}`}>{zipcode} </span>
                  
        </div>

    </div>
  )
}

export default LocationDisplay