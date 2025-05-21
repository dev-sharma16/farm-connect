"use client";

import { useForm } from "react-hook-form";
import Input from '@/components/Input';
import { authService } from "@/appwrite/authService";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useState } from "react";
import Select from "@/components/SelectRole";
import { setUsers } from "@/redux/authSlice";

type FormData = {
  email: string,
  password: string,
  name: string,
  userRole: string
}

export default function SignUpPage (){
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  
  const {
      register,
      handleSubmit,
      formState: {errors},
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
      try {
        console.log('Form submitted:', data);
        setLoading(true);
        const crtAcc = await authService.createAccount(data.email,data.password,data.name,data.userRole);
        
        if (crtAcc) {
          const { user, userRole } = crtAcc;
          dispatch(setUsers({...user, role: userRole }))
          router.push(`/dashboard-${userRole}`)
        }
      } catch (error:any) {
        console.error("Error creating account : ", error);
      } finally{
        setLoading(false);
      }
  }
  return (
    <div className="min-h-screen bg-[#f8fff2] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-xl p-8 border border-green-200">
        <h1 className="text-3xl font-bold text-green-900 mb-6 text-center">Sign Up</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

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

          <Input
            label="Name"
            type="text"
            placeholder="Enter name"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />

          <Select
            label="Who you are"
            options={[
              { value: "", label: "Choose your role", disabled: true },
              { value: "farmer", label: "Farmer" },
              { value: "consumer", label: "Consumer" },
            ]}
            {...register('userRole', { required: 'Role selection is required' })}
            error={errors.userRole?.message}
          />

          <button
            type="submit"
            className="w-full bg-green-900 text-white font-semibold py-2 px-4 rounded hover:bg-green-800 transition-colors"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  )
}