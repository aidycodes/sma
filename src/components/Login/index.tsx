import React from 'react'
import SignIn from './signin'
import SignUp from './signup'

export type Flipper = {
    setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>
}


const Login = ({ isFlipped = true, setIsFlipped }:
   {isFlipped: boolean, setIsFlipped: React.Dispatch<React.SetStateAction<boolean>> }) => {

  return (
    <div className="flex min-h-[70vh] flex-col justify-center ">
        <div className="group h-[500px] w-96 [perspective:1000px] mx-auto">
            <div className={`relative h-full w-full rounded-xl form-bg shadow-2xl transition-all border-[1px] border-gray-300
             duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'}   `}>
               <div className="absolute insert-0 w-full">
                    
                    <SignUp setIsFlipped={setIsFlipped}/>        
                </div> 
                <div className="absolute inset-0 h-full w-full rounded-xl  form-bg  border-[1px] border-gray-300 shadow-2xl  [transform:rotateY(180deg)] [backface-visibility:hidden]">
                        <SignIn setIsFlipped={setIsFlipped}/>
                </div>
            </div>
        </div>
     
        
    </div>
  )
}

export default Login