import dayjs from 'dayjs'
import React from 'react'
import AboutItem from './aboutItem'
var localizedFormat = require('dayjs/plugin/localizedFormat')

dayjs.extend(localizedFormat)

type Props = {
    bio?: string | null
    work?: string | null
    education?: string | null
    created_at?: string | null
    location?: string | null
}

const About = ({ bio, work, education, location, created_at }: Props) => {
    

  return (
    <div className="fg w-[90%] rounded-lg shadow-lg m-4 dbo-border lg:my-4 lg:ml-2 lg:mr-0  xl:pb-2 lg:w-full 2xl:max-w-[680px]  ">
        <div className="pt-2 flex flex-col ">
            <div className="pl-2">
                <h2 className="text-3xl font-bold font-cursive">About</h2>
            </div>
            {bio && (
                <AboutItem  text={bio} icon="bio.svg"/>
            )}
            {location && (
                <AboutItem  text={location} icon="location.svg"/>
            )}
            {work && (
                <AboutItem  text={work} icon="work.svg"/>
            )}
            {education && (
                <AboutItem  text={education} icon="education.svg"/>
            )}
            {created_at && (
                <AboutItem  text={`Joined ${dayjs(created_at).format('LL')}`} icon="joined.svg"/>
            )}
            

        </div>
    </div>
  )
}

export default About