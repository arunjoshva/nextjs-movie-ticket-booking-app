import { db } from "@/prisma/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const users = await db.orm.public.User.all();

        return NextResponse.json({
            success: true,
            users
        });
    } catch (error) {
        console.error(`Database connection error: ${error}`);

        return NextResponse.json(
            {
                success: false,
                message: "Database connection failed"
            },
            {
                status: 500
            }
        );
    }
}