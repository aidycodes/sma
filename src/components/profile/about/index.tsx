import React from 'react'
import AboutItem from './aboutItem'


type Props = {
    bio?: string | null
    work?: string | null
    education?: string | null
    joined?: string | null
    location?: string | null
}

const About = ({ bio, work, education, joined, location }: Props) => {
  return (
    <div className="fg w-[90%] rounded-lg shadow-lg m-4 dbo-border lg:my-4 lg:ml-2 lg:mr-0  xl:pb-2 lg:w-full 2xl:max-w-[680px]  ">
        <div className="pt-2 flex flex-col ">
            <div className="pl-2">
                <h2 className="text-3xl font-bold font-cursive">About</h2>
            </div>
            {bio && (
                <AboutItem  text={bio} icon="bio.svg"/>
            )}
            {!location && (
                <AboutItem  text={"United Kingdom South Gloucestershire England"} icon="location.svg"/>
            )}
            {work && (
                <AboutItem  text={work} icon="work.svg"/>
            )}
            {education && (
                <AboutItem  text={education} icon="education.svg"/>
            )}
            {!joined && (
                <AboutItem  text={"Joined march 2023"} icon="joined.svg"/>
            )}
            

        </div>
    </div>
  )
}

export default About