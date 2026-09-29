"use client";

import axios, { isAxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault(); // prevents the default behaviour of the browser

        setError("");

        try {
            setLoading(true);

            await axios.post("/api/login", {
                email,
                password
            });

            router.push("/");
        } catch (error) {
            if(axios.isAxiosError(error)){
                setError(
                    error.response?.data?.message || "Login Failed"
                );
            }else{
                setError("Something went wrong. Please try again.");
            }
        }finally{
            setLoading(false);
        }
    }

    return(
        <section className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-sm items-center px-4 py-10">
            <div className="w-full rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white">Welcome Back</h1>

                    <p className="mt-2 text-sm text-slate-400">Login to book your movie tickets</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
                            Email
                        </label>

                        <input 
                            type="email"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required 
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none
                                placeholder:text-slate-500 focus:border-slate-400"
                        />        
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
                            Password
                        </label>

                        <input 
                            type="password"
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required 
                            minLength={6}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none
                                placeholder:text-slate-500 focus:border-slate-400"
                        />        
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-white px-4 py-3 font-semibold text-slate-950 transition-colors
                            hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-400">
                    Don't have an account?{" "}
                    <Link
                        href="/register"
                        className="font-medium text-white hover:text-slate-300"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </section>
    );
}