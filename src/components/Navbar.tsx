"use client";

import Link from "next/link";
import styles from "./Navbar.module.css"
import { useSelector, useDispatch } from "react-redux";
import { authService } from "@/appwrite/authService";
import { clearUsers } from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar(){

  const user = useSelector((state:any)=> state.auth.user);
  const userRole = user?.role;
  const dispatch = useDispatch();
  const router = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const handleLogout = async()=>{
      const logout = await authService.logout()
      if (logout) {
          dispatch(clearUsers());                                      
          router.push("/login")
      }
  }
  const NavLinks= ()=>{
      if (userRole === "farmer") {
        {/* 🧑‍🌾 Farmer Navbar */}
        return(
            <>
              <Link href={`/dashboard-${userRole}`} className={styles.tabs}>Dashboard</Link>
              <Link href="/add-crop" className={styles.tabs}>Add Item</Link>
              <Link href="/request-farmer" className={styles.tabs}>Queries</Link>
              <button onClick={handleLogout} className={styles.tabs}>Logout</button>
            </>   
        )
      }else if(userRole === "consumer"){
          {/* 🧑‍💼 Consumer Navbar */}
          return(
            <>
             <Link href={`/dashboard-${userRole}`} className={styles.tabs}>Home</Link>
              <Link href="/request-consumer" className={styles.tabs}>Your Request</Link>
              <Link href="/profile" className={styles.tabs}>Profile</Link>
              <button onClick={handleLogout} className={styles.tabs}>Logout</button>
            </>
          )
      }
      else{
          {/* 🌐 Public Navbar (Not Logged In) */}
          return(
            <>
              <Link href="/" className={styles.tabs}>Home</Link>
              <Link href="/login" className={styles.tabs}>Login</Link>
              <Link href="/signUp" className={styles.tabs}>Sign Up</Link>
            </>
          )
      };
   };

   return(
      <>
        <header className={styles.navbarWrapper}>
          <Link href='/'><div className={styles.logo}>FarmConnect</div></Link>
          <div className={styles.desktopNav}>
            <NavLinks />
          </div>
          <div className={styles.hamburger} onClick={() => setMobileMenuOpen(true)}>
            {/* <FaBars /> */}
          </div>
        </header>
  
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            <div className={styles.overlay} onClick={() => setMobileMenuOpen(false)}></div>
            <div className={styles.mobileMenu}>
              <NavLinks />
              <button className={styles.tabs} onClick={() => setMobileMenuOpen(false)}>Close</button>
            </div>
          </>
        )}
      </>
   )
}