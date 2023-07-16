import { getQueryKey } from '@trpc/react-query'
import React from 'react'
import { api } from '~/utils/api'
import { ScrollRef } from '../chat/chatbox'
import Menu from '../menu'
import Notifcation from '../notifcation'
import ChatNotifications from './chatNotification'
import Notify from './notify'
import SettingsMenu from './settings'

const Navbar = () => {

  const notificationQueryKey = getQueryKey(api.userQuery.getNotifcations, {take:10}, 'query')

  return (
    <div className="fixed w-full top-0 p-6 flex justify-around mb-8 fg z-50">
   
      <Notifcation queryKey={notificationQueryKey}/>
        <h1 className="text-primary text-xl ">
        Social
        </h1> 
        <div className="flex gap-4">
           <label htmlFor='Messages'/>
            <Menu size={35} icon={"comment.svg"} component={<ChatNotifications/>}/>      
             <label htmlFor='Notifications'/>
            <Menu size={35} icon={"bell.svg"} component={<Notify/>}/>
            <label htmlFor='settings'/>
            <Menu size={35}  icon={"setting.svg"} component={<SettingsMenu/>}/>

          </div>
       
    </div>
  )
}

export default Navbar