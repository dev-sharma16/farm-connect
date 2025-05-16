"use client";

import { useForm } from "react-hook-form";
import Input from "@/components/Input";
import { authService } from "@/appwrite/authService";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { setUsers } from "@/redux/authSlice";

type FormData = {
    email: string,
    password: string,
}

export default function LoginPage (){
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const dispatch = useDispatch();
   
   const {
      register,
      handleSubmit,
      formState: {errors},
   } = useForm<FormData>()

    const onSubmit = async (data: FormData) => {
     try{
         console.log('Form Submitted : ', data);
         setLoading(true);
         await authService.login(data.email, data.password);
         const user = await authService.getCurrentUser();
         if(user){
             dispatch(setUsers(user));
             router.push("/dashboard");
         }
     } catch (error: any){
         console.error("Error in login account : ",error); 
     } finally{
         setLoading(false);
     }
    }
    

   return(
        <div className="max-w-md mx-auto mt-10">
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
    
            <Input
              label="Email"
              type="email"
              placeholder="Enter email"
              {...register('email', { required: 'Email is required' })}
              error={errors.email?.message}
            />
    
            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              {...register('password', { required: 'Password is required' })}
              error={errors.password?.message}
            />

            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Loging Account..." : "Login"}
            </button>
          </form>
        </div>
   )
}