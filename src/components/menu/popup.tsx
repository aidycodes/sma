import { QueryKey } from '@tanstack/react-query'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import Item from '../navbar/notify/notifyitem'
import SettingsItem from '../navbar/settings/settingsItem'



const Popup = ({component, width = 56}: {component:React.ReactNode, width?: number}) => {


  return (
    <div  className={`absolute right-0 lg:left-0 fg w-${width}  shadow-xl rounded-md`}>
            {component}    
    </div>
        
   
  )
}

export default Popup