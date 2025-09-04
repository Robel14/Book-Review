"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import ReviewList from "../../components/ReviewList";
import ProfileInfo from "../../components/ProfileInfo";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
};

type Review = {
  id: number;
  user_id: string;
  book_id: string;
  rating: number;
  comment: string;
  created_at: string;
  users: { name: string } | null;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserAndReviews() {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user;

      if (!currentUser) {
        router.push("/login");
        return;
      }
      const { data: userData, error: userError } = await supabase
        .from<User>("users")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (userError || !userData) {
        console.error("Error fetching user info:", userError);
        return;
      }

      setUser(userData);
      const { data: reviewsData, error: reviewsError } = await supabase
        .from<Review>("reviews")
        .select("id, user_id, book_id, rating, comment, created_at, users(name)")
        .order("created_at", { ascending: false });

      if (reviewsError) {
        console.error("Error fetching reviews:", reviewsError);
        return;
      }

      setReviews(reviewsData || []);
      setLoading(false);
    }

    fetchUserAndReviews();
  }, [router]);
  const deleteReview = async (reviewId: number) => {
    if (!user || user.role === "admin") {
      alert("Admins cannot delete reviews.");
      return;
    }

    const review = reviews.find((r) => r.id === reviewId);
    if (!review || review.user_id !== user.id) {
      alert("You can only delete your own review.");
      return;
    }

    const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
    if (error) {
      alert(error.message);
      return;
    }

    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };
  const editReview = async (reviewId: number, newRating: number, newComment: string) => {
    if (!user || user.role === "admin") {
      alert("Admins cannot edit reviews.");
      return;
    }

    const review = reviews.find((r) => r.id === reviewId);
    if (!review || review.user_id !== user.id) {
      alert("You can only edit your own review.");
      return;
    }

    const { error } = await supabase
      .from("reviews")
      .update({ rating: newRating, comment: newComment })
      .eq("id", reviewId);

    if (error) {
      alert(error.message);
      return;
    }

    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, rating: newRating, comment: newComment } : r
      )
    );
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to see your profile.</p>;

  return (
    <section className="max-w-3xl mx-auto p-4">
      <ProfileInfo user={user} />
      <h2 className="text-2xl font-semibold mt-6 mb-3">
        {user.role === "admin" ? "All Users' Reviews" : "Your Reviews"}
      </h2>

      <ReviewList
        reviews={reviews}
        currentUser={user} y
        onDelete={deleteReview}
        onEdit={editReview}
      />
    </section>
  );
}
