import { useState } from "react";
import { Rating } from "react-simple-star-rating";
import { IoMdClose } from "react-icons/io";

const ReviewModal = ({ isOpen, onClose, onSubmit }) => {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!stars || !comment.trim()) return;
    onSubmit({ stars, comment });
    setStars(0);
    setComment("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500"
          onClick={onClose}
        >
          <IoMdClose size={22} />
        </button>

        <h3 className="text-xl font-semibold mb-4">Write a Review</h3>

        <Rating
          onClick={(rate) => setStars(rate)}
          allowFraction
          initialValue={stars}
          size={24}
        />

        <textarea
          className="w-full mt-4 border border-gray-300 rounded p-2"
          rows={4}
          placeholder="Write your feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full font-semibold"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
