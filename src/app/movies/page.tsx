import MovieCard from "@/components/MovieCard";
import { movies } from "@/data/movies";

export default function MoviesPage(){
    return(
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-950">Movies</h1>

                <p className="mt-2 text-slate-700">Browse movies and choose a show to book your tickets</p>
            </div>  

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie}  />
                ))}
            </div>
        </section>
    );
}