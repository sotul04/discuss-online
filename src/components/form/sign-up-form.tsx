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
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

const FormSchema = z.object({
    name: z.string().min(1, 'Name is required.').max(100),
    email: z.string().min(1, 'Email is required.').email('Invalid email.'),
    password: z.string().min(1, 'Password is required.').min(8, 'Password must have at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Password confirmation is required.'),
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: "Password do not match."
})

export default function SignUpForm() {

    const { toast } = useToast();

    const router = useRouter();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        }
    });

    const onSubmit = async (values: z.infer<typeof FormSchema>) => {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: values.name,
                email: values.email,
                password: values.password,
            })
        })

        if (response.ok) {
            console.log(response);
            router.push('/sign-in');
        } else {
            toast({
                title: "Sign up failed",
                description: "Opps, something went wrong.",
                variant: 'destructive',
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm your Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Re-Enter your Password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full mt-6">Sign up</Button>
            </form>
            <div className="mx-auto my-4 flex w-full items-center justify-evenly
            before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400
            after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
                or
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
                If you already have an account, please&nbsp;
                <Link href="/sign-in" className="text-blue-500 hover:underline">Sign in</Link>
            </p>
        </Form>
    );
}