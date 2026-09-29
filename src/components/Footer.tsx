import Link from "next/link";

export default function Footer(){
    return(
        <footer className="border-t border-slate-800 bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 py-3 text-center text-sm text-slate-400 sm:px-6 lg:px-8">
                 © {new Date().getFullYear()} <Link href="/" className="hover:text-white">BookShows</Link> | All Rights Reserved
            </div>
        </footer>
    );
}