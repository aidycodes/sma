import { NotifyUser } from '@prisma/client'
import React, { useEffect, useRef } from 'react'
import { api } from '~/utils/api'
import Item from './item'

type Props = {
    items?: Object[]
}

const Popup = ({items} :Props) => {

    const notifcations = api?.userQuery?.getNotifcations?.useQuery()
//console.log(notifcations)
 

  return (
    <div  className="absolute fg w-56 border-primary shadow-sm rounded-md">
        {
            items && items?.map((item: any) =>(
                <Item content={item.content} type={item.type} link={item.relativeId} viewed={item.viewed} id={item.nofiy_user_id} />)
            )
        }
        {/* {
          notifcations && notifcations?.data && notifcations?.data?.notifcations &&           
            notifcations.data.notifcations.map((notification: NotifyUser) =>(
             <Item content={notification.content} type={notification.type} link={notification.relativeId} />) 
            )  
        } */}
        
        
    </div>
  )
}

export default Popup