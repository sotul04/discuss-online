"use client";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

const FormSchema = z.object({
    email: z.string().min(1, 'Email is required.').email('Invalid email.'),
    password: z.string().min(1, 'Password is required.').min(8, 'Password must have at least 8 characters.'),
})

export default function SignInForm() {

    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        const signInData = await signIn('credentials', {
            email: values.email,
            password: values.password,
            redirect: false,
        });

        if (signInData?.ok) {
            router.push("/");
        } else {
            console.log(signInData?.error);
            toast({
                title: "Sign in failed",
                description: "Opps, something went wrong.",
                variant: 'destructive',
            });
        }
    }

    return (<>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Enter your password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full mt-6">Sign in</Button>
            </form>
            <div className="mx-auto my-4 flex w-full items-center justify-evenly
            before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400
            after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
                or
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
                If you don&apos;t have an account, please&nbsp;
                <Link href="/sign-up" className="text-blue-500 hover:underline">Sign up</Link>
            </p>
        </Form>
    </>
    );
}