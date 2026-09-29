"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type Seat = {
    id: string;
    row: string;
    number: number;
    category: "SOFA" | "ELITE";
    price: number;
};

type SeatLayoutProps = {
    showId: string;
};

const seats: Seat[] = [
    // Sofa
    ...Array.from({ length: 10 }, (_, index) => ({
        id: `A${index + 1}`,
        row: "A",
        number: index + 1,
        category: "SOFA" as const,
        price: 280,
    })),

    // Elite
    ...["B", "C", "D", "E", "F"].flatMap((row) =>
        Array.from({ length: 10 }, (_, index) => ({
            id: `${row}${index + 1}`,
            row,
            number: index + 1,
            category: "ELITE" as const,
            price: 220,
        }))
    ),
];

export default function SeatLayout({showId}: SeatLayoutProps) {
    const router = useRouter();

    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchOccupiedSeats() {
            try {
                const response = await axios.get(
                    `/api/booking/seats?showId=${encodeURIComponent(showId)}`
                );

                setOccupiedSeats(response.data.occupiedSeats);
            } catch (error) {
                console.error(
                    "Failed to load occupied seats:",
                    error
                );
            }
        }

        fetchOccupiedSeats();
    }, [showId]);

    function toggleSeat(seatId: string) {
        if (occupiedSeats.includes(seatId)) {
            return;
        }

        setSelectedSeats((currentSeats) =>
            currentSeats.includes(seatId)
                ? currentSeats.filter((id) => id !== seatId)
                : [...currentSeats, seatId]
        );
    }

    const selectedSeatDetails = seats.filter((seat) =>
        selectedSeats.includes(seat.id)
    );

    const totalAmount = selectedSeatDetails.reduce(
        (total, seat) => total + seat.price,
        0
    );

    const sofaSeats = seats.filter(
        (seat) => seat.category === "SOFA"
    );

    const eliteSeats = seats.filter(
        (seat) => seat.category === "ELITE"
    );

    const rows = ["B", "C", "D", "E", "F"];

    async function handleContinue() {
        if (selectedSeats.length === 0) {
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post("/api/booking", {
                showId,
                selectedSeats,
            });

            const bookingId = response.data.booking.id;

            router.push(`/booking/confirmation/${bookingId}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(
                    error.response?.data?.message ||
                    "Booking failed"
                );
            } else {
                console.error("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
}

    return (
        <section className="mt-10">
            {/* Sofa */}
            <div>
                <h3 className="mb-5 text-center text-lg font-bold text-white">
                    BALCONY : ₹280
                </h3>

                <SeatRow
                    seats={sofaSeats}
                    selectedSeats={selectedSeats}
                    occupiedSeats={occupiedSeats}
                    onToggle={toggleSeat}
                />
            </div>

            {/* Elite */}
            <div className="mt-10">
                <h3 className="mb-5 text-center text-lg font-bold text-white">
                    ELITE : ₹220
                </h3>

                <div className="space-y-3">
                    {rows.map((row) => {
                        const rowSeats = eliteSeats.filter(
                            (seat) => seat.row === row
                        );

                        return (
                            <SeatRow
                                key={row}
                                seats={rowSeats}
                                selectedSeats={selectedSeats}
                                occupiedSeats={occupiedSeats}
                                onToggle={toggleSeat}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Screen */}
            <div className="mt-12 mb-8 flex flex-col items-center">
                <div className="relative h-10 w-[72%] max-w-md">
                    {/* Screen surface */}
                    <div
                        className="absolute inset-0 border-4 border-slate-300 bg-slate-300/20 shadow-[0_8px_20px_rgba(148,163,184,0.25)]"
                        style={{
                            clipPath:
                                "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)",
                        }}
                    />

                    {/* Screen inner area */}
                    <div
                        className="absolute inset-1.25"
                        style={{
                            clipPath:
                                "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)",
                            background:
                                "linear-gradient(to bottom, rgba(148,163,184,0.35), rgba(148,163,184,0.08))",
                        }}
                    />
                </div>

                <p className="mt-4 text-xs font-semibold tracking-[0.3em] text-slate-500">
                    SCREEN THIS WAY
                </p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded border border-slate-500 bg-transparent" />
                    Available
                </div>

                <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-700 text-xs text-slate-400">
                        ×
                    </span>
                    Occupied
                </div>

                <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded bg-white" />
                    Selected
                </div>
            </div>

            {/* Booking Summary */}
            <div className="mx-auto mt-8 w-full max-w-xl rounded-xl border border-slate-800 bg-slate-900 p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-slate-400">
                            Selected Seats
                        </p>

                        <p className="mt-1 font-medium text-white">
                            {selectedSeats.length > 0
                                ? selectedSeats.join(", ")
                                : "No seats selected"}
                        </p>
                    </div>

                    <div className="text-left sm:text-right">
                        <p className="text-sm text-slate-400">
                            Total
                        </p>

                        <p className="mt-1 text-xl font-bold text-white">
                            ₹{totalAmount}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleContinue}
                    disabled={selectedSeats.length === 0 || loading}
                    className="mt-5 w-full rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 transition 
                        hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                >
                    {loading ? "Booking..." : "Continue"}
                </button>
            </div>
        </section>
    );
}

type SeatRowProps = {
    seats: Seat[];
    selectedSeats: string[];
    occupiedSeats: string[];
    onToggle: (seatId: string) => void;
};

function SeatRow({
    seats,
    selectedSeats,
    occupiedSeats,
    onToggle,
}: SeatRowProps) {
    const row = seats[0]?.row;

    const leftSeats = seats.slice(0, 5);
    const rightSeats = seats.slice(5);

    return (
        <div className="flex w-full items-center justify-center">
            {/* Row label */}
            <span className="mr-2 w-5 shrink-0 text-center text-xs font-medium text-slate-400 sm:mr-3 sm:text-sm">
                {row}
            </span>

            {/* Left side */}
            <div className="grid grid-cols-5 gap-1 sm:gap-2">
                {leftSeats.map((seat) => (
                    <SeatButton
                        key={seat.id}
                        seat={seat}
                        selected={selectedSeats.includes(seat.id)}
                        occupied={occupiedSeats.includes(seat.id)}
                        onToggle={onToggle}
                    />
                ))}
            </div>

            {/* Centre aisle */}
            <div className="w-4 shrink-0 sm:w-6" />

            {/* Right side */}
            <div className="grid grid-cols-5 gap-1 sm:gap-2">
                {rightSeats.map((seat) => (
                    <SeatButton
                        key={seat.id}
                        seat={seat}
                        selected={selectedSeats.includes(seat.id)}
                        occupied={occupiedSeats.includes(seat.id)}
                        onToggle={onToggle}
                    />
                ))}
            </div>
        </div>
    );
}

type SeatButtonProps = {
    seat: Seat;
    selected: boolean;
    occupied: boolean;
    onToggle: (seatId: string) => void;
};

function SeatButton({
    seat,
    selected,
    occupied,
    onToggle,
}: SeatButtonProps) {
    return (
        <button
            type="button"
            onClick={() => onToggle(seat.id)}
            disabled={occupied}
            aria-label={`Seat ${seat.id}`}
            className={`h-8 w-8 rounded-md border text-[11px] transition sm:h-9 sm:w-9 sm:text-xs ${
                occupied
                    ? "cursor-not-allowed border-slate-700 bg-slate-700 text-slate-500"
                    : selected
                        ? "cursor-pointer border-white bg-white text-slate-950"
                        : "cursor-pointer border-slate-600 bg-transparent text-slate-300 hover:border-white"
            }`}
        >
            {occupied ? "×" : seat.number}
        </button>
    );
}