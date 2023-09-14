import React from 'react'
import Notifcation from '../../notifcation'

const LoggedOutNav = () => {
  return (
     <div className="fixed w-full top-0 p-4 lg:p-6 flex justify-around mb-8 shadow-xl fg z-50 ">
   
      <Notifcation />
      <div className=" flex justify-around w-full">
        <div className="text-primary font-semibold text-xl mr-auto flex gap-2 items-center">
          Social Media App
        </div>
     </div>
    </div>
  )
}

export default LoggedOutNav