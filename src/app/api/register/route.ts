import { db } from "@/prisma/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const name = body.name?.trim();
        const email = body.email?.trim();
        const password = body.password

        if(!name || !email || !password){
            return NextResponse.json(
                {
                    success: false,
                    message: "Name, email and password are required"
                },
                {
                    status: 400
                }
            );
        }

        if(password.length < 6){
            return NextResponse.json(
                {
                    success: false,
                    message: "Password must be atleast 6 characters"
                },
                {
                    status: 400
                }
            );
        }

        const existingUser = await db.orm.public.User
            .where({ email })
            .first();

        if(existingUser){
            return NextResponse.json(
                {
                    success: false,
                    message: "An account with this email already exists"
                },
                {
                    status: 409
                }
            );
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await db.orm.public.User.create({
            name,
            email,
            passwordHash
        });

        return NextResponse.json(
            {   
                id: user.id,
                name: user.name,
                email: user.email
            },
            {
                status: 201
            }
        );
    } catch (error) {
        console.error(`Registration error: ${error}`);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong. Please try again."
            },
            {
                status: 500
            }
        );
    }
}