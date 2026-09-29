import { NextResponse } from "next/server";

import { db } from "@/prisma/db";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const showId = searchParams.get("showId");

        if (!showId) {
            return NextResponse.json(
                {
                    message: "Show ID is required.",
                },
                { status: 400 }
            );
        }

        const bookingSeats =
            await db.orm.public.BookingSeat
                .where({
                    showKey: showId,
                })
                .all();

        const occupiedSeats = bookingSeats.map(
            (bookingSeat) => bookingSeat.seatNumber
        );

        return NextResponse.json({
            occupiedSeats,
        });
    } catch (error) {
        console.error("Occupied seats error:", error);

        return NextResponse.json(
            {
                message:
                    "Something went wrong while getting occupied seats.",
            },
            { status: 500 }
        );
    }
}