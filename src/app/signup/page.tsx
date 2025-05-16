"use client";

import { useForm } from "react-hook-form";
import Input from '@/components/Input';
import { authService } from "@/appwrite/authService";
import { useRouter } from "next/navigation";
import { useStore } from "react-redux";
import { useState } from "react";
import Select from "@/components/SelectRole";

type FormData = {
    email: string,
    password: string,
    name: string,
    role: string
}

export default function SignUpPage (){
    const router = useRouter();
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
            const crtAcc = await authService.createAccount(data.email,data.password,data.name,data.role);
            if (crtAcc) {
                router.push(`/dashboard-${data.role}`)
            }
        } catch (error:any) {
            console.error("Error creating account : ", error);
        } finally{
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10">
          <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
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
              {...register('role', { required: 'Role selection is required' })}
              error={errors.role?.message}
            />
            
            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
             {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        </div>
    )
}