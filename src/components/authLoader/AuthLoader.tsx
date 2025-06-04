"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authService } from "@/appwrite/authService";
import { setUsers } from "@/redux/authSlice";

export default function AuthLoader(){
  const dispatch = useDispatch();

  useEffect(()=>{
    async function fetchUser(){
      const userData = await authService.loadCurrentuser();
      
      if (userData) {
        const {user, userRole} = userData;
        dispatch(setUsers({...user, role: userRole }))
      }
    }

    fetchUser();
  },[dispatch])

  return null;
}