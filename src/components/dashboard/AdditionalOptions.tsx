import Image from 'next/image'
import React from 'react'
import RadiusSelector from './radiusSelector'

const AdditionalOptions = () => {
    const [ownPostsOnly, setOwnPostsOnly] = React.useState(false)
     const [showOptions, setShowOptions] = React.useState(false)
     const [show, setShow] = React.useState(false)
     

    React.useEffect(() => {
      if(showOptions){
        setTimeout(() => {
          setOwnPostsOnly(true)
        }, 1000)
        setTimeout(() => {
          setShow(true)
        }, 800)

      }
  },[ showOptions])
      const handleShowOptions = () => {
        setShowOptions(!showOptions)
        if(showOptions){
        setOwnPostsOnly(false)
         setShow(false)
        }
      }

  
  return (
    <div className="flex justify-end transition-all mb-2  ml-2 w-full top-[-500px] left-[-950px] ">
  
    <div className={`flex fg h-[60px] shadow-xl  rounded-xl duration-1000  transition-all ${showOptions ? 'w-full sm:w-[500px] md:w-[550px] lg:w-[550px] h-[700px]' : 'w-[60px]'}  `}>
      <div className="flex items-center justify-center text-xs hover:brightness-125">
      <Image src="/icons/angle-left.svg" 
      width={60} height={60} 
      onClick={() => handleShowOptions()} className={`cursor-pointer transition-all rotat-90 ${showOptions && 'rotate-180'  }`} alt="expand"/>
        </div>
        {showOptions &&
        <div className={`pl-8 flex items-center transition-all duration-1000 ml-auto mr-4 justify-around w-full ${ !ownPostsOnly ? 'opacity-0' : 'opacity-100'} ${ !show ? 'hidden' : 'flex'}`}>
      
          <div>
            <input className="rounded-xl pl-3 pr-2 py-1" placeholder="search Feed by username"/>
          </div> 
          <div>
            <input className="rounded-xl pl-3 pr-2 py-1" placeholder="search Feed by location"/>
          </div>
        </div>
      
}
    </div>
    </div>

  )
}

export default AdditionalOptions