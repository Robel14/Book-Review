"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import BookCard from "../../components/BookCard";

type Book = {
  id: number;
  title: string;
  author: string;
  description?: string;
  cover_image?: string; 
};

export default function BooksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search")?.toLowerCase() || "";

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      const { data, error } = await supabase.from<Book>("books").select("*");

      if (error) {
        console.error(error);
      } else {
        setBooks(data || []);
      }

      setLoading(false);
    }

    fetchBooks();
  }, []);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search) ||
      book.author.toLowerCase().includes(search)
  );

  if (loading) return <p>Loading books...</p>;

  return (
    <section className="text-center">
      <h1 className="text-3xl font-semibold mb-6">Books</h1>

      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              cover_image={book.cover_image} 
              onClick={() => router.push(`/books/${book.id}`)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No books found for “{search}”.</p>
      )}
    </section>
  );
}
