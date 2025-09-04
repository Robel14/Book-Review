"use client";
import { useState } from "react";
import Image from "next/image";

export default function HomePage() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex w-full  h-screen overflow-hidden "> {/* full viewport */}

      <section className="w-1/2 h-full relative flex-shrink-0">
        <Image
          src="/hom.png"
          alt="Logo"
          fill
          className="object-cover"
        />
      </section>

      {/* Right: Text Section */}
      <section className="w-1/2 h-full bg-amber-200 flex flex-col justify-center p-16 min-w-0">
        <h1 className="text-5xl font-bold mb-6">
          Welcome to the Book Review Platform
        </h1>

        {/* Fixed-height text container */}
        <div className={`overflow-hidden ${expanded ? "h-auto" : "h-48"} relative transition-all duration-300`}>
          <p className="text-lg">
            {expanded
              ? "Our platform allows book lovers to explore thousands of books, read reviews from other readers, and share their own opinions. You can browse books by author, title, or genre, post reviews, and keep track of your favorite reads. Whether you're into classics, modern fiction, or non-fiction, our community-driven platform helps you discover your next great read."
              : "Discover and review your favorite books!"}
          </p>

          {/* Gradient overlay when collapsed */}
          {!expanded && (
            <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-amber-200"></div>
          )}
        </div>

        <button
          className="text-blue-600 underline hover:text-blue-800 mt-4 self-start"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Read Less" : "Read More"}
        </button>
      </section>

    </div>
  );
}
