"use client";

import { useEffect, useState } from "react";
import Cal from "@calcom/embed-react";
import { calLink } from "@/content/site";

export function CalBookingEmbed() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);
  if (!calLink) return <div className="booking-placeholder"><p className="eyebrow">Booking link needed</p><p>TODO: Add the Cal.com booking link in the environment settings.</p><a className="button button-secondary" href="mailto:contact@mhrehman.com">Email to arrange a call <span aria-hidden="true">↗</span></a></div>;
  return <div className="booking-embed-shell" data-lenis-prevent>
    {!loaded && <div className="booking-skeleton" role="status" aria-label="Loading booking calendar"><span /><span /><span /><span /></div>}
    <Cal calLink={calLink} namespace="studio-discovery" style={{ width: "100%", height: "720px", overflow: "scroll" }} config={{ layout: "month_view", theme: "dark", brandColor: "#82DB1A" }} />
  </div>;
}
