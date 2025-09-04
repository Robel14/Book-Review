"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import ReviewList from "../../../components/ReviewList";
import ReviewForm from "../../../components/ReviewForm";

type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_image: string;
};

type Review = {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  users: { name: string } | null;
};

type User = {
  id: string;
  name: string;
  role: "user" | "admin";
};

export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user.id;
      if (!userId) {
        router.push("/login");
        return;
      }
      const { data: userData } = await supabase
        .from<User>("users")
        .select("*")
        .eq("id", userId)
        .single();
      if (!userData) return;
      setCurrentUser(userData);
 const { data: bookData } = await supabase
        .from<Book>("books")
        .select("*")
        .eq("id", id)
        .single();
      setBook(bookData || null);
         const { data: favData } = await supabase
        .from("favorites")
        .select("*")
        .eq("book_id", id)
        .eq("user_id", userId)
        .single();
      setIsFavorite(!!favData);
      const { data: reviewsData } = await supabase
        .from<Review>("reviews")
        .select("id, user_id, rating, comment, created_at, users(name)")
        .eq("book_id", id)
        .order("created_at", { ascending: false });

      setReviews(reviewsData || []);
      setLoading(false);
    }

    fetchData();
  }, [id, router]);
  const handleFavorite = async () => {
    if (!currentUser || !book) return;
    if (isFavorite) {
      await supabase
        .from("favorites")
        .delete()
        .eq("book_id", book.id)
        .eq("user_id", currentUser.id);
      setIsFavorite(false);
    } else {
      await supabase.from("favorites").insert({
        book_id: book.id,
        user_id: currentUser.id,
      });
      setIsFavorite(true);
    }
  };
  const handleAddReview = async (rating: number, comment: string) => {
    if (!currentUser) return;
    if (currentUser.role === "admin") {
      alert("Admins cannot submit reviews.");
      return;
    }
    const { data: newReview } = await supabase
      .from("reviews")
      .insert([{ user_id: currentUser.id, book_id: id, rating, comment }])
      .select("id, user_id, rating, comment, created_at, users(name)")
      .single();

    setReviews((prev) => [newReview, ...prev]);
  };
  const handleDelete = async (reviewId: string) => {
    if (!currentUser) return;
    await supabase.from("reviews").delete().eq("id", reviewId);
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };
  const handleEdit = async (reviewId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    const { data: updatedReview } = await supabase
      .from("reviews")
      .update({ rating, comment })
      .eq("id", reviewId)
      .select("id, user_id, rating, comment, created_at, users(name)")
      .single();

    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? updatedReview : r))
    );
  };

  if (loading) return <p>Loading book...</p>;
  if (!book) return <p>Book not found.</p>;
  if (!currentUser) return <p>Loading user...</p>;

  return (
    <section className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="mb-4 underline text-blue-600"
      >
        &larr; Back
      </button>

      <div className="flex flex-col sm:flex-row gap-6 mb-2">
        <img
          src={book.cover_image}
          alt={book.title}
          className="w-full sm:w-64 h-auto rounded"
        />
        <div>
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-gray-600 italic mb-2">by {book.author}</p>
          <p>{book.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <button onClick={handleFavorite} className="text-2xl">
              {isFavorite ? "❤️" : "🤍"}
            </button>
            <span>{isFavorite ? "Bookmarked" : "Add to Favorites"}</span>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-6 mb-3">Reviews</h2>

      {currentUser.role === "user" && (
        <ReviewForm onSubmit={handleAddReview} />
      )}

      <ReviewList
        reviews={reviews}
        currentUser={currentUser}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </section>
  );
}
