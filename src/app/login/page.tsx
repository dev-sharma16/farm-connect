"use client";

import { useForm } from "react-hook-form";
import Input from "@/components/Input";
import { authService } from "@/appwrite/authService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
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
      const loginedUser = await authService.login(data.email, data.password);
      
      if(loginedUser){
        const { user , userRole } = loginedUser;
        dispatch(setUsers({
          ...user,
          role: userRole
        }));
        router.push(`/dashboard-${userRole}`);
      }
    } catch (error: any){
     console.error("Error in login account : ",error); 
    } finally{
      setLoading(false);
    }
  }
   
  return(
    <div className="h-screen w-full flex items-center justify-center bg-[#b0dcb9] px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-semibold text-green-900 mb-6 text-center">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="Enter email"
            {...register("email", { required: "Email is required" })}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            {...register("password", { required: "Password is required" })}
            error={errors.password?.message}
          />

          <button
            type="submit"
            className="w-full bg-green-900 text-white font-semibold py-2 rounded hover:bg-green-800 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}