import { QueryKey, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import Layout from '../Layout'
import LoadingSpinner from '../loadingspinner'
import SubmitButton from '../submitbutton'
import Card from './card'

type Props = {
    isLoading: boolean[]
    queryKeys: QueryKey[]
    isError: boolean[]
}

const PageError = 
({isLoading, isError, queryKeys}: Props) => {

    const queryClient = useQueryClient()

    const refetchData = ()  => {
        queryKeys.forEach((key) => {

            queryClient.invalidateQueries(key)
        })
    }
    if(isLoading.some((loading) => loading === false)) {
        return (
            <Layout>
              <Card>     
                <div className="flex flex-col justify-center items-center p-8 gap-4">
                <LoadingSpinner /> 
                <h2>Error Fetching Data - Retrying</h2> 
                </div>
                </Card>
            </Layout>
    )}

    if(isError.some((error) => error === true)) {
    return (
      <Layout>
         <Card>     
            <div className="flex flex-col justify-center items-center p-8 gap-4">
                Error Fetching Data <SubmitButton label="retry" onClick={() => refetchData()}/>
            </div>
         </Card>
        </Layout>
    )
  }
  return(
    <Layout>An Unexpected Error Has Occured</Layout>
  )

}

export default PageError