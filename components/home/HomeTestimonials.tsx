import { testimonials } from "@/content/home";

export function HomeTestimonials() {
  if (testimonials.length === 0) return null;
  return <section className="home-testimonials section-wrap" aria-labelledby="testimonials-title"><p className="eyebrow">Kind words</p><h2 id="testimonials-title" className="home-section-title">What clients say.</h2><div className="testimonial-list">{testimonials.map((item) => <figure key={`${item.name}-${item.quote}`}><blockquote>{item.quote}</blockquote><figcaption>{item.name}<span>{item.role}</span></figcaption></figure>)}</div></section>;
}
