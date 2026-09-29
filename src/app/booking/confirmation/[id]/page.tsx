import { notFound } from "next/navigation";

import { db } from "@/prisma/db";
import { getSession } from "@/lib/auth";
import Link from "next/link";

type BookingConfirmationPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function BookingConfirmationPage({
    params,
}: BookingConfirmationPageProps) {
    const { id } = await params;

    const session = await getSession();

    if (!session) {
        notFound();
    }

    const bookingId = Number(id);

    if (!Number.isInteger(bookingId)) {
        notFound();
    }

    const booking = await db.orm.public.Booking
        .where({
            id: bookingId,
            userId: session.userId,
        })
        .first();

    if (!booking) {
        notFound();
    }

    const bookingSeats = await db.orm.public.BookingSeat
        .where({
            bookingId: booking.id,
        })
        .all();

    const seats = bookingSeats.map(
        (bookingSeat) => bookingSeat.seatNumber
    );

    function formatDate(date: string) {
        return new Date(`${date}T00:00:00`).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        );
    }

    function formatTime(time: string) {
        const [hours, minutes] = time.split(":");

        const hour = Number(hours);
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour =
            hour % 12 === 0 ? 12 : hour % 12;

        return `${displayHour}:${minutes} ${period}`;
    }

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-12">
            <div className="mx-auto max-w-xl">
                {/* Success */}
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-3xl text-slate-950">
                        ✓
                    </div>

                    <h1 className="mt-5 text-3xl font-bold text-white">
                        Booking Confirmed
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Your movie tickets have been booked successfully.
                    </p>
                </div>

                {/* Booking Card */}
                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                    <div className="border-b border-slate-800 p-6">
                        <p className="text-sm text-slate-400">
                            Booking ID
                        </p>

                        <p className="mt-1 text-lg font-semibold text-white">
                            #{booking.id}
                        </p>
                    </div>

                    <div className="space-y-6 p-6">
                        {/* Movie */}
                        <div>
                            <p className="text-sm text-slate-400">
                                Movie
                            </p>

                            <p className="mt-1 text-xl font-semibold text-white">
                                {booking.movieTitle}
                            </p>
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-slate-400">
                                    Date
                                </p>

                                <p className="mt-1 font-medium text-white">
                                    {formatDate(booking.showDate)}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-400">
                                    Time
                                </p>

                                <p className="mt-1 font-medium text-white">
                                    {formatTime(booking.showTime)}
                                </p>
                            </div>
                        </div>

                        {/* Seats */}
                        <div>
                            <p className="text-sm text-slate-400">
                                Seats
                            </p>

                            <p className="mt-1 font-medium text-white">
                                {seats.join(", ")}
                            </p>
                        </div>

                        {/* Total */}
                        <div className="border-t border-slate-800 pt-5">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">
                                    Total Amount
                                </span>

                                <span className="text-xl font-bold text-white">
                                    ₹{booking.totalAmount}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 space-y-3">
                    <Link
                        href="/bookings"
                        className="block w-full rounded-lg bg-white px-5 py-3 text-center font-semibold text-slate-950 transition hover:bg-slate-200"
                    >
                        View My Bookings
                    </Link>
                    
                    <Link
                        href="/movies"
                        className="block w-full rounded-lg bg-white px-5 py-3 text-center font-semibold text-slate-950 transition hover:bg-slate-200"
                    >
                        Browse Movies
                    </Link>
                </div>
            </div>
        </main>
    );
}