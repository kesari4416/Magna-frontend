import { useEffect, useState } from "react";
import { Star, Play, Quote } from "lucide-react";
import { api, mediaUrl } from "@/lib/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => { api.get("/reviews").then((r) => setReviews(r.data || [])); }, []);

  return (
    <div data-testid="reviews-page">
      <section className="bg-[#A0146A] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <div className="text-sm uppercase tracking-[0.2em] text-[#F472B6] mb-3">— Patient Stories</div>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight max-w-3xl">
            Healing journeys, in our patients&apos; own words.
          </h1>
          <p className="mt-6 max-w-2xl text-white/80 text-lg leading-relaxed">
            Honest reviews from the people we&apos;ve had the privilege to care for — through video, photo and written testimonials.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        {reviews.length === 0 ? (
          <div className="text-center text-[#6B7280] py-20">No reviews yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((r) => (
              <div key={r.id} data-testid={`review-page-card-${r.patient_name}`} className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover-lift">
                {r.video_url ? (
                  <div className="relative bg-black aspect-video">
                    <video
                      src={mediaUrl(r.video_url)}
                      controls
                      className="w-full h-full object-cover"
                      data-testid="video-review-player"
                      poster={r.photo_url ? mediaUrl(r.photo_url) : undefined}
                    />
                  </div>
                ) : r.photo_url ? (
                  <div className="zoom-img h-72">
                    <img src={mediaUrl(r.photo_url)} alt={r.patient_name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-[#A0146A] to-[#8B1158] grid place-items-center">
                    <Quote className="w-12 h-12 text-white/30" />
                  </div>
                )}
                <div className="p-7">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-[#F472B6] text-[#F472B6]" />)}
                  </div>
                  <p className="text-base text-[#1E1E1E] leading-relaxed mb-5">&ldquo;{r.review_text}&rdquo;</p>
                  <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
                    <div>
                      <div className="font-heading text-base text-[#A0146A] font-medium">{r.patient_name}</div>
                      {r.treatment && <div className="text-xs text-[#6B7280]">{r.treatment}</div>}
                    </div>
                    {r.video_url && (
                      <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#F472B6]">
                        <Play className="w-3 h-3" /> Video Story
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
