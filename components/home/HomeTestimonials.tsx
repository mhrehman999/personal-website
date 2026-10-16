"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { testimonials } from "@/content/home";
import { MaskedHeadline } from "@/components/motion/Reveal";
import { useMotionPreferences } from "@/components/motion/MotionPreferences";

const headingLines = ["Good work. Kind words."];
const reviews = testimonials;

function ReviewRating({ rating }: { rating: number }) {
  return <span className="review-rating" role="img" aria-label={`${rating} out of 5 stars`}><span className="review-stars" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <svg key={index} viewBox="0 0 20 20" fill={index < rating ? "currentColor" : "none"}><path d="m10 1.5 2.6 5.3 5.9.9-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.9L10 1.5Z" stroke="currentColor" /></svg>)}</span><span aria-hidden="true">{rating}/5</span></span>;
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
    if (window.matchMedia("(max-width: 767px)").matches) return;
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
        <div className="review-controls" role="group" aria-label="Review navigation">
          <button type="button" aria-label="Previous review" aria-controls="review-rail" disabled={position.atStart} onClick={() => move(-1)}><Arrow previous /></button>
          <button type="button" aria-label="Next review" aria-controls="review-rail" disabled={position.atEnd} onClick={() => move(1)}><Arrow /></button>
        </div>
      </div>
    </div>
    <div className="reviews-frame">
      <div className="reviews-summary">
        <span className="reviews-summary-label">Client feedback</span>
        <span className="reviews-quote-mark" aria-hidden="true">“</span>
        <span className="reviews-count">{reviews.length} client {reviews.length === 1 ? "review" : "reviews"}</span>
        <p>Thoughtful work.<br />Shared success.</p>
      </div>
      <div className="review-rail" id="review-rail" ref={rail} role="region" aria-label="Client recommendations" tabIndex={0} data-lenis-prevent-horizontal
        onPointerDown={startDrag} onPointerMove={updateDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag} onDragStart={(event) => event.preventDefault()}>
        {reviews.map((review, index) => {
          return <figure className="review-card" key={review.id} aria-label={`Review ${index + 1} of ${reviews.length}`}>
            <div className="review-card-top"><span className="review-quote-symbol" aria-hidden="true">“</span><div className="review-source"><span>{review.sourceUrl ? "LinkedIn recommendation" : "Client review"}</span>{review.date && review.dateLabel && <time dateTime={review.date}>{review.dateLabel}</time>}{review.rating !== undefined && <ReviewRating rating={review.rating} />}</div></div>
            <blockquote cite={review.sourceUrl}>{review.quote.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</blockquote>
            <figcaption><div className="review-person"><span className="review-avatar" aria-hidden="true">{review.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span><div>{review.sourceUrl ? <a className="review-name" href={review.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`${review.name} on LinkedIn (opens in a new tab)`}>{review.name}</a> : <span className="review-name">{review.name}</span>}<span className="review-role">{review.role}</span></div></div><span className="review-relationship">{review.country || "Client recommendation"}{review.duration && <span className="review-duration">Project duration: {review.duration}</span>}</span></figcaption>
          </figure>;
        })}
      </div>
    </div>
    <div className="reviews-footer"><span>Drag or scroll for more perspectives</span><span className="visually-hidden" aria-live="polite" aria-atomic="true">Review {position.index + 1} of {reviews.length}</span></div>
  </section>;
}
