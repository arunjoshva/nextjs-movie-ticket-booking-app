"use client";

import { useState } from "react";
import type { Show } from "@/data/shows";

type BookingShowSelectorProps = {
    shows: Show[];
    selectedShowId: string;
};

export default function BookingShowSelector({
    shows,
    selectedShowId,
}: BookingShowSelectorProps) {
    const selectedShow = shows.find(
        (show) => show.id === selectedShowId
    );

    const availableDates = Array.from(
        new Set(shows.map((show) => show.date))
    ).sort();

    const [selectedDate, setSelectedDate] = useState(
        selectedShow?.date ?? availableDates[0]
    );

    const [selectedTime, setSelectedTime] = useState(
        selectedShow?.time ?? ""
    );

    const dateShows = shows.filter(
        (show) => show.date === selectedDate
    );

    return (
        <div className="space-y-8">
            {/* Calendar */}
            <div>
                <h2 className="mb-4 text-lg font-semibold text-white">
                    Select Date
                </h2>

                <div className="grid grid-cols-5 gap-2 sm:flex sm:gap-3">
                    {availableDates.map((date) => {
                        const dateObject = new Date(
                            `${date}T00:00:00`
                        );

                        const isSelected =
                            date === selectedDate;

                        return (
                            <button
                                key={date}
                                type="button"
                                onClick={() => {
                                    setSelectedDate(date);

                                    const firstShow =
                                        shows.find(
                                            (show) =>
                                                show.date === date
                                        );

                                    setSelectedTime(
                                        firstShow?.time ?? ""
                                    );
                                }}
                                className={`max-w-xl rounded-xl border px-2 py-3 text-center transition sm:min-w-19.5 sm:px-3
                                    cursor-pointer ${
                                    isSelected
                                        ? "border-white bg-white text-slate-950"
                                        : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
                                }`}
                            >
                                <span className="block text-xs font-medium">
                                    {dateObject.toLocaleDateString(
                                        "en-IN",
                                        {
                                            weekday: "short",
                                        }
                                    )}
                                </span>

                                <span className="mt-1 block text-xl font-bold">
                                    {dateObject.getDate()}
                                </span>

                                <span className="block text-xs">
                                    {dateObject.toLocaleDateString(
                                        "en-IN",
                                        {
                                            month: "short",
                                        }
                                    )}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Show Times */}
            <div>
                <h2 className="mb-4 text-lg font-semibold text-white">
                    Select Show Time
                </h2>

                <div className="flex flex-wrap gap-3">
                    {dateShows.map((show) => {
                        const isSelected =
                            show.time === selectedTime;

                        return (
                            <button
                                key={show.id}
                                type="button"
                                onClick={() =>
                                    setSelectedTime(show.time)
                                }
                                className={`rounded-lg border px-5 py-3 transition cursor-pointer ${
                                    isSelected
                                        ? "border-white bg-white text-slate-950"
                                        : "border-slate-700 bg-slate-900 text-white hover:border-slate-500"
                                }`}
                            >
                                <span className="block font-medium">
                                    {show.time}
                                </span>

                                <span
                                    className={`mt-1 block text-sm ${
                                        isSelected
                                            ? "text-slate-600"
                                            : "text-slate-400"
                                    }`}
                                >
                                    ₹{show.price}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}