"use client";

import Image from "next/image";
import DarkModeToggle from "@/components/dark-mode-toggle";
import { SignedIn, UserButton } from "@clerk/nextjs";

export default function Navbar() {
    return (
        <header className="w-full backdrop-blur top-0 z-40">
            <div className="py-12 px-4 w-full h-24 flex items-center justify-between">
                <div className="items-center gap-2 invisible pointer-none pl-2">
                    <DarkModeToggle />
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>

                {/* Logo container */}
                <div className="relative md:static h-12 w-[160px] md:w-[500px]">
                    {/* Light-mode logo */}
                    <Image
                        src="/Frank Logo.gif"
                        alt="Frank"
                        fill
                        className="hidden dark:block object-contain [image-rendering:pixelated]"
                        priority
                        unoptimized
                    />
                    {/* Dark-mode logo */}
                    <Image
                        src="/Frank Logo Light Mode.gif"
                        alt="Frank"
                        fill
                        className="block dark:hidden object-contain [image-rendering:pixelated]"
                        priority
                        unoptimized
                    />
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-2 self-end">
                    <DarkModeToggle />
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </header>
    );
}
