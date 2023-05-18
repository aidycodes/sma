import { useEffect, useState } from "react"

interface LocationData {
    lat: number,
    lng: number
}

export const useStaticGeoLocation = () => {
   const [location, setLocation] = useState<LocationData | null>(null)
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                //console.log(position)
                setLocation({lat: position.coords.latitude, lng: position.coords.longitude})
            }, (error) => {
                console.log({error, message: 'geolocation error'})
                setLocation({lat: 51.5074, lng: 0.1278})
            },{enableHighAccuracy: true, timeout: 20000, maximumAge: 1000})
        } 
    }, [])

    return location
}