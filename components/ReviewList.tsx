import ReviewItem from "./ReviewItem";

type Review = {
  id: string; 
  rating: number;
  comment: string;
  created_at: string;
  user_id: string;
  users: { name: string } | null;
};

type ReviewListProps = {
  reviews: Review[];
  currentUser: { id: string; role: "user" | "admin" };
  onDelete?: (reviewId: string) => void;
  onEdit?: (reviewId: string, rating: number, comment: string) => void;
};

export default function ReviewList({
  reviews,
  currentUser,
  onDelete,
  onEdit,
}: ReviewListProps) {
  if (reviews.length === 0)
    return <p className="text-gray-500 mt-2">No reviews yet.</p>;

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          id={review.id} 
          rating={review.rating}
          comment={review.comment}
          created_at={review.created_at}
          userName={review.users?.name || "Anonymous"}
          canEdit={currentUser.id === review.user_id}
          canDelete={currentUser.id === review.user_id}
          onDelete={() => onDelete?.(review.id)}
          onEdit={(rating, comment) =>
            onEdit?.(review.id, rating, comment)
          }
        />
      ))}
    </div>
  );
}
