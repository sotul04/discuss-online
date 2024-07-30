'use client';

import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";

interface ProviderProps{
    children: React.ReactNode
}

export default function Providers({ children }: ProviderProps) {
    return <SessionProvider>
        {children}
    </SessionProvider>
}