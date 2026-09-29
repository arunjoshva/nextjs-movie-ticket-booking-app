import MovieCard from "@/components/MovieCard";
import { movies } from "@/data/movies";
import Link from "next/link";
import { theatres } from "@/data/theatres";

export default function Home() {
  const featuredMovies = movies.slice(0, 6);  

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_60%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">
              Welcome to BookShows
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Discover your next favorite movie.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Discover movies, explore theatres, choose your preferred show, and book your seats with ease.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link 
                href="/movies"
                className="rounded-lg bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Browse Movies
              </Link>              
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Movies */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">
              Recommended Movies
            </h2>            
          </div>

          <Link
            href="/movies"
            className="hidden text-sm font-medium text-slate-950 transition-colors sm:block"
          >
            View all movies →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {featuredMovies.map((movie, index) => (
            <div
              key={movie.id}
              className={index >= 4 ? "lg:hidden" : ""}
            >
              <MovieCard movie={movie} />
            </div>
            
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/movies"
            className="text-sm font-semibold bg-slate-950 text-white transition px-6 py-3 rounded-lg"
          >
            View all movies →
          </Link>
        </div>
      </section>      
    </main>
  );
}
