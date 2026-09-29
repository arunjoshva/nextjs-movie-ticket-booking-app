import Link from "next/link";
import { notFound } from "next/navigation";

import { db } from "@/prisma/db";
import { getSession } from "@/lib/auth";

type BookingDetailsPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function BookingDetailsPage({
    params,
}: BookingDetailsPageProps) {
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
        <main className="min-h-screen bg-slate-950">
            <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link
                        href="/bookings"
                        className="text-sm text-slate-400 transition hover:text-white"
                    >
                        ← Back to My Bookings
                    </Link>

                    <h1 className="mt-5 text-3xl font-bold text-white">
                        Booking Details
                    </h1>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                    {/* Header */}
                    <div className="flex flex-col gap-4 border-b border-slate-800 p-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-slate-500">
                                Booking ID
                            </p>

                            <p className="mt-1 text-lg font-semibold text-white">
                                #{booking.id}
                            </p>
                        </div>

                        <span className="w-fit rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-400">
                            {booking.status}
                        </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-7 p-6">
                        <div>
                            <p className="text-sm text-slate-500">
                                Movie
                            </p>

                            <h2 className="mt-1 text-2xl font-bold text-white">
                                {booking.movieTitle}
                            </h2>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-slate-500">
                                    Date
                                </p>

                                <p className="mt-1 text-white">
                                    {formatDate(booking.showDate)}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">
                                    Show Time
                                </p>

                                <p className="mt-1 text-white">
                                    {formatTime(booking.showTime)}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Seats
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {seats.map((seat) => (
                                    <span
                                        key={seat}
                                        className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-medium text-white"
                                    >
                                        {seat}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-slate-800 pt-6">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400">
                                    Total Amount
                                </span>

                                <span className="text-2xl font-bold text-white">
                                    ₹{booking.totalAmount}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}