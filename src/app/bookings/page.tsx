import Link from "next/link";
import { notFound } from "next/navigation";

import { db } from "@/prisma/db";
import { getSession } from "@/lib/auth";

export default async function MyBookingsPage() {
    const session = await getSession();

    if (!session) {
        notFound();
    }

    const bookings = await db.orm.public.Booking
        .where({
            userId: session.userId,
        })
        .all();

    const bookingSeats: {
        bookingId: number;
        seatNumber: string;
    }[] = [];

    for (const booking of bookings) {
        const seats = await db.orm.public.BookingSeat
            .where({
                bookingId: booking.id,
            })
            .all();

        bookingSeats.push(...seats);
    }

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
        <main className="min-h-screen bg-slate-950">
            <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        My Bookings
                    </h1>

                    <p className="mt-2 text-slate-400">
                        View your movie ticket bookings.
                    </p>
                </div>

                {bookings.length === 0 ? (
                    <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
                        <h2 className="text-xl font-semibold text-white">
                            No bookings yet
                        </h2>

                        <p className="mt-2 text-slate-400">
                            You haven't booked any movie tickets yet.
                        </p>

                        <Link
                            href="/movies"
                            className="mt-6 inline-block rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-200"
                        >
                            Browse Movies
                        </Link>
                    </div>
                ) : (
                    <div className="mt-8 space-y-5">
                        {bookings.map((booking) => {
                            const seats = bookingSeats
                                .filter(
                                    (bookingSeat) =>
                                        bookingSeat.bookingId ===
                                        booking.id
                                )
                                .map(
                                    (bookingSeat) =>
                                        bookingSeat.seatNumber
                                );

                            return (
                                <article
                                    key={booking.id}
                                    className="rounded-xl border border-slate-800 bg-slate-900 p-5 sm:p-6"
                                >
                                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <p className="text-sm text-slate-500">
                                                Booking #{booking.id}
                                            </p>

                                            <h2 className="mt-1 text-xl font-semibold text-white">
                                                {booking.movieTitle}
                                            </h2>
                                        </div>

                                        <span className="w-fit rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400">
                                            {booking.status}
                                        </span>
                                    </div>

                                    <div className="mt-6 grid gap-5 sm:grid-cols-3">
                                        <div>
                                            <p className="text-sm text-slate-500">
                                                Date
                                            </p>

                                            <p className="mt-1 text-white">
                                                {formatDate(
                                                    booking.showDate
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-slate-500">
                                                Time
                                            </p>

                                            <p className="mt-1 text-white">
                                                {formatTime(
                                                    booking.showTime
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-slate-500">
                                                Seats
                                            </p>

                                            <p className="mt-1 text-white">
                                                {seats.join(", ")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-col gap-4 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <span className="text-slate-400">
                                                Total
                                            </span>

                                            <p className="mt-1 text-xl font-bold text-white">
                                                ₹{booking.totalAmount}
                                            </p>
                                        </div>

                                        <Link
                                            href={`/bookings/${booking.id}`}
                                            className="rounded-lg border border-slate-700 px-5 py-3 text-center font-medium text-white transition hover:border-slate-500 hover:bg-slate-800"
                                        >
                                            View Booking
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}