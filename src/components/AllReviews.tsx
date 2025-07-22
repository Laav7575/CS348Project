"use client";
import { useState, useEffect } from "react";
import AddReview from "@/components/AddReview";

export default function AllReviews({ cid }: { cid: string }) {
    const [reviews, setReviews] = useState([]);
    const [showReviews, setShowReviews] = useState(false);

    const [uid, setUid] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editComment, setEditComment] = useState("");
    const [editStars, setEditStars] = useState(5);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        console.log("here");
        fetch("/api/users", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.id) setUid(data.id);
        });
    });

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

    function startEdit(review: any) {
        setEditingId(`${review.uid}-${review.cid}`);
        setEditComment(review.comment);
        setEditStars(review.stars);
    }

    async function submitEdit(review: any) {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                cID: review.cid,
                comment: editComment,
                stars: editStars,
            }),
        });
        if (res.ok) {
            setEditingId(null);
            fetchReviews();
        }
    }

    return (
        <div className="bg-white text-black">
            <h2 className="text-xl font-semibold mb-4">Reviews</h2>
            <button onClick={handleClick} className="underline italic text-gray-600 pb-4">
                {showReviews ? "Hide Reviews" : "Show Reviews" }
            </button>
            {showReviews && (reviews.length > 0 ? (
            <ul>
                {reviews.map((review: any) => {
                    const isCurrentUsers = review.uid === uid;
                    const isEditing = editingId === `${review.uid}-${review.cid}`;
                    return (
                    <li key={review.uid + "-" + review.cid} className="border-b py-2">
                        <span>
                            {review.email} -{" "}
                            {Array.from({ length: review.stars }, (_, i) => (
                                <span key={i} className="text-yellow-500">⭐</span>
                            ))}
                        </span>
                        <p className="text-sm text-gray-600">{new Date(review.createdDate).toLocaleDateString()}{review.updatedDate && (", Edited " + new Date(review.updatedDate).toLocaleDateString())}</p>
                        {isEditing ? (
                            <div className="flex flex-col gap-4 max-w-md">
                                {/* <AddReview cid={cid}/> */}
                                <textarea
                                    className="border p-2 text-sm"
                                    value={editComment}
                                    onChange={e => setEditComment(e.target.value)}
                                    placeholder="type your review here..."
                                    required
                                />
                                <label>
                                    Stars:
                                    <select
                                    className="ml-2 border p-1"
                                    value={editStars}
                                    onChange={e => setEditStars(Number(e.target.value))}
                                    >
                                    {[1,2,3,4,5].map(n => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                    </select>
                                </label>
                                <div className="flex flex-row gap-4">
                                    <button onClick={() => submitEdit(review)}
                                    className="flex-grow cursor-pointer bg-amber-400 text-white px-4 py-2 rounded hover:bg-amber-500">
                                        Save
                                    </button>
                                    <button onClick={() => setEditingId(null)} 
                                    className="flex-grow p-2 cursor-pointer border-2 border-solid border-amber-400 text-amber-500 hover:bg-amber-400 hover:text-white">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                            <p>{review.comment}</p>
                            {isCurrentUsers && (
                                <button className="cursor-pointer underline" onClick={() => startEdit(review)}>
                                    ✏️ Edit</button>
                            )}
                            </>
                        )}
                    </li>
                    )
                })}
            </ul>
            ) : (<div>No reviews yet.</div>))}
        </div>
    );
}