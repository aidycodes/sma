import React from 'react'

const ContactListSkell = () => {
  return (
   <div className={`flex border-primary text-secondary  hover:backdrop: flex-wrap md:flex-nowrap items-center justify-center md:justify-start p-2 md:gap-4 gap-2 cursor-pointer hover:md:backdrop-brightness-150` }>
      <div className={`h-24 w-24 md:w-40 md:h-16 lg:h-20 relative rounded-[100px]  cursor-pointer skeleton-box opacity-60  `}>
           <div className="rounded-[50px] p-2" />
        </div>
        <div className="text-xl hidden w-full md:flex flex-col h-[100px] justify-center ">
            <h2 className="relative skeleton-box w-[140px] h-[16px] rounded-xl opacity-60"></h2>
            <h2 className=" lg:w-[200px] w-[140px] h-[8px] mt-2 skeleton-box rounded-xl opacity-60 whitespace-nowrap top-8 text-sm self-center hidden md:block overflow-hidden text-ellipsis  ">  </h2>
        
        </div>
        
 
    </div>
  )
}

export default ContactListSkell


