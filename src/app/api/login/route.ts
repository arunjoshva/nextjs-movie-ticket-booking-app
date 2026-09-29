import { db } from "@/prisma/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json(); // parsing json to jso

        const email = body.email?.trim().toLowerCase();

        const password = body.password;

        if(!email || !password){
            return NextResponse.json(
                {
                    success: false,
                    message: "Email and password are required"
                },
                {
                    status: 400
                }
            );
        }

        const user = await db.orm.public.User
            .where({ email })
            .first();

        if(!user){
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid email or password"
                },
                {
                    status: 401
                }
            );
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if(!passwordMatch){
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid email or password"
                },
                {
                    status: 401
                }
            );
        }

        const token = await new SignJWT({
            userId: user.id
        })
            .setProtectedHeader({
                alg: "HS256"
            })
            .setIssuedAt()
            .setExpirationTime("7d")
            .sign(secret);

        const response = NextResponse.json(
            {
                success: true,
                message: "Login Successful.",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            },
            {
                status: 200
            }
        );

        response.cookies.set({
            name: "bookshows_session",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7
        });

        return response;
    } catch (error) {
        console.error(`Login Error: ${error}`);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong. Please try again"
            },
            {
                status: 500
            }
        );
    }
}