import React, { ReactNode } from 'react'

const ProfileLayout = ({ children }:
     {children :ReactNode }) => {
  return (
    <div className="mt-[31px] flex justify-center">
        {children}
    </div>
  )
}

export default ProfileLayout