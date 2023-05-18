import { useTheme } from "next-themes"
import { useEffect, useLayoutEffect } from "react"

export const useSSRTheme = (userTheme = 'light') => {
    const { setTheme } = useTheme()
    useLayoutEffect(() => {
      setTheme('none')
    }, [])
    useEffect(() => {
        setTheme(userTheme)
    }, [])
}