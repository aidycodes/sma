import Image from 'next/image'
import React from 'react'
import { FieldValue, UseFormWatch, useWatch } from 'react-hook-form'
import SignUpLoading from '../loading/SignupLoading'



type LogInputProps = {
    id: string
    label: string
    inputProps: unknown
    error?: string
    type?: string
    watch: string
    isLoading?: boolean
    emailIsUsed?: boolean
    isAsync?: boolean
    onBlur?: () => void
    onFocus: () => void
    currentFocus?: string | null
    hasCheckedEmail?: boolean
}

const LogInput = 
({ id, label, inputProps, error,
     type, watch, isLoading, onBlur, emailIsUsed, 
     isAsync = false, currentFocus, onFocus, hasCheckedEmail}: LogInputProps) => {

  return (
            <div className="h-12 w-52 mb-4 flex flex-col gap-1 relative group">
                <label htmlFor={id}>{label}</label>
                <input  className={`rounded-lg group ${error && 'shadow-[0_0_3px_2px_rgba(238,75,43,0.95)]'} ${emailIsUsed && 'shadow-[0_0_3px_2px_rgba(238,75,43,0.95)]'}  
                ${!error && !emailIsUsed && watch && 'shadow-[0_0_3px_2px_rgba(50,205,50,0.95)]'} outline-none pl-1 shadow-[0_0_2px_2px_rgba(189,189,189,0.95)]
                  focus:shadow-[0_0_3px_2px_rgba(32,119,250,0.95)]`}
                 {...inputProps ?? {}} onFocus={() => onFocus()}  />
                    {error && <p className="text-red-500 text-xs w-[1000px] absolute left-[-10px] bottom-[-24px]">{error}</p>}
                    {!error && isAsync && emailIsUsed && hasCheckedEmail  ? <p className="text-red-500 text-xs w-[1000px] absolute left-[-10px] bottom-[-24px]"
                    >Email is in use.</p>
                    : !error && isAsync && watch && !emailIsUsed && hasCheckedEmail && currentFocus !== id && <p className="text-green-500 text-xs w-[1000px]
                     absolute left-[-10px] bottom-[-24px]"
                     >Email Address is not in use</p>}
                {error ? <div className={`absolute opacity-70 right-[-30px] bottom-[-5px]`}><Image src="/icons/redcross.svg" alt="X"  width={30} height={30}/></div>
                : emailIsUsed ? <div className={`absolute opacity-70 right-[-30px] bottom-[-5px]`}><Image src="/icons/redcross.svg" alt="X"  width={30} height={30}/></div> 
                : isLoading &&
                <div className={`absolute right-[-28px] bottom-0`}><SignUpLoading/></div>
                } 
        
            { watch && !error && !isLoading && !emailIsUsed && currentFocus !== id && 
            <div className={`absolute right-[-32px] bottom-[-4px] `}> <Image src="/icons/greentick.svg" alt="X"  width={30} height={30}/></div>}
              
            </div>
  )
}

export default LogInput