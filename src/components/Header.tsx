import { getSession } from "@/lib/auth";
import Link from "next/link";

export default async function Header(){

    const session = await getSession();

    return(
        <header className="border-b border-slate-800 bg-slate-950">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="text-xl sm:text-2xl font-bold text-white ">
                    🎬 BookShows
                </Link>

                <nav className="flex items-center gap-6 text-sm">
                    <Link href="/movies" className="text-slate-300 transition-colors hover:text-white">Movies</Link>

                    {session ? (
                        <>
                            <Link 
                                href="/bookings"
                                className="text-slate-300 transition-colors hover:text-white"
                            >
                                Bookings
                            </Link>

                            <form action="/api/logout" method="POST">
                                <button
                                    type="submit"
                                    className="rounded-lg bg-white px-4 py-2 font-medium text-slate-950 transition-colors 
                                        hover:bg-slate-200 cursor-pointer"
                                >
                                    Logout
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/register"
                                className="text-slate-300 transition-colors hover:text-white"
                            >
                                Register
                            </Link>

                            <Link
                                href="/login"
                                className="rounded-lg bg-white px-4 py-2 font-medium text-slate-950 transition-colors
                                    hover:bg-slate-200"
                            >
                                Login
                            </Link>
                        </>
                    )}                    
                </nav>
            </div>
        </header>
    );
}