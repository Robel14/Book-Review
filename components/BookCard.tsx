"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

type BookCardProps = {
  id: number; 
  title: string;
  author: string;
  description?: string;
  cover_image?: string;
  onClick?: () => void;
};

export default function BookCard({
  id,
  title,
  author,
  cover_image,
  onClick,
}: BookCardProps) {
  const [user, setUser] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
      setLoadingUser(false);
    };

    fetchUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (!user) return;

    const checkFavorite = async () => {
      const { data } = await supabase
        .from("favorites")
        .select("*")
        .eq("book_id", id)
        .eq("user_id", user.id)
        .single();

      if (data) setIsFavorite(true);
    };

    checkFavorite();
  }, [id, user]);

  const handleFavorite = async () => {
    if (!user) {
      alert("You must be logged in to favorite books.");
      return;
    }

    if (isFavorite) {
      await supabase
        .from("favorites")
        .delete()
        .eq("book_id", id)
        .eq("user_id", user.id);
      setIsFavorite(false);
    } else {
      await supabase.from("favorites").insert({
        book_id: id,
        user_id: user.id,
      });
      setIsFavorite(true);
    }
  };

  if (loadingUser) {
    return (
      <div className="border rounded-lg p-4 shadow-sm bg-white">
        <p className="text-gray-500">Loading user...</p>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer border rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
    >
      {cover_image && (
        <img
          src={cover_image}
          alt={title}
          className="w-full h-48 object-cover mb-3 rounded-lg"
        />
      )}
      <h3 className="font-semibold text-lg text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-600">{author}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleFavorite();
        }}
        className="absolute top-2 right-2 text-2xl"
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </div>
  );
}
