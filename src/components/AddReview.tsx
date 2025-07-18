"use client";
import { useState } from "react";

export default function AddReview({ cid }: { cid: string }) {
    const [showAddReview, setShowAddReview] = useState(false);
    const [comment, setComment] = useState("");
    const [stars, setStars] = useState(0);
    const [feedbackMsg, setFeedbackMsg] = useState("");

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedbackMsg("");
        const token = localStorage.getItem("token");
        if (!token) {
            setFeedbackMsg("You must be signed in to add a review.");
            return;
        }
        const res = await fetch("/api/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                cID: cid,
                comment,
                stars,
            }),
        });
        const data = await res.json();
        if (!res.ok) {
            setFeedbackMsg(data.error || "Failed to add review.");
        } else {
            setFeedbackMsg("Review added!");
            setComment("");
            setStars(0);
            setShowAddReview(false);
        }
    };

    function toggleShowReview() {
        setShowAddReview(!showAddReview);
    }

    return (
        <div className="bg-white text-black">
            {showAddReview ? (
            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4 max-w-md">
            <h2 className="text-xl font-semibold">Add Review</h2>
            <label>
                Stars:
                <select
                className="ml-2 border p-1"
                value={stars}
                onChange={e => setStars(Number(e.target.value))}
                >
                {[1,2,3,4,5].map(n => (
                    <option key={n} value={n}>{n}</option>
                ))}
                </select>
            </label>
            <textarea
                className="border p-2 text-sm"
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="type your review here..."
                required
            />
            <button type="submit"
                className="cursor-pointer bg-amber-400 text-white px-4 py-2 rounded hover:bg-amber-500" 
            >
                Submit Review
            </button>
            <button onClick={toggleShowReview} className="p-2 cursor-pointer border-2 border-solid border-amber-400 text-amber-500 hover:bg-amber-400 hover:text-white">
                Cancel
            </button>
            </form>
            ) :
            ( <button onClick={toggleShowReview} className="cursor-pointer bg-amber-400 text-white px-4 py-2 rounded hover:bg-amber-500">
                + Add Review</button> )
        }
        {feedbackMsg && <p className="text-blue-600">{feedbackMsg}</p>}
        </div>
    )
}
