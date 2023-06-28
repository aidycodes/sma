import { useTheme } from "next-themes"
import { useEffect, useState, useLayoutEffect } from "react"
import { api } from "~/utils/api"


export const useSSRTheme = () => {

    const { data: userData, isLoading: userLoading, isError: userError } = api.userQuery.getUserProfile.useQuery()
    const userTheme = userData?.user?.profile?.theme
 
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