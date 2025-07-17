"use client";
import { useState } from "react";

export default function AllReviews({ cid }: { cid: string }) {
    const [reviews, setReviews] = useState([]);
    const [showReviews, setShowReviews] = useState(false);

    const fetchReviews = async () => {
        const res = await fetch(`/api/reviews?cid=${cid}`);
        if (res.ok) {
            const data = await res.json();
            setReviews(data);
        } else {
            console.error("Failed to fetch reviews");
        }
    };

    function handleClick() {
        if (!showReviews) {
            fetchReviews();
        }
        setShowReviews(!showReviews);
    }

    return (
        <div className="bg-white text-black">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            <button onClick={handleClick} className="underline italic text-gray-600 pb-4">
                {showReviews ? "Hide Reviews" : "Show Reviews" }
            </button>
            {showReviews ? reviews.length > 0 ? (
            <ul>
                {reviews.map((review: any) => (
                    <li key={review.uid} className="border-b py-2">
                        <span>
                            {Array.from({ length: review.stars }, (_, i) => (
                                <span key={i} className="text-yellow-500">⭐</span>
                            ))}
                        </span>
                        <p>{review.comment}</p>
                        <p>{new Date(review.createdDate).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
            ) : (<div>No reviews yet.</div>) : (
                <div></div>
            )}
        </div>
    );
}