import React from 'react'
import LoadingSpinner from '../loadingspinner'

type Props = {
    isLoading?: boolean
    onClick?: () => void
    label: string
    type?: 'submit' | 'button'

}

const ProfileButton = 
    ({isLoading = false,label, onClick  }: Props) => {
  return (
     <button disabled={isLoading} onClick={() => onClick && onClick()}
        className={`bg-blue-700 w-32 p-2 rounded-md cursor-pointer  text-slate-300 hover:text-slate-200 hover:bg-blue-600 
                    ${isLoading && 'opacity-80'}`}  >
            <div className='flex justify-center relative'>
                {isLoading ?  <div className="flex items-center gap-4"><LoadingSpinner size="small"/></div>
                :
                <div>{label}</div>}
                
            </div>
     </button>

  )
}

export default ProfileButton