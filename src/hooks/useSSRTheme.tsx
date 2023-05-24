import { useTheme } from "next-themes"
import { useEffect, useState, useLayoutEffect } from "react"


export const useSSRTheme = (userTheme: string | undefined | null) => {


  const { setTheme } = useTheme()
 
    useLayoutEffect(() => {
    if(userTheme){
      setTheme(`${userTheme}Fix`)
    }
    }, [])
    useEffect(() => {
      if(userTheme){
        setTheme(userTheme)
      }
      
    }, [])
    
  
}