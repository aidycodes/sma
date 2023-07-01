import { useRouter } from 'next/router'
import React from 'react'
import Login from '~/components/Login'
import VerifyEmail from '~/components/Login/verifyEmail'
import Modal from '~/components/modal'

const LoginVPage = () => {

    const router = useRouter()
    const { verify } = router.query
        const [isFlipped, setIsFlipped] = React.useState(false)
        const [count, setCount] = React.useState(0)

    React.useEffect(() => {
        const timer = setTimeout(() => {
            if(count >= 1){
              
            setIsFlipped(true)
            }
            setCount(count + 1)
        }, 500);
        return () => clearTimeout(timer)
    }, [verify])


  return (
    <div className="  w-full h-full lg:w-3/4 2xl:w-1/2 my-28 mx-auto ">

        <Login setIsFlipped={setIsFlipped} isFlipped={isFlipped} />
        {verify && <Modal component={<VerifyEmail/>}/> }
    </div>
  )
}

export default LoginVPage