import { notFound } from "next/navigation";

import BookingShowSelector from "@/components/BookingShowSelector";
import { movies } from "@/data/movies";
import { shows } from "@/data/shows";
import { theatres } from "@/data/theatres";
import SeatLayout from "@/components/SeatLayout";

type BookingPageProps = {
    params: Promise<{
        showId: string;
    }>;
};

export default async function BookingPage({
    params,
}: BookingPageProps) {
    const { showId } = await params;

    const selectedShow = shows.find(
        (show) => show.id === showId
    );

    if (!selectedShow) {
        notFound();
    }

    const movie = movies.find(
        (movie) => movie.id === selectedShow.movieId
    );

    const theatre = theatres.find(
        (theatre) => theatre.id === selectedShow.theatreId
    );

    if (!movie || !theatre) {
        notFound();
    }

    const movieTheatreShows = shows.filter(
        (show) =>
            show.movieId === movie.id &&
            show.theatreId === theatre.id
    );

    return (
        <main className="min-h-screen overflow-x-hidden bg-slate-950">
            {/* Booking Header */}
            <section className="border-b border-slate-800 bg-slate-900 text-center">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-white sm:text-3xl">
                        {movie.title}
                    </h1>

                    <p className="mt-2 text-sm text-slate-400">
                        {theatre.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        {theatre.location},{" "}
                        {theatre.city}
                    </p>
                </div>
            </section>

            {/* Date + Show Selection */}
            <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <BookingShowSelector
                    shows={movieTheatreShows}
                    selectedShowId={selectedShow.id}
                />

                <SeatLayout showId={selectedShow.id} />
            </section>
        </main>
    );
}