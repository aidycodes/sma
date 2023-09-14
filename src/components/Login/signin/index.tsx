import Image from 'next/image'
import React from 'react'
import { Cabin } from 'next/font/google'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import LogInput from '../input/LogInput'
import { api } from '~/utils/api'
import Loading from '~/components/loading'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import LeftBorderLine from '../border/Leftborder'

const SignInSchema = z.object({
    email: z.string().min(3, {message: "Username must be at least 3 characters long"}).max(20, {message: "Username must be less than 20 characters long"}),
    password: z.string().min(8, {message: "Password must be at least 8 characters long"}).max(20, {message: "Password must be less than 20 characters long"})
})

type SignInForm = {
    email: string,
    password: string,
}

const cabin = Cabin({subsets:['latin'], weight: "600", style: "normal" })

const SignIn = ({ setIsFlipped }: {setIsFlipped: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const [currentFocus, setCurrentFocus] = React.useState<string | null>(null)
    const [lights, setLights] = React.useState(0)

    const { handleSubmit, register, watch, formState: { errors, isSubmitting } } = useForm<SignInForm>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
        resolver: zodResolver(SignInSchema)
    })

    const { mutate, isError, isSuccess, isLoading, error } = api.user.login.useMutation()

    const router = useRouter()    
    const watchEmail = watch('email')
    const watchPassword = watch('password')
    const watchAllFields = watch()

        const handleBlur = () => {
        setCurrentFocus(null)
    }

    const handleFocus = (input: string) => {
        setCurrentFocus(input)
    }

    const onSubmit = async (data: SignInForm) => {
        mutate(data)
    }

    React.useEffect(() => {
        let inter: NodeJS.Timer 
        if(isLoading){
             inter = setInterval(() => {
                setLights((prev) => prev + 1)
            }, 200);
        }
        return () => clearInterval(inter)
    }, [isLoading]) 

    React.useEffect(() => {
        if(isSuccess){
            toast.success('Login successful')
            router.push('/dashboard')

        }
    }, [isSuccess])
    
  return (
    <div className="w-full overflow-hidden relative">
        <LeftBorderLine/>
        
       <div className={`flex items-center justify-center font-semibold text-4xl mt-6 text-slate-400 ${cabin.className}`}> 
        
        Sign In
         <Image className="rounded-xl object-contain grey-scale mt-8 brightness-150 " width={20} height={20}
                    alt="img" src="/icons/spin.svg" />
        </div>

        <form  className="flex flex-col items-center justify-center w-full gap-2 mt-10">
        <div className="flex w-full gap-8 justify-start ml-32">
            <div className="mr-auto">
            <span className="h-[8px] w-[8px] bg-slate-200 rounded-[50%] inline-block opacity-50 mr-4"></span>
            <span className="h-[9px] w-[9px] bg-slate-200 rounded-[50%] inline-block opacity-75 mr-4"></span>
            <span className="h-[10px] w-[10px] bg-slate-200 rounded-[50%] inline-block mr-4"></span>
            </div>
        </div>
           <LogInput inputProps={register('email', {onBlur: () => handleBlur()})} watch={watchEmail}
              error={errors?.email?.message} onFocus={() => handleFocus('email')} currentFocus={currentFocus}
              id="email" label="Email" type="text" />
           
           <LogInput inputProps={register('password', {onBlur: () => handleBlur()})} watch={watchPassword}
              error={errors?.password?.message} onFocus={() => handleFocus('password')} currentFocus={currentFocus}
              id="password" label="Password" type="text"  
             
              />
        <div className="flex gap-8 justify-start mt-4">
            <span className={`h-[15px] w-[15px]  ${isError ? 'bg-red-500' : isSuccess ? 'bg-green-400' : isLoading && lights % 2 === 0 ? 'bg-blue-500' : 'bg-slate-300' } rounded-[50%] inline-block `}></span>
            <span className={`h-[15px] w-[15px] ${isError ? 'bg-red-500' : isSuccess ? 'bg-green-400' : isLoading && lights % 2 !== 0 ? 'bg-blue-500' : 'bg-slate-300' }  rounded-[50%] inline-block`}></span>
            <span className={`h-[15px] w-[15px] ${isError ? 'bg-red-500' : isSuccess ? 'bg-green-400' : isLoading && lights % 2 === 0 ? 'bg-blue-500' : 'bg-slate-300' }  rounded-[50%] inline-block`}></span>
        </div>            


        <div className="mt-8 relative">
                Dont have an Account? <span className="text-blue-700 cursor-pointer hover:font-semibold"
                onClick={() => setIsFlipped(false)}>Create One</span>
                {isError && !isLoading && <div className="text-red-500 text-sm absolute w-[300px] top-[32px] ">Username or password was incorrect</div>}
        </div>
                    <button onClick={handleSubmit((data) => onSubmit(data))} 
            className={`bg-blue-700 w-[200px] px-8 h-12 !text-slate-200 hover:!text-white disabled:cursor-not-allowed disabled:opacity-50 
            font-semibold text-lg cursor-pointer text-primary rounded-[10px] mt-8 hover:brightness-125`} 
            disabled={!!Object.keys(errors).length || Object.values(watchAllFields).filter((key) => key === "").length !== 0 || isSubmitting || isSuccess} 
            >{!isLoading ? <> Sign In!</> : <Loading/> }</button>
           
        </form>       
    </div>
  )
}

export default SignIn