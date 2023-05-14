import { useTheme } from 'next-themes'
import React from 'react'
import Theme from './theme'

const themes = ['light', 'dark', 'neon', 'dark-blue']

const ThemePicker = () => {

    const { theme, setTheme } = useTheme()
    const [previousTheme, setpreviousTheme] = React.useState(theme)

    const themeSelectors = themes.map((themeString) => <Theme themeString={themeString} 
                                                            theme={theme} previousTheme={previousTheme}
                                                            setTheme={setTheme} setPreviousTheme={setpreviousTheme}        
                                                                />)
    return(
        <>
        <div className="border-primary shadow-md rounded-lg theme-picker absolute ">
            <div className="fg flex justify-center shadow-sm rounded-t-md">
             <h1 className="text-primary">Themes</h1>
            </div>
            <div className="flex flex-wrap bg border-purple-600 shadow-xl justify-center ">

            {themeSelectors}
            </div>
        </div>
        </>
    )
}



export default ThemePicker