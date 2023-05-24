import { GeoUser } from '@prisma/client'
import { useTheme } from 'next-themes'
import React from 'react'
import LoadingSpinner from '~/components/loadingspinner'
import LocationItem from './locationItem'

const DisplayLocation = ( { data, isLoading, type }: {data: GeoUser | undefined , isLoading: boolean, type: string} ) => {

  const { theme } = useTheme()

  if(isLoading) return (
    <div className={`flex flex-col   shadow-xl ${theme === 'light' || theme === 'lightFix' ? 'highlight-1 sticky-content text-slate-700' :
       theme === 'dark' || theme === 'darkFix' ? 'highlight-1 sticky-content-dark' :
       theme === 'dark-blue' || theme === 'dark-blueFix' ? 'highlight-1 border-blue-600 border-2 px-[62px] py-[32px]' :
       'highlight sticky-content'}
         w-fit  rounded-lg p-12  `}><LoadingSpinner/></div>
  )
  if(!data) return (
     <div className={`flex flex-col   shadow-xl ${theme === 'light' || theme === 'lightFix' ? 'highlight-1 sticky-content text-slate-700' :
       theme === 'dark' || theme === 'darkFix' ? 'highlight-1 sticky-content-dark' :
       theme === 'dark-blue' || theme === 'dark-blueFix' ? 'highlight-1 border-blue-600 border-2 ' :
       'highlight sticky-content'}
         p-2 w-fit  rounded-lg   `}>
        <div className="flex justify-center items-center flex-col"> 
          <h2>Current Location:</h2>
          <p>Cannot Access current locations </p>
          <p>Please Enable Location Settings</p>
        </div>
        </div>
          )



  //data loaded

      const usersGeoData = Object.values(data).map((keys => (geoData, index) => {
        return geoData &&
      <div key={keys[index]}>
        <LocationItem key={keys[index]} value={geoData} type={keys[index]} /> 
      </div>
    })(Object.keys(data))).slice(4)

  return (
      <div className={`flex flex-col   shadow-xl ${theme === 'light' || theme === 'lightFix' ? 'highlight-1 sticky-content text-slate-700' :
       theme === 'dark' || theme === 'darkFix' ? 'highlight-1 sticky-content-dark' :
       theme === 'dark-blue' || theme === 'dark-blueFix' ? 'highlight-1 border-blue-600 border-2 ' :
       'highlight sticky-content'}
         p-2 w-fit  rounded-lg   `}>
            <h2 className="font-semibold tracking-widest pb-2 ">{type} Location</h2>
            {  usersGeoData.length > 2 ?
            usersGeoData
            :
            <div>No location added</div>
            }
        
    </div>
  )
}

export default DisplayLocation