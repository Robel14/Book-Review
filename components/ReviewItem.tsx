"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

type ReviewItemProps = {
  id: string; 
  rating: number;
  comment: string;
  userName: string;
  created_at: string;
  canEdit: boolean;
  canDelete: boolean;
  onEdit?: (newRating: number, newComment: string) => void;
  onDelete?: () => void;
};

export default function ReviewItem({
  id,
  rating,
  comment,
  userName,
  created_at,
  canEdit,
  canDelete,
  onEdit,
  onDelete,
}: ReviewItemProps) {
  const [user, setUser] = useState<any>(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [newRating, setNewRating] = useState(rating);
  const [newComment, setNewComment] = useState(comment);

  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState<"like" | "dislike" | null>(null);
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
    const fetchReactions = async () => {
      const { data, error } = await supabase
        .from("review_reactions")
        .select("*")
        .eq("review_id", id);

      if (!error && data) {
        setLikes(data.filter(r => r.reaction === "like").length);
        setDislikes(data.filter(r => r.reaction === "dislike").length);

        if (user) {
          const userR = data.find(r => r.user_id === user.id);
          if (userR) setUserReaction(userR.reaction as "like" | "dislike");
        }
      }
    };

    fetchReactions();
  }, [id, user]);
  const handleReaction = async (reaction: "like" | "dislike") => {
    if (!user) {
      alert("You must be logged in to react.");
      return;
    }

    if (userReaction === reaction) {
      await supabase
        .from("review_reactions")
        .delete()
        .eq("review_id", id)
        .eq("user_id", user.id);

      setUserReaction(null);
      reaction === "like" ? setLikes(likes - 1) : setDislikes(dislikes - 1);
    } else if (userReaction && userReaction !== reaction) {
      await supabase
        .from("review_reactions")
        .update({ reaction })
        .eq("review_id", id)
        .eq("user_id", user.id);

      setUserReaction(reaction);
      reaction === "like" ? (setLikes(likes + 1), setDislikes(dislikes - 1)) : (setDislikes(dislikes + 1), setLikes(likes - 1));
    } else {
      await supabase.from("review_reactions").insert({
        review_id: id,
        user_id: user.id,
        reaction,
      });

      setUserReaction(reaction);
      reaction === "like" ? setLikes(likes + 1) : setDislikes(dislikes + 1);
    }
  };

  if (loadingUser) {
    return (
      <div className="border rounded p-4 shadow-sm bg-white">
        <p className="text-gray-500">Loading user...</p>
      </div>
    );
  }

  return (
    <div className="border rounded p-4 shadow-sm bg-white">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-gray-800">{userName}</span>
        <span className="text-xs text-gray-500">
          {new Date(created_at).toLocaleDateString()}
        </span>
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-2">
          <input
            type="number"
            min={1}
            max={5}
            value={newRating}
            onChange={(e) => setNewRating(Number(e.target.value))}
            className="border rounded p-1 w-20"
          />
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="border rounded p-1"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                onEdit?.(newRating, newComment);
                setIsEditing(false);
              }}
              className="bg-blue-600 text-white px-2 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-2 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-1">⭐ {rating} / 5</p>
          <p className="text-gray-700 mb-2">{comment}</p>
          <div className="flex gap-4 items-center mb-2">
            <button
              className={`px-2 py-1 rounded ${userReaction === "like" ? "bg-green-500 text-white" : "bg-gray-200"}`}
              onClick={() => handleReaction("like")}
            >
              👍 {likes}
            </button>
            <button
              className={`px-2 py-1 rounded ${userReaction === "dislike" ? "bg-red-500 text-white" : "bg-gray-200"}`}
              onClick={() => handleReaction("dislike")}
            >
              👎 {dislikes}
            </button>
          </div>

          {(canEdit || canDelete) && (
            <div className="flex gap-2 mt-2">
              {canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={onDelete}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
