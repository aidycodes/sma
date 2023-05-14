import { NotifyUser } from '@prisma/client'
import Image from 'next/image'
import React, { useEffect, useRef } from 'react'
import { api } from '~/utils/api'
import Item from './item'
import SettingsItem from './settingsItem'

type Props = {
    title: string
    items: Object[]
}

const Popup = ({items, title} :Props) => {


  return (
    <div  className="absolute right-0 lg:left-0 fg w-56 border-primary shadow-sm rounded-md">
        
        
        <div>
            <h2 className="text-lg  p-2 border-b-1 border-primary-bottom shadow-sm">{title}</h2>
        </div>
        <div className="pt-2 max-h-60 overflow-hidden overflow-y-auto">
        {
            items?.length > 0 ?
            title === 'Notifications' ?
                 items?.map((item: any) =>(
              <Item content={item.content} type={item.type} link={item.relativeId} 
                viewed={item.viewed} id={item.nofiy_user_id}           
                />))
         
        :
        
            title === 'Settings' &&
             items?.map((item: any) => (
                <SettingsItem content={item.content}  link={item.relativeId} 
                icon={item.icon || false} expandable={item.expandable || false}
                />
            ))

        : 

            <div className="p-4 flex justify-center items-center flex-col">
                <h4>No {title}</h4>
                <Image className="opacity-60" src='icons/comment-alt-message.svg' width={100} height={100} alt='logo' />
            </div>

          
        }
        </div>
        
    </div>
  )
}

export default Popup