import type { Movie } from "@/data/movies"
import Image from "next/image";
import Link from "next/link";

type MovieCardProps = {
    movie: Movie
}

export default function MovieCard({movie}: MovieCardProps){
    return(
        <Link href={`/movies/${movie.id}`}>
        <article className="overflow-hidden rounded-2xl bg-slate-900 transition hover:-translate-y-1 hover:shadow-lg">
            
                <div className="relative aspect-3/4 w-full overflow-hidden bg-slate-800">
                    <Image
                        src={movie.poster}
                        alt={movie.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"                    
                    />
                </div>            
                

                <div className="p-3 sm:p-4">
                    <h2 className="line-clamp-1 text-base font-semibold text-white sm:text-lg">
                        {movie.title}
                    </h2>

                    <p className="mt-1 line-clamp-1 text-xs text-slate-400 sm:mt-2 sm:text-sm">
                        {movie.genre}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-xs sm:mt-3 sm:text-sm">
                        <span className="text-slate-400">
                            {movie.duration} min
                        </span>

                        <span className="text-white">
                            ★ {movie.rating}
                        </span>
                    </div>
                </div>       
        </article>
        </Link>
    );
}