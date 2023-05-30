import Image from 'next/image'
import React from 'react'
import LoadingSpinner from '../loadingspinner'

type Props = {
    isLoading?: boolean
    onClick?: () => void
    label: string
    type?: 'submit' | 'button'
    isTrue?: boolean
    icon?: string

}

const ProfileButton = 
    ({isLoading = false,label, onClick, isTrue = false, icon  }: Props) => {

        const decrorateOnClick = (fn: typeof onClick ) => {
            return (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                e.preventDefault()
                e.stopPropagation()
                if(fn){
              
                fn()
                }
            }   
        }

        const safeOnClick = decrorateOnClick(onClick)

  return (
     <button disabled={isLoading} onClick={(e) => onClick && safeOnClick(e)}
        className={` w-32 p-2 rounded-md cursor-pointer ${!isTrue ?  'text-slate-300 hover:text-slate-200 bg-blue-700 hover:bg-blue-600' : 
            'text-white bg-transparent hover:border-blue-500 border-blue-700 border-2'} 
                    ${isLoading && 'opacity-80'}`}  >
            <div className='flex justify-center relative'>
                {isLoading ?  <div className="flex items-center gap-4"><LoadingSpinner size="small"/></div>
                :
                <div className="flex gap-2">
                {icon && 
                <Image src={icon} width={20} height={20} alt="icon" />
                }
                <div>{label}</div>
                </div>
                }
            </div>
     </button>

  )
}

export default ProfileButton