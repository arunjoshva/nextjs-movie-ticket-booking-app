import { NextResponse } from "next/server";

import { db } from "@/prisma/db";
import { movies } from "@/data/movies";
import { shows } from "@/data/shows";
import { theatres } from "@/data/theatres";
import { getSession } from "@/lib/auth";

const seatPrices = {
    BALCONY: 280,
    ELITE: 220,
} as const;

export async function POST(request: Request) {
    try {
        // 1. Check authentication
        const session = await getSession();

        if (!session) {
            return NextResponse.json(
                {
                    message: "You must be logged in to book tickets.",
                },
                { status: 401 }
            );
        }

        // 2. Read request body
        const body = await request.json();

        const showId = body.showId;
        const selectedSeats = body.selectedSeats;

        if (
            typeof showId !== "string" ||
            !Array.isArray(selectedSeats) ||
            selectedSeats.length === 0
        ) {
            return NextResponse.json(
                {
                    message: "Show and seats are required.",
                },
                { status: 400 }
            );
        }

        // 3. Validate selected seats
        if (
            selectedSeats.some(
                (seat) => typeof seat !== "string"
            )
        ) {
            return NextResponse.json(
                {
                    message: "Invalid seat selection.",
                },
                { status: 400 }
            );
        }

        // 4. Find the show in our hardcoded data
        const show = shows.find(
            (show) => show.id === showId
        );

        if (!show) {
            return NextResponse.json(
                {
                    message: "Selected show was not found.",
                },
                { status: 404 }
            );
        }

        // 5. Find movie and theatre
        const movie = movies.find(
            (movie) => movie.id === show.movieId
        );

        const theatre = theatres.find(
            (theatre) => theatre.id === show.theatreId
        );

        if (!movie || !theatre) {
            return NextResponse.json(
                {
                    message: "Movie or theatre was not found.",
                },
                { status: 404 }
            );
        }

        // 6. Calculate the total on the server
        const totalAmount = selectedSeats.reduce(
            (total, seatNumber) => {
                const row = seatNumber.charAt(0);

                const price =
                    row === "A"
                        ? seatPrices.BALCONY
                        : seatPrices.ELITE;

                return total + price;
            },
            0
        );

        // 7. Create Booking + BookingSeat records
        const booking = await db.transaction(async (tx) => {
            const createdBooking =
                await tx.orm.public.Booking.create({
                    userId: session.userId,
                    movieId: movie.id,
                    movieTitle: movie.title,
                    showKey: show.id,
                    showDate: show.date,
                    showTime: show.time,
                    totalAmount,
                    status: "CONFIRMED",
                });

            for (const seatNumber of selectedSeats) {
                await tx.orm.public.BookingSeat.create({
                    bookingId: createdBooking.id,
                    showKey: show.id,
                    seatNumber,
                });
            }

            return createdBooking;
        });

        // 8. Return booking information
        return NextResponse.json(
            {
                message: "Booking created successfully.",
                booking: {
                    id: booking.id,
                    movieTitle: booking.movieTitle,
                    showDate: booking.showDate,
                    showTime: booking.showTime,
                    totalAmount: booking.totalAmount,
                    seats: selectedSeats,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Booking error:", error);

        if (
            error instanceof Error &&
            "sqlState" in error &&
            error.sqlState === "23505"
        ) {
            return NextResponse.json(
                {
                    message:
                        "One or more selected seats have already been booked.",
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            {
                message:
                    "Something went wrong while creating the booking.",
            },
            { status: 500 }
        );
    }
}