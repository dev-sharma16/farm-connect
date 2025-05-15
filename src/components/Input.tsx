'use client';

import { HtmlHTMLAttributes, InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
    label?: string
    error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({label, error, ...rest},ref)=>{
    return(
        <div className="mb-4">
           {label && <label className="block mb-1 font-medium">{label}</label>}
           <input
             ref={ref}
             {...rest}
             className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
           {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
       </div>
    )
})

Input.displayName = 'Input'
export default Input