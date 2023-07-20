import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { toast } from 'react-hot-toast'
import Loading from '~/components/loading'
import LoadingSpinner from '~/components/loadingspinner'
import { api } from '~/utils/api'

const VerifyEmail = () => {

    const router = useRouter()
    const [launch, setLaunch] = React.useState<boolean>(false)

    const [code, setCode] = 
        React.useState<string>(router?.query?.verify[1] ? router?.query?.verify[1] as string : '')

    const { mutate, isSuccess, isError, isLoading, data:user } = api.user.verify.useMutation()
    const { mutate:resendMutate, isSuccess:resendIsSucc,
         isError:resendIsError, 
         isLoading:resendIsLoading, data:resend } = api.user.resendVerification.useMutation()


    const handleClose = () => {
        router.push('/login')
    }

    React.useEffect(() => {
        if(isSuccess){
            toast.success('Email verified successfully')
            const timeOut = setTimeout(() => {
            router.push('/login')
            }, 1000);
            return () => clearTimeout(timeOut)
        }
    }, [isSuccess])
    
        React.useEffect(() => {
        if(router?.query?.verify[1]){
            mutate({id:router?.query?.verify[0] as string, secureCode:router.query.verify[1] as string})
        }
    }, [])


    React.useEffect(() => {
      const timer =  setTimeout(() => {
        setLaunch(true)
        }, 1000);
        return () => clearTimeout(timer)
    }, [])


  return (
    <div className={`bg-slate-200 mx-auto transition-all ${!launch ? 'scale-0' : 'scale-100' } mt-20 my-auto w-[320px]  h-[400px] rounded-xl shadow-xl text-center relative`}>
        <div className=" mt-10 pt-10">
            <h4 className="text-3xl">Verify Email</h4>       
        </div>
        <Image src="/icons/cross.svg" width={25} height={25} alt="close" className="absolute top-2 right-2 cursor-pointer" onClick={handleClose}/>
        <div className="flex flex-col justify-center items-center h-[90%]">
            <p className="text-xl">Please check your email for a verification link.</p>
            <div className="flex gap-2 items-center m-4">
            <p className="mb-1">Enter Code: </p>
          <input className="outline-none rounded-xl w-[100px] text-center
            placeholder:text-center placeholder:font-bold" placeholder='code'
            onChange={(e) => setCode(e.target.value)} value={code}
            />
            </div>  
        <div className="h-14 flex flex-col justify-center items-center">
            {!isLoading && !isSuccess ?
            <div className="relative pb-2">
                        <button className="bg-blue-700 hover:brightness-125 text-white rounded-xl px-4 h-10 mt-4 w-[100px]"
                        onClick={() =>  mutate({id:router?.query?.verify[0] as string, secureCode:code}) } disabled={isLoading}
                        >{!isLoading ? 'Submit' : <Loading/>}</button>
            </div>
                        : 
                isLoading ?  
                <div><LoadingSpinner/></div> : 
                isSuccess && <div className="relative pb-2 flex flex-col justify-center items-center">
        <Image src="/icons/greentick.svg" width={70} height={50} alt="check" className=" ml-[8px]" /> 
         <p className="text-sm text-green-500 bottom-0 left-[-10px] w-[100px] absolute">Email verified</p>
         </div>
                       
                      
                  
            }
      
            {isError && <p className="text-sm text-red-500 h-4 ">Error verifying email</p>}
           
        </div>
            <div className="mt-12 flex flex-col justify-center items-center">
        
                <p className="text-md flex flex-col ">If you did not receive the email,  <span className="text-blue-600 font-semibold cursor-pointer hover:font-bold"
                    onClick={() => resendMutate({id:router?.query?.verify[0] as string})}
            >click to resend</span></p>
            <div className="h-10">
            {resendIsLoading && <p className="text-sm text-gray-500">Sending...</p>}
            {resendIsError && <p className="text-sm text-red-500">Error sending email</p>}
            {resendIsSucc && <p className="text-sm text-green-500">Email sent</p>}
            </div>
            </div>
        </div>
    </div>
  )
}

export default VerifyEmail