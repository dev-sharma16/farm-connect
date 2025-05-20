"use client";

import Link from "next/link";
import styles from "./Navbar.module.css"
import { useSelector } from "react-redux";
import { authService } from "@/appwrite/authService";
import { clearUsers } from "@/redux/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

export default function Navbar(){

    const user = useSelector((state:any)=> state.auth.user);
    const userRole = user?.role;

    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = async()=>{
        const logout = await authService.logout()
        if (logout) {
            dispatch(clearUsers());
            router.push("/login")
        }
    }

    return(
        <nav className="my-5 flex justify-center items-center gap-2">
            {/* 🧑‍🌾 Farmer Navbar */}
            {userRole === "farmer" && (
               <>
                 <Link href={`/dashboard-${userRole}`} className={styles.tabs}>Dashboard</Link>
                 <Link href="/add-item" className={styles.tabs}>Add Item</Link>
                 <Link href="/orders" className={styles.tabs}>Orders</Link>
                 <button onClick={handleLogout} className={styles.tabs}>Logout</button>
               </>   
            )}
            
            {/* 🧑‍💼 Consumer Navbar */}
            {userRole === "consumer" && (
                <>
                 <Link href={`/dashboard-${userRole}`} className={styles.tabs}>Home</Link>
                  <Link href="/search" className={styles.tabs}>Search</Link>
                  <Link href="/profile" className={styles.tabs}>Profile</Link>
                  <button onClick={handleLogout} className={styles.tabs}>Logout</button>
                </>
            )}
            
            {/* 🌐 Public Navbar (Not Logged In) */}
            {!userRole && (
                <>
                  <Link href="/" className={styles.tabs}>Home</Link>
                  <Link href="/login" className={styles.tabs}>Login</Link>
                  <Link href="/signUp" className={styles.tabs}>Sign Up</Link>
                </>
            )}
        </nav>
    )
}