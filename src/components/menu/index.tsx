import React, { useRef } from 'react'
import { useOutsideClick } from '~/hooks/useOutsideClick'
import Icon from '../icon'
import Popup from './popup'
import Notify from '../navbar/notify'

type Props = {
    icon: string
    size: number
    component: React.ReactNode
}

const Menu = ({icon, size, component}: Props) => {

    const [showPopup, setShowPopup] = React.useState(false)

    const ref = useRef(null)      
    useOutsideClick(ref, () => setShowPopup(false))

  return (
    <div ref={ref} className="relative">
    <Icon size={size}  name={icon} onClick={() => setShowPopup(!showPopup)} isSelected={showPopup} />
    {showPopup && <Popup component={component} />}
    </div>
  )
}

export default Menu