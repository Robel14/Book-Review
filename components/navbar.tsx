"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setUser(data.session.user);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() === "") return;
    router.push(`/books?search=${encodeURIComponent(query)}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between gap-6">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={80}
              className="rounded cursor-pointer left-2"
            />
          </Link>
          <form onSubmit={handleSearch} className="flex-1 max-w-3xl relative">
            <input
              type="text"
              placeholder="Search for books or authors..."
              className="pl-10 pr-10 py-2 w-full rounded-xl 
                         border-0 ring-1 ring-slate-200 dark:ring-slate-700
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                         bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm
                         placeholder:text-slate-400 text-base
                         shadow-sm focus:shadow-md transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </form>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <Link href="/books" className="hover:underline">
              Books
            </Link>
             
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-blue-300 hover:bg-blue-200 text-white"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg bg-green-300 hover:bg-green-200 text-white"
            >
              Signup
            </Link>
          </div>

    
          <div className="flex gap-4 items-center">
      
            {user && (
              <>
                <span className="ml-3">Hi, {user.user_metadata?.full_name || user.email}</span>
                <Link
                  href="/profile"
                  className="underline hover:text-gray-300"
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="underline cursor-pointer bg-transparent border-none p-0 hover:text-gray-300"
                >
                  Logout
                </button>
                {user?.user_metadata?.role === "admin" && (
                  <Link href="/admin" className="hover:underline">
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
