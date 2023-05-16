import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import React from 'react'
import { api } from '~/utils/api'
import Icon from '../icon'
import Menu from '../menu'
import Notifcation from '../notifcation'
const settings = require('../menu/settings.json')

const Navbar = () => {

  const [notificationPage, setNotificationPage] = React.useState(1)

  const {data} = api?.userQuery?.getNotifcations?.useInfiniteQuery( {take:10},
    { getNextPageParam:(lastPage) => lastPage.nextCursor} )
console.log(data?.pages ,'dd')
  const notificationQueryKey = getQueryKey(api.userQuery.getNotifcations, {take:10}, 'query')
  //console.log({note:notifcations?.data?.notifcations.length})
  const ctx = api.useContext()

  return (
    <div className="sticky top-0 p-6 flex justify-around mb-8 fg">
     
      <Notifcation queryKey={notificationQueryKey}/>
        <h1 className="text-primary text-xl ">
        Social
        </h1> 
        <div className="flex gap-4">
            <Menu size={35} title='Messages' icon={"comment.svg"} items={[]} />      
            <Menu size={35} title='Notifications' icon={"bell.svg"}
             items={data?.pages[0].notifcations} queryKey={notificationQueryKey}/>
            <Menu size={35} title='Settings' icon={"setting.svg"} items={settings}/>
        </div>
    </div>
  )
}

export default Navbar