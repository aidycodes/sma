import React from 'react'
import LoadingSpinner from '../loadingspinner'

type Props = {
    isLoading?: boolean
    onClick?: () => void
    label: string
    type?: 'submit' | 'button'

}

const SubmitButton = 
    ({isLoading = false,label, type = 'button', onClick  }: Props) => {
  return (
     <button disabled={isLoading} onClick={() => onClick && onClick()}
        className={`!bg-blue-700 p-2 rounded-md  text-slate-300 hover:text-slate-200 hover:!bg-blue-600 
                    ${isLoading && 'opacity-80'}`} type={type} >
            <div className='flex justify-center relative'>
                {isLoading ? <LoadingSpinner size="small"/>
                :
                <div>{label}</div>}
            </div>
     </button>

  )
}

export default SubmitButton