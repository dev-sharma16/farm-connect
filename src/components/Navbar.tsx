"use client";

import Link from "next/link";
import styles from "./Navbar.module.css"
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { authService } from "@/appwrite/authService";
import { clearUsers } from "@/redux/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

export default function Navbar(){


    return(
        <nav className="my-5 flex justify-center items-center gap-2">
            <Link href="/" className={styles.tabs}>Home</Link>
            <Link href="/login" className={styles.tabs}>Login</Link>
            <Link href="/signUp"  className={styles.tabs}>SignUp</Link>
        </nav>
    )
}