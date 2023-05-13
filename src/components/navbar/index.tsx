import React from 'react'
import { api } from '~/utils/api'
import Icon from '../icon'
import Menu from '../menu'
import settings from '../menu/settings'

const Navbar = () => {

  const notifcations = api?.userQuery?.getNotifcations?.useQuery()

  return (
    <div className="sticky top-0 p-6 flex justify-around mb-8 fg">
        <h1 className="text-primary text-xl ">
        Social
        </h1> 
        <div className="flex gap-4">
            <Menu size={35} icon={"comment.svg"} />      
            <Menu size={35} icon={"bell.svg"} items={notifcations?.data?.notifcations}/>
            <Menu size={35} icon={"setting.svg"} items={settings}/>
        </div>
    </div>
  )
}

export default Navbar