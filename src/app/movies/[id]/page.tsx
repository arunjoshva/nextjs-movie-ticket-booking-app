import AvailableShows from "@/components/AvailableShows";
import { movies } from "@/data/movies";
import { shows } from "@/data/shows";
import { theatres } from "@/data/theatres";
import Image from "next/image";
import { notFound } from "next/navigation";

type MovieDetailsPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function MovieDetailsPage({params}: MovieDetailsPageProps){
    const { id } = await params;

    const movie = movies.find((movie) => movie.id === id);

    if(!movie){
        notFound();
    }

    const movieShows = shows.filter((show) => show.movieId === movie.id);

    return(
        <main>
            {/* Movie Information */}
            <section className="border-b border-slate-800 bg-slate-900">
                <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[280px_1fr] lg:px-8">
                    <div className="relative mx-auto h-82.5 w-55 overflow-hidden rounded-xl bg-slate-800
                        md:mx-0 md:h-105 md:w-70">
                        <Image
                            src={movie.poster}
                            alt={movie.title}
                            fill
                            priority
                            sizes="(max-width: 768px) 220px, 280px"
                            className="object-cover"                        
                        />
                    </div>

                    <div className="flex flex-col justify-center">
                        <h1 className="text-3xl font-bold text-white sm:text-4xl">{movie.title}</h1>

                        <div className="mt-4 flex flex-wrap gap-3 text-sm">
                            <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                                {movie.genre}
                            </span>

                            <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                                {movie.duration} min
                            </span>

                            <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                                {movie.language}
                            </span>

                            <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                                {movie.certificate}
                            </span>
                        </div>

                        <div className="mt-5 flex items-center gap-5">
                            <span className="text-lg font-semibold text-white">
                                ★ {movie.rating}
                            </span>
                            
                            <span className="text-sm text-slate-400">
                                Released {" "} {new Date(movie.releaseDate).toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    }
                                )}
                            </span>
                        </div>

                        <p className="mt-6 max-w-3xl leading-7 text-slate-300">
                            {movie.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Shows */}
            <AvailableShows
                shows={movieShows}
                theatres={theatres}
            />
        </main>
    );
}