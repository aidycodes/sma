import React, { useEffect, useLayoutEffect } from 'react'
import { useTheme } from 'next-themes'
import ThemePicker from '~/components/themePicker'
import Loading from '~/components/loading'
import Layout from '~/components/Layout'


const ThemeTester = ({ userTheme = 'dark-blue'}: { userTheme: string}) => {

    const { theme, setTheme} = useTheme()

    useLayoutEffect(() => {
      setTheme('none')
       
    }, [])

    useEffect(() => {
        setTheme(userTheme)
    }, [])



  return (
    <Layout >
   
    <div className='bg'>
        <div className="fg">
      <h1 className='text-primary'>Theme Tester</h1>
      <button onClick={() => setTheme('dark')}>Dark</button>
        <button className="text-secondary" onClick={() => setTheme('light')}>Light</button>
        <button onClick={() => setTheme('neon')}>Neon</button>
        <button onClick={() => setTheme('dark-blue')}>Dark Blue</button>
        </div>
        <Loading/>
       
    </div>
    </Layout>
  )
}

export default ThemeTester
