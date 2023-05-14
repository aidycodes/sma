import React from 'react'
import { api } from '~/utils/api'
import Icon from '../icon'
import Menu from '../menu'
const settings = require('../menu/settings.json')

const Navbar = () => {

  const notifcations = api?.userQuery?.getNotifcations?.useQuery()
  console.log(settings)

  return (
    <div className="sticky top-0 p-6 flex justify-around mb-8 fg">
        <h1 className="text-primary text-xl ">
        Social
        </h1> 
        <div className="flex gap-4">
            <Menu size={35} title='Messages' icon={"comment.svg"} items={[]} />      
            <Menu size={35} title='Notifications' icon={"bell.svg"} items={notifcations?.data?.notifcations}/>
            <Menu size={35} title='Settings' icon={"setting.svg"} items={settings}/>
        </div>
    </div>
  )
}

export default Navbar