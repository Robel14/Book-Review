"use client";

import { useState } from "react";

type ReviewFormProps = {
  onSubmit: (rating: number, comment: string) => void;
};

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (comment.trim() === "") {
      alert("Please enter a comment");
      return;
    }

    onSubmit(rating, comment);

    // Reset form
    setComment("");
    setRating(5);
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-4 max-w-xl mx-auto">
      <label className="flex items-center gap-2">
        <span className="font-medium">Rating:</span>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border rounded p-1"
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="font-medium">Comment:</span>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border rounded p-2 w-full"
          rows={4}
          placeholder="Write your review here..."
          required
        />
      </label>

      <button
        type="submit"
        className="self-start bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Submit Review
      </button>
    </form>
  );
}
