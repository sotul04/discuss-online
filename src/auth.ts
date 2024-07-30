import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import  db  from "./db";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/sign-in',
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "email@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, _) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const existingUser = await db.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });
                if (!existingUser || !existingUser.password) {
                    return null;
                }

                const passwordMatch = await compare(credentials.password, existingUser.password);

                if (!passwordMatch) {
                    return null;
                }

                return {
                    id: `${existingUser.id}`,
                    name: existingUser.name,
                    email: existingUser.email
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    username: token.username
                }
            }
        },
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token
                }
            }
            return token
        }
    }
}