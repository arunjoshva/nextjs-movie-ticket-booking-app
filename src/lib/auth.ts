// The purpose is to avoid repeating JWT cookie-reading and verification logic throughout your application.

import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function getSession() {
    const cookieStore = await cookies();

    const token = cookieStore.get("bookshows_session")?.value;

    if(!token){
        return null;
    }

    try {
        const { payload } = await jwtVerify(token, secret);

        if(typeof payload.userId !== "number"){
            return null;
        }

        return {
            userId: payload.userId
        };
    } catch (error) {
        return null;
    }
}