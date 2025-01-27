'use client'
import {
    LogOut,
    User,
    UserCircle2
} from "lucide-react";
import { useEffect } from 'react';
import { GoBell } from "react-icons/go";

import { useUser } from "@/app/(frontend)/context/user";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import MobileMenu from "./mobileMenu";

const Header = () => {
    const { user, updateAccessToken } = useUser();

    useEffect(() => {
        // Remove the problematic browser extension div
        const extensionDiv = document.getElementById('extwaiokist');
        if (extensionDiv) {
            extensionDiv.remove();
        }
    }, []);

    return (
        <div className="flex w-fu justify-between w-full  z-20 border items-center p-4 px-8 bg-white ">
            {/* start */}
            <Link href='/' className="md:hidden lg:block">
                <h1 className="text-lg font-semibold">Welcome Back!</h1>
                {user && <div>
                    <p className="text-sm ">{user?.name}</p>
                </div>}
            </Link>

            {/* mid */}
            <div className="md:flex items-center space-x-5 hidden">
                <Link href="/about">About</Link>
                <Link href="/profile">Profile</Link>

            </div>

            {/* end */}
            <div className="flex items-center space-x-5">
                <div className="hidden md:flex">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-background px-4 py-2 rounded-lg ring-1 ring-primary focus:outline-0 focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="flex items-center space-x-5 ">
                    <button className="relative text-2xl text-gray-600 ">
                        <GoBell size={28} />
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex justify-center items-center bg-primary text-white font-semibold text-[10px] w-5 h-4 rounded-full border-2 border-white">
                            9
                        </span>
                    </button>
                    <MobileMenu />
                    <div className="hidden md:flex">{user?.token && <DropDown updateAccessToken={() => { updateAccessToken(null) }} />}</div>
                </div>
            </div>
        </div>
    );
};

export default Header;

export function DropDown({ updateAccessToken }: any) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="link"><UserCircle2 size={48} className="w-8 h-8 rounded-full border-[2px] border-primary/90 " /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => { }}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => {
                            updateAccessToken(null);
                            window.location.href = '/signin';
                        }}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}