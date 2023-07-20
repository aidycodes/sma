import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { currentLocationAtom } from "~/jotai/store"

interface LocationData {
    lat: number,
    lng: number
}

export const useGeolocation = () => {
   const [location, setLocation] = useState<LocationData | null>(null)
   const [isLoading, setIsLoading] = useState<boolean>(true)
   const [LA, setLocationAtom] = useAtom(currentLocationAtom)

    useEffect(() => {
        if (navigator.geolocation) {
           setIsLoading(true)
            const watch = navigator.geolocation.watchPosition(position => {
     
                setLocation({lat: position.coords.latitude, lng: position.coords.longitude})
                setLocationAtom({lat: position.coords.latitude, lng: position.coords.longitude})
            }, (error) => {              
            },{enableHighAccuracy: false, timeout: 50000, maximumAge: 5000}
            )
            setIsLoading(false)
                 return () => {
                    navigator.geolocation.clearWatch(watch)
                    }
        }            
    }, [])

   
    if(location){
        
           return {lat:location.lat, lng:location.lng, isLoading}
    } else {
        return {lat: 0, lng:0, isLoading}
    }
}

