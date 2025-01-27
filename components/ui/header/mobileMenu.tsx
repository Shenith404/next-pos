"use client";

import { useUser } from "@/app/(frontend)/context/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useUser();
    const router = useRouter();

    return (
        <div className="md:hidden">
            <div
                className="flex flex-col gap-[4.5px] cursor-pointer  "
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <div
                    className={`w-6 h-1 bg-primary rounded-sm ${isOpen ? "rotate-45" : ""
                        } origin-left ease-in-out duration-500`}
                />
                <div
                    className={`w-6 h-1 bg-primary rounded-sm ${isOpen ? "opacity-0" : ""
                        } ease-in-out duration-500`}
                />
                <div
                    className={`w-6 h-1 bg-primary rounded-sm ${isOpen ? "-rotate-45" : ""
                        } origin-left ease-in-out duration-500`}
                />
            </div>
            {isOpen && (
                <div onClick={() => { setIsOpen(false) }} className={`absolute left-0 top-24 w-full bg-white flex flex-col items-center justify-center gap-8 font-medium text-xl z-10 ${isOpen ? "h-[calc(100vh-96px)]" : "h-0"} origin-top ease-in-out duration-[3000]"}`}>
                    <Link href="/">Home</Link>
                    <Link href="/">Friends</Link>
                    <Link href="/">Groups</Link>
                    <Link href="/">Stories</Link>
                    {user ? <button onClick={() => { logout(); router.push('/signin') }}>Logout</button> : <Link href="/signin">Login</Link>}
                </div>
            )}
        </div>
    );
};

export default MobileMenu;