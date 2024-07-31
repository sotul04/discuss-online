import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { House } from "lucide-react";
import ModeToggle from "./theme-mode";
import AuthUser from "./auth-user";
import { Suspense } from "react";
import SearchInput from "./search-input";

export default function Header() {
    return <header className="py-2 border-b w-full">
        <div className="container flex items-center justify-between">
            <Link href="/" className={buttonVariants()}><House/></Link>
            <div className="flex gap-3 justify-end">
                <Suspense>
                    <SearchInput/>
                </Suspense>
                <ModeToggle/>
                <AuthUser/>
            </div>
        </div>
    </header>
}