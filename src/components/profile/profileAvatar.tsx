import Image from 'next/image'
import React from 'react'

const ProfileAvatar = ({ avatar }: { avatar?: string | null}) => {
  return (
        <div className="flex justify-center xl:inline-block lg:pl-40 xl:pl-24 2xl:pl-48 ">
      <div className="absolute bottom-[-100px]   w-[200px] h-[200px] outline outline-primary rounded-[50%] z-10
            xl-w[100px]
      ">
            <Image className="rounded-[50%]" fill 
                alt="user avatar" src={avatar ? avatar : '/icons/user.svg'}/>
                
    </div>
          {/* <div className="absolute bottom-[-130px]   w-full h-[130px] z-0 "> */}
            
                {/* </div> */}
    <div>
        
            </div>
        </div>
   
    
  )
}

export default ProfileAvatar