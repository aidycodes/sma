import { useTheme } from 'next-themes'
import React from 'react'
import { api } from '~/utils/api'
import Swash from './swash'

type Props = {
    theme: string | undefined
    themeString: string
    setTheme: (theme: string) => void
    previousTheme: string | undefined
    setPreviousTheme: (theme: string) => void
}

const Theme = 
    ({theme, themeString, setTheme,
     previousTheme, setPreviousTheme}
     : Props) => {

        const postTheme = api.user.updateTheme.useMutation()
 
        const handleClick = (themeString: string) => {
            setPreviousTheme(themeString)
            postTheme.mutate({theme: themeString})
        }

  return (

    <div onMouseOver={() => setTheme(themeString)} 
        onMouseLeave={() => previousTheme && setTheme(previousTheme)}
        onClick={() => handleClick(themeString)}>
        <div
    className={themeString === theme ? "flex m-4  flex-col justify-center  items-center text-secondary font-semibold cursor-pointer p-2 outline rounded-md"
    : "flex m-4 flex-col justify-center items-center text-secondary font-semibold  cursor-pointer hover:outline p-2 rounded-md outline-slate-50"    
    }>
        <h2>{themeString.charAt(0).toUpperCase() + themeString.slice(1) }</h2>
        <Swash theme={themeString} />
    </div>
    </div>
  )
}

export default Theme
