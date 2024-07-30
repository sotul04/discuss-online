'use client';

import { useSession } from "next-auth/react";
import {
    Avatar,
    AvatarFallback
} from "./ui/avatar";
import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from './ui/popover';
import { signOut } from "next-auth/react";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";

export default function AuthUser() {
    const session = useSession();

    let authContent: React.ReactNode;
    if (session.status === 'loading') {
        authContent = null;
    } else if (session.data?.user) {
        const name = session.data.user.name || '';
        authContent = <Popover>
            <PopoverTrigger>
                <Avatar>
                    <AvatarFallback>{name.substring(0, Math.min(1, name.length))}</AvatarFallback>
                </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-[200px]">
                <div className="flex flex-col items-center gap-4">
                    <h3>Hello, <strong>{name}</strong></h3>
                    <form action={() => signOut()}>
                        <Button type="submit" variant="destructive">Sign out</Button>
                    </form>
                </div>
            </PopoverContent>
        </Popover>
    } else {
        authContent = <>
            <Link href='/sign-in' className={buttonVariants()}>Sign in</Link>
            <Link href='/sign-up' className={buttonVariants()}>Sign up</Link>
        </>
    }
    return authContent;
}