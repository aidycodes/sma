import React from 'react'
import Details from '~/components/editprofile/details';
import Images from '~/components/editprofile/images';
import Location from '~/components/editprofile/location';
import Layout from '~/components/Layout';
import Loading from '~/components/loading';
import Tabs from '~/components/tabs';
import { useSSRTheme } from '~/hooks/useSSRTheme';
import { api } from '~/utils/api';
const tabButtons = require('./tab-buttons.json')



const EditProfile = () => {

     useSSRTheme('light')
     const createProfile = api.user.createGeoUser.useMutation()
    const { data, isLoading} = api.userQuery.getUserProfile.useQuery({id:'WRdW83qzlVMK2qe'})
    const {data: geoquery, isLoading: geoQueryLoading } = api.userQuery.getUsersGeoData.useQuery()

    if(isLoading || geoQueryLoading) {
        return (
        <Layout> 
            <Loading/>
        </Layout>
        )
    }
    const user = data?.user
    const geoData = geoquery?.geoData

   if(!user || !geoData) {
    return (
    <Layout>
        <div>Failed to load userdata please reload this page...</div>
    </Layout>
    )}
  return (
    <Layout>
            <Tabs tabs={tabButtons} >
                {[<Details {...user}  />,<Images {...user}/>,<Location geoquery={geoData} loading={geoQueryLoading} />]}
            </Tabs>
             <button onClick={() => createProfile.mutate({lat:51.4776883, lng:-2.5115698, country:'united kingdom', county:'South Gloucestershire', state:'england'})}>create geo data</button>

    </Layout>
  )
    
}

export default EditProfile