import React, { useEffect } from 'react'
import { useTheme } from 'next-themes'
import ThemePicker from '~/components/themePicker'


const ThemeTester = ({ userTheme = 'light'}: { userTheme: string}) => {

    const { theme, setTheme} = useTheme()

    useEffect(() => {
        setTheme(userTheme)
    }, [])

    console.log({theme})

  return (
    <div className="m-2">
   
    <div className='bg'>
        <div className="fg">
      <h1 className='text-primary'>Theme Tester</h1>
      <button onClick={() => setTheme('dark')}>Dark</button>
        <button className="text-secondary" onClick={() => setTheme('light')}>Light</button>
        <button onClick={() => setTheme('neon')}>Neon</button>
        <button onClick={() => setTheme('dark-blue')}>Dark Blue</button>
        </div>
       
    </div>
    </div>
  )
}

export default ThemeTester
