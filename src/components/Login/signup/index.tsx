import Image from 'next/image'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Cabin } from 'next/font/google'
import BorderLine from '../border'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import LogInput from '../input/LogInput'
import { api } from '~/utils/api'
import Loading from '~/components/loading'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'

const SignUpSchema = z.object({
    username: z.string().min(3, {message: 'Username must be at least 3 characters long'}).max(20, {message: 'Username must be less than 20 characters long'}),
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(8, {message: 'Password must be at least 8 characters long'}).max(20, {message: 'Password must be less than 20 characters long'}),
    confirmPassword: z.string().min(8, {message: 'Password must be at least 8 characters long'}).max(20, {message: 'Password must be less than 20 characters long'})
}).refine(data => data.password === data.confirmPassword, {message: 'Passwords do not match', path: ['confirmPassword']})

const cabin = Cabin({subsets:['latin'], weight: "600", style: "normal" 
})

type SignUpForm = {
    username: string,
    email: string,
    password: string,
    confirmPassword: string
}

const SignUp = ({ setIsFlipped }:
     { setIsFlipped: React.Dispatch<React.SetStateAction<boolean>> }) => {

        const [currentFocus, setCurrentFocus] = React.useState<string | null>(null)
        const [hasCheckedEmail, setHasCheckedEmail] = React.useState<boolean>(false)

    const { handleSubmit, register, watch, formState: { errors, isSubmitting } } = useForm<SignUpForm>({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        },
        mode: 'onBlur',
        resolver: zodResolver(SignUpSchema)


    })
    const watchUsername = watch('username')
   const watchPassword = watch('password')
   const watchEmail = watch('email')
   const watchConfirmPassword = watch('confirmPassword')
   const watchAllFields = watch()
   
   const trpc = api.useContext()
   const router = useRouter()
   
   const { data, isFetching } = api.user.checkEmail.useQuery({email:watchEmail}, {enabled:false}) 
   const { mutate, isSuccess, isError, isLoading, data:user } = api.user.create.useMutation()
    
   React.useEffect(() => {
    if(data){
        setHasCheckedEmail(true)
    }
   }, [data])

   React.useEffect(() => {
    if(isSuccess){
        toast.success('Account created successfully')
        router.push(`/login?verify=${user?.userid}`, `/login/verify/${user?.userid}`)
    }
   }, [isSuccess])

         React.useEffect(() => {
    if(isError){
        toast.error('Something went wrong... Please try again')
    }
   }, [isError])

    const onSubmit = (data: SignUpForm) => {
        mutate(data)
    }

    const handleCheckEmail = () => {
        setHasCheckedEmail(false)
        trpc.user.checkEmail.reset()
         trpc.user.checkEmail.fetch({email:watchEmail})
         setCurrentFocus(null)
    }
    const handleBlur = () => {
        setCurrentFocus(null)
    }

    const handleFocus = (input: string) => {
        setCurrentFocus(input)
    }

  return (
    <div className="w-full overflow-hidden relative">
        <BorderLine/>
       <div className={`flex items-center justify-center font-semibold text-4xl mt-6 text-slate-400 ${cabin.className}`}> 
        Sign Up
         <Image className="rounded-xl object-contain grey-scale mt-8 brightness-150 " width={20} height={20}
                    alt="img" src="/icons/spin.svg" />
        </div>  
        <form  className="flex flex-col items-center justify-center w-full gap-2 mt-6">
           <LogInput inputProps={register('username', {onBlur: () => handleBlur()})} watch={watchUsername}
              error={errors?.username?.message} onFocus={() => handleFocus('username')} currentFocus={currentFocus}
              id="username" label="Username" type="text" />
           
           <LogInput inputProps={register('email', {onBlur: () => handleCheckEmail()})} watch={watchEmail}
              error={errors?.email?.message} onFocus={() => handleFocus('email')} currentFocus={currentFocus}
              id="email" label="Email" type="text" isLoading={isFetching} 
              emailIsUsed={data?.emailIsUsed} isAsync={true} hasCheckedEmail={hasCheckedEmail}
              />          

            <LogInput inputProps={register('password', {onBlur: () => handleBlur()})} 
                error={errors?.password?.message} onFocus={() => handleFocus('password')} currentFocus={currentFocus} 
                id="password" label="password" type="text" watch={watchPassword} />
                <div className="h-10 flex flex-col mb-4" >
            <LogInput inputProps={register('confirmPassword', {onBlur: () => handleBlur()})} 
                error={errors?.confirmPassword?.message} onFocus={() => handleFocus('currentPassword')} currentFocus={currentFocus} 
                id="confirmPassword" label="confirmPassword" type="text" watch={watchConfirmPassword} />
            </div>
            <div className="mt-4 relative">
                Already have an Account? <span className="text-blue-700 cursor-pointer hover:font-semibold"
                onClick={() => setIsFlipped(true)}>Sign in</span>
                {isError && !isLoading && <div className="text-red-500 text-sm absolute w-[300px] top-[18px] ">Something went wrong please try again</div>}
            </div>
            <button onClick={handleSubmit((data) => onSubmit(data))} 
            className={`bg-blue-700 w-[200px] px-8 h-12 !text-slate-200 hover:!text-white disabled:cursor-not-allowed disabled:opacity-50 
            font-semibold text-lg cursor-pointer text-primary rounded-[10px] mt-2 hover:brightness-125`} 
            disabled={!!Object.keys(errors).length || Object.values(watchAllFields).filter((key) => key === "").length !== 0 ||  data?.emailIsUsed || isSubmitting} 
            >{!isLoading ? <> Sign up!</> : <Loading/> }</button>
            </form>
    </div>
  )
}

export default SignUp