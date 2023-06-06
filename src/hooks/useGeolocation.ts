import { useEffect, useState } from "react"

interface LocationData {
    lat: number,
    lng: number
}

export const useGeolocation = () => {
   const [location, setLocation] = useState<LocationData | null>(null)
   const [isLoading, setIsLoading] = useState<boolean>(true)
    useEffect(() => {
        if (navigator.geolocation) {
           setIsLoading(true)
            const watch = navigator.geolocation.watchPosition(position => {
            
                setLocation({lat: position.coords.latitude, lng: position.coords.longitude})
            }, (error) => {
               
                setLocation({lat: 51.5074, lng: 0.1278})
            },{enableHighAccuracy: true, timeout: 50000, maximumAge: 5000}
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