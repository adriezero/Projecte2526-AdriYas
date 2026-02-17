"use client";

import { useEffect, useState } from "react";
import ReviewCard from "./reviewCard";
import RatingsSummary from "./ratingsummary";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then(res => res.json())
      .then(data => setReviews(data));
  }, []);

  return (
    <section className="bg-gray-100 py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <RatingsSummary average={4.7} />

        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((r: (any)) => (
            <ReviewCard
              key={r.id}
              name={r.name}
              comment={r.comment}
            />
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-6">
          <button className="px-3 py-1 border rounded">Anterior</button>
          <button className="px-3 py-1 bg-blue-500 text-white rounded">1</button>
          <button className="px-3 py-1 border rounded">2</button>
          <button className="px-3 py-1 border rounded">Siguiente</button>
        </div>
      </div>
    </section>
  );
}