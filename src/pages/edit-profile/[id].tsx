
import React from 'react'
import Details from '~/components/editprofile/details';
import Images from '~/components/editprofile/images';
import Location from '~/components/editprofile/location';
import Layout from '~/components/Layout';
import Loading from '~/components/loading';
import Tabs from '~/components/tabs';
import { useSSRTheme } from '~/hooks/useSSRTheme';
import { prisma } from '~/server/db';
import { api } from '~/utils/api';
const tabButtons = require('./tab-buttons.json')



const EditProfile = () => {

     useSSRTheme('light')
     const createProfile = api.user.createProfile.useMutation()
    const { data, isLoading} = api.userQuery.getUserProfile.useQuery({id:'WRdW83qzlVMK2qe'})

    if(isLoading) return <Loading/>
    const user = data?.user

   if(!user) {
    return (
    <Layout>
        <div>Failed to load userdata please reload this page...</div>
    </Layout>
    )}
  return (
    <Layout>
            <Tabs tabs={tabButtons} >
                {[<Details {...user}  />,<Images {...user}/>,<Location/>]}
            </Tabs>
             <button onClick={() => createProfile.mutate({username:'cosmocattt'})}>create profile</button>
        {/* </form>
        </div> */}
    </Layout>
  )
    
}

export default EditProfile