import React, { useEffect, useRef } from 'react'
import { useOutsideClick } from '~/hooks/useOutsideClick'
import { api } from '~/utils/api'
import Icon from '../icon'
import Popup from './popup'
import { NotifyUser } from '@prisma/client'
import ThemePicker from '../themePicker'

type Props = {
    icon: string
    size: number
    title: string
    items?: NotifyUser[] | undefined | any
}

const Menu = ({icon, size, items, title}: Props) => {

    const [showPopup, setShowPopup] = React.useState(false)

    const ref = useRef(null)
       
    useOutsideClick(ref, () => setShowPopup(false))

  return (
    <div ref={ref} className="relative">
    <Icon size={size} color="blue" name={icon} onClick={() => setShowPopup(!showPopup)} />
    {showPopup && <Popup title={title} items={items}/>}
    </div>
  )
}

export default Menu