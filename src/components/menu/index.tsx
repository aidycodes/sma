import React, { useRef } from 'react'
import { useOutsideClick } from '~/hooks/useOutsideClick'
import Icon from '../icon'
import Popup from './popup'
import Notify from '../navbar/notify'

type Props = {
    icon: string
    size: number
    component: React.ReactNode
    width?: number
}

const Menu = ({icon, size, component, width}: Props) => {

    const [showPopup, setShowPopup] = React.useState(false)

    const ref = useRef(null)      
    useOutsideClick(ref, () => setShowPopup(false))

  return (
    <div ref={ref} className="relative">
    <Icon size={size}  name={icon} onClick={() => setShowPopup(!showPopup)} isSelected={showPopup} />
    {showPopup && <Popup component={component} width={width}/>}
    </div>
  )
}

export default Menu