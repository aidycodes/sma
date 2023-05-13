import React from 'react'
import { useTheme } from 'next-themes'


const ThemeTester = () => {

    const { theme, setTheme} = useTheme()

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
