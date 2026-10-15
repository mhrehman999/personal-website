"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { services } from "@/content/services";
import { pricing, priceLabel } from "@/content/pricing";
import { track } from "@/lib/analytics";

type Selection = { service: string; sub: string };

export function Pricing({ standalone = false }: { standalone?: boolean }) {
  const [serviceSlug, setServiceSlug] = useState("");
  const [filter, setFilter] = useState("");
  const [subOpen, setSubOpen] = useState(false);
  const [selections, setSelections] = useState<Selection[]>([]);
  const activeService = services.find((service) => service.slug === serviceSlug);
  const Heading = standalone ? "h1" : "h2";
  const chosen = useMemo(() => selections.map((selection) => {
    const service = services.find((entry) => entry.slug === selection.service);
    const sub = service?.subServices.find((entry) => entry.id === selection.sub);
    return { ...selection, serviceName: service?.title ?? selection.service, subName: sub?.label ?? selection.sub };
  }), [selections]);
  const visibleSubs = activeService?.subServices.filter((sub) => sub.label.toLowerCase().includes(filter.toLowerCase())) ?? [];

  function toggleSub(sub: string, checked: boolean) {
    if (!serviceSlug) return;
    setSelections((current) => checked
      ? current.some((entry) => entry.service === serviceSlug && entry.sub === sub) ? current : [...current, { service: serviceSlug, sub }]
      : current.filter((entry) => !(entry.service === serviceSlug && entry.sub === sub)));
  }

  function continueBrief() {
    const items = selections.map(({ service, sub }) => `${service}:${sub}`).join(",");
    track("package_continue");
    window.location.assign(`/contact?package=one-for-all&items=${encodeURIComponent(items)}`);
  }

  const heading = <div className="home-section-heading"><div><p className="eyebrow">{standalone ? "Flexible ways to work together" : "Ways to work together"}</p><Heading className="home-section-title" id={standalone ? "pricing-heading" : "packages-heading"}>Good work, built around your brief.</Heading></div>{!standalone && <Link className="text-link home-heading-link" href="/pricing">Explore packages <span aria-hidden="true">↗</span></Link>}</div>;

  return <section className={`home-packages section-wrap pricing-section${standalone ? " pricing-standalone" : ""}`} id={standalone ? undefined : "packages"} aria-labelledby={standalone ? "pricing-heading" : "packages-heading"}>
    {heading}
    <div className="package-cards">
      <article className="package-card package-card-featured">
        <span className="eyebrow">01 / Flexible scope</span><h3>One For All</h3><p>Everything under one roof. Pick a service, then choose what you need within it.</p>
        <div className="package-fields">
          <label className="field-label" htmlFor="package-service">Service</label>
          <select id="package-service" className="form-control" value={serviceSlug} onChange={(event) => { setServiceSlug(event.target.value); setFilter(""); setSubOpen(false); }}>
            <option value="">Choose a service</option>{services.map((service) => <option key={service.slug} value={service.slug}>{service.title}</option>)}
          </select>
          <label className="field-label" htmlFor="package-sub-filter">Sub-service</label>
          {!activeService ? <button className="form-control package-sub-disabled" type="button" disabled>Choose a service first</button> : <div className="package-sub-dropdown">
            <button className="form-control package-dropdown-trigger" type="button" aria-expanded={subOpen} aria-haspopup="dialog" aria-controls="package-sub-panel" onClick={() => setSubOpen((open) => !open)}>{selections.filter((entry) => entry.service === serviceSlug).length ? `Choose sub-services (${selections.filter((entry) => entry.service === serviceSlug).length} selected)` : `Choose ${activeService.title.toLowerCase()} sub-services`}</button>
            {subOpen && <><button className="package-sheet-backdrop" type="button" aria-label="Close sub-service options" onClick={() => setSubOpen(false)} /><div className="package-sub-panel" id="package-sub-panel" role="dialog" aria-label={`${activeService.title} sub-services`} onKeyDown={(event) => { if (event.key === "Escape") setSubOpen(false); }} data-lenis-prevent>
              <div className="package-sub-header"><span>{activeService.title} sub-services</span><button type="button" onClick={() => setSubOpen(false)}>Close</button></div>
              <input id="package-sub-filter" className="form-control" type="search" placeholder={`Filter ${activeService.title.toLowerCase()} options`} value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter sub-services" />
              <div className="package-sub-options" role="group" aria-label={`${activeService.title} sub-services`}>
                {visibleSubs.map((sub) => { const id = `package-sub-${sub.id}`; return <label className="package-sub-option" key={sub.id} htmlFor={id}><Checkbox.Root id={id} className="package-checkbox" checked={selections.some((entry) => entry.service === serviceSlug && entry.sub === sub.id)} onCheckedChange={(checked) => toggleSub(sub.id, checked === true)}><Checkbox.Indicator className="package-checkbox-indicator" aria-hidden="true">✓</Checkbox.Indicator></Checkbox.Root><span>{sub.label}</span></label>; })}
                {visibleSubs.length === 0 && <p className="package-empty-filter">No matching sub-services.</p>}
              </div>
            </div></>}
          </div>}
        </div>
        <div className="selection-chips" role="status" aria-live="polite" aria-label="Selected services">{chosen.map((item) => <span className="selection-chip" key={`${item.service}:${item.sub}`}>{item.serviceName} <span aria-hidden="true">›</span> {item.subName}<button type="button" aria-label={`Remove ${item.serviceName}: ${item.subName}`} onClick={() => setSelections((current) => current.filter((entry) => !(entry.service === item.service && entry.sub === item.sub)))}>×</button></span>)}</div>
        <div className="package-card-bottom"><span>{priceLabel(pricing.oneForAll)}</span><div className="package-continue-wrap"><button className="button button-primary" type="button" onClick={continueBrief} disabled={!selections.length}><span>Continue with this brief</span><span className="button-icon" aria-hidden="true">↗</span></button>{!selections.length && <small>Choose at least one sub-service to continue.</small>}</div></div>
      </article>
      <article className="package-card"><span className="eyebrow">02 / Made for your needs</span><h3>Custom</h3><p>For bigger or unusual needs, talk it through and shape a plan together.</p><div className="package-custom-note"><span aria-hidden="true">✳</span><span>A conversation first. A clear scope next.</span></div><div className="package-card-bottom"><span>{priceLabel(pricing.custom)}</span><Link className="button button-secondary" href="/book-consultation" onClick={() => track("book_call_click")}>Book a discovery call <span aria-hidden="true">↗</span></Link></div></article>
    </div><p className="package-note">Every project is scoped to fit. Share your goals and we’ll recommend a direction.</p>
  </section>;
}
