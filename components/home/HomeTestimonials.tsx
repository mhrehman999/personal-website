"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { sampleTestimonials, testimonials } from "@/content/home";
import { MaskedHeadline } from "@/components/motion/Reveal";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

const headingLines = ["Good work. Kind words."];
const reviews = testimonials.length ? testimonials : sampleTestimonials;
const isSample = testimonials.length === 0;
const ratedReviews = reviews.filter((review) => review.rating !== undefined);
const averageRating = ratedReviews.length
  ? (ratedReviews.reduce((sum, review) => sum + review.rating!, 0) / ratedReviews.length).toFixed(1)
  : null;

function Stars({ rating }: { rating: number }) {
  return <span className="review-stars" role="img" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }, (_, index) => <svg key={index} viewBox="0 0 20 20" fill={index < Math.round(rating) ? "currentColor" : "none"} aria-hidden="true"><path d="m10 1.5 2.6 5.3 5.9.9-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.9L10 1.5Z" stroke="currentColor" strokeWidth="1" /></svg>)}
  </span>;
}

function Arrow({ previous = false }: { previous?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style={previous ? { transform: "rotate(180deg)" } : undefined}><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function HomeTestimonials() {
  const rail = useRef<HTMLDivElement>(null);
  const drag = useRef<{ pointerId: number; startX: number; scrollLeft: number } | null>(null);
  const [position, setPosition] = useState({ index: 0, atStart: true, atEnd: false });
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    function update() {
      if (!element) return;
      const cards = Array.from(element.querySelectorAll<HTMLElement>(".review-card"));
      const left = element.getBoundingClientRect().left;
      const distances = cards.map((card) => Math.abs(card.getBoundingClientRect().left - left));
      const atEnd = element.scrollLeft >= element.scrollWidth - element.clientWidth - 2;
      setPosition({
        index: atEnd ? cards.length - 1 : distances.indexOf(Math.min(...distances)),
        atStart: element.scrollLeft <= 2,
        atEnd,
      });
    }
    update();
    element.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => { element.removeEventListener("scroll", update); observer.disconnect(); };
  }, []);

  function move(direction: number) {
    const element = rail.current;
    if (!element) return;
    const cards = element.querySelectorAll<HTMLElement>(".review-card");
    const next = cards[Math.max(0, Math.min(cards.length - 1, position.index + direction))];
    if (next) element.scrollBy({ left: next.getBoundingClientRect().left - element.getBoundingClientRect().left, behavior: reducedMotion ? "instant" : "smooth" });
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    if ((event.target as Element).closest("a, button, input, textarea, select")) return;
    const element = event.currentTarget;
    drag.current = { pointerId: event.pointerId, startX: event.clientX, scrollLeft: element.scrollLeft };
    element.classList.add("is-dragging");
    element.setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  function updateDrag(event: PointerEvent<HTMLDivElement>) {
    const current = drag.current;
    if (!current || current.pointerId !== event.pointerId) return;
    event.currentTarget.scrollLeft = current.scrollLeft - (event.clientX - current.startX);
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    event.currentTarget.classList.remove("is-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return <section className="home-testimonials section-wrap" id="reviews" aria-labelledby="testimonials-title">
    <div className="home-section-heading">
      <div><p className="eyebrow">After the handoff</p><MaskedHeadline className="home-section-title" id="testimonials-title" lines={headingLines} /></div>
      <div className="reviews-heading-end">
        {isSample && <span className="social-proof-sample">Sample reviews &amp; rating</span>}
        <div className="review-controls" role="group" aria-label="Review navigation">
          <button type="button" aria-label="Previous review" aria-controls="review-rail" disabled={position.atStart} onClick={() => move(-1)}><Arrow previous /></button>
          <button type="button" aria-label="Next review" aria-controls="review-rail" disabled={position.atEnd} onClick={() => move(1)}><Arrow /></button>
        </div>
      </div>
    </div>
    <div className="reviews-frame">
      <div className="reviews-summary">
        <span className="reviews-summary-label">{isSample ? "Sample client feedback" : "Client feedback"}</span>
        {averageRating ? <><strong className="reviews-rating">{averageRating}<span>/ 5</span></strong><Stars rating={Number(averageRating)} /></> : <span className="reviews-quote-mark" aria-hidden="true">“</span>}
        <span className="reviews-count">{reviews.length} {isSample ? "example" : "client"} {reviews.length === 1 ? "review" : "reviews"}</span>
        <p>Thoughtful work.<br />Shared success.</p>
      </div>
      <div className="review-rail" id="review-rail" ref={rail} role="region" aria-label="Client reviews, drag or scroll horizontally" tabIndex={0} data-lenis-prevent-horizontal
        onPointerDown={startDrag} onPointerMove={updateDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag} onDragStart={(event) => event.preventDefault()}>
        {reviews.map((review, index) => {
          const highlightAt = review.highlight ? review.quote.indexOf(review.highlight) : -1;
          return <figure className="review-card" key={review.name + review.quote} aria-label={`Review ${index + 1} of ${reviews.length}`}>
            <div className="review-card-top"><span className="review-quote-symbol" aria-hidden="true">“</span>{review.rating !== undefined && <Stars rating={review.rating} />}</div>
            <blockquote>{highlightAt >= 0 && review.highlight ? <>{review.quote.slice(0, highlightAt)}<em>{review.highlight}</em>{review.quote.slice(highlightAt + review.highlight.length)}</> : review.quote}</blockquote>
            <figcaption><div className="review-person"><span className="review-avatar" aria-hidden="true">{isSample ? String(index + 1).padStart(2, "0") : review.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div><span className="review-name">{review.name}</span><span className="review-role">{review.role}</span></div></div><span className="review-company">{review.company}</span></figcaption>
          </figure>;
        })}
      </div>
    </div>
    <div className="reviews-footer"><span>Drag or scroll for more perspectives</span><span aria-live="polite" aria-atomic="true">{String(position.index + 1).padStart(2, "0")}<span className="review-total"> / {String(reviews.length).padStart(2, "0")}</span></span></div>
  </section>;
}
