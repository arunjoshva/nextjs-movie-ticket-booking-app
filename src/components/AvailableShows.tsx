"use client";

import Link from "next/link";
import { useState } from "react";

import type { Show } from "@/data/shows";
import type { Theatre } from "@/data/theatres";

type AvailableShowsProps = {
    shows: Show[];
    theatres: Theatre[];
};

export default function AvailableShows({
    shows,
    theatres,
}: AvailableShowsProps) {
    const availableDates = Array.from(
        new Set(shows.map((show) => show.date))
    ).sort();

    const [selectedDate, setSelectedDate] = useState(
        availableDates[0] ?? ""
    );

    const selectedDateShows = shows.filter(
        (show) => show.date === selectedDate
    );

    const theatreShows = theatres
        .map((theatre) => ({
            theatre,
            shows: selectedDateShows.filter(
                (show) => show.theatreId === theatre.id
            ),
        }))
        .filter((item) => item.shows.length > 0);

    function formatDate(date: string) {
        const dateObject = new Date(`${date}T00:00:00`);

        return {
            weekday: dateObject.toLocaleDateString("en-IN", {
                weekday: "short",
            }),
            day: dateObject.toLocaleDateString("en-IN", {
                day: "numeric",
            }),
            month: dateObject.toLocaleDateString("en-IN", {
                month: "short",
            }),
        };
    }

    function formatTime(time: string) {
        const [hours, minutes] = time.split(":");
        const hour = Number(hours);

        const period = hour >= 12 ? "PM" : "AM";
        const displayHour =
            hour % 12 === 0 ? 12 : hour % 12;

        return `${displayHour}:${minutes} ${period}`;
    }

    if (availableDates.length === 0) {
        return (
            <section className="bg-slate-950">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-white">
                        Available Shows
                    </h2>

                    <p className="mt-2 text-slate-400">
                        No shows are currently available.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Heading */}
                <div>
                    <h2 className="text-2xl font-bold text-white sm:text-3xl">
                        Available Shows
                    </h2>

                    <p className="mt-2 text-sm text-slate-400 sm:text-base">
                        Select a date and choose your preferred show.
                    </p>
                </div>

                {/* Date Selector */}
                <div className="mt-7 overflow-x-auto pb-2">
                    <div className="flex min-w-max gap-3">
                        {availableDates.map((date) => {
                            const formatted = formatDate(date);
                            const selected =
                                date === selectedDate;

                            return (
                                <button
                                    key={date}
                                    type="button"
                                    onClick={() =>
                                        setSelectedDate(date)
                                    }
                                    className={`w-17 rounded-xl border px-3 py-3 text-center transition sm:w-21 cursor-pointer ${
                                        selected
                                            ? "border-white bg-white text-slate-950"
                                            : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
                                    }`}
                                >
                                    <span className="block text-xs font-medium">
                                        {formatted.weekday}
                                    </span>

                                    <span className="mt-1 block text-xl font-bold">
                                        {formatted.day}
                                    </span>

                                    <span className="block text-xs">
                                        {formatted.month}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Theatre list */}
                <div className="mt-8 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
                    {theatreShows.map(
                        ({ theatre, shows }, index) => (
                            <div
                                key={theatre.id}
                                className={`p-5 sm:p-6 ${
                                    index !==
                                    theatreShows.length - 1
                                        ? "border-b border-slate-800"
                                        : ""
                                }`}
                            >
                                {/* Theatre information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        {theatre.name}
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-400">
                                        {theatre.location},{" "}
                                        {theatre.city}
                                    </p>
                                </div>

                                {/* Show times */}
                                <div className="mt-5 flex flex-wrap gap-3">
                                    {shows.map((show) => (
                                        <Link
                                            key={show.id}
                                            href={`/booking/${show.id}`}
                                            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-center transition hover:border-white hover:bg-slate-800"
                                        >
                                            <span className="block font-medium text-white">
                                                {formatTime(
                                                    show.time
                                                )}
                                            </span>

                                            <span className="mt-1 block text-xs text-slate-400">
                                                ₹{show.price}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* No shows for selected date */}
                {theatreShows.length === 0 && (
                    <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
                        <p className="text-slate-400">
                            No shows available for this date.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}