"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Select from "@radix-ui/react-select";
import { ArrowRight, ArrowUpRight, Check, ChevronDown, Layers3, Sparkles } from "lucide-react";
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
  const serviceSelections = selections.filter((entry) => entry.service === serviceSlug).length;

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

  const heading = <div className="home-section-heading"><div><p className="eyebrow">{standalone ? "Flexible ways to work together" : "Ways to work together"}</p><Heading className="home-section-title" id={standalone ? "pricing-heading" : "packages-heading"}>Good work, built around your brief.</Heading></div>{!standalone && <Link className="text-link home-heading-link" href="/pricing">Explore packages <ArrowUpRight aria-hidden="true" /></Link>}</div>;

  return <section className={`home-packages section-wrap pricing-section${standalone ? " pricing-standalone" : ""}`} id={standalone ? undefined : "packages"} aria-labelledby={standalone ? "pricing-heading" : "packages-heading"}>
    {heading}
    <div className="package-cards">
      <article className="package-card package-card-featured">
        <div className="package-card-topline"><span className="package-index">01</span><span className="package-kicker">Flexible scope</span><span className="package-recommended"><Sparkles aria-hidden="true" /> Build a brief</span></div>
        <div className="package-card-intro"><h3>One For All</h3><p>Everything under one roof. Choose a service, then shape the brief around what you need.</p></div>

        <div className="package-builder" aria-label="Build your project brief">
          <div className="package-builder-heading"><span className="package-builder-icon"><Layers3 aria-hidden="true" /></span><div><span className="eyebrow">Your project brief</span><p>Start with a service and add the details.</p></div><span className="package-step-count">{String(chosen.length).padStart(2, "0")} <span>added</span></span></div>
          <div className="package-fields">
            <div className="package-field-group">
              <label className="field-label" htmlFor="package-service-trigger"><span className="package-field-step">01</span>Choose a service</label>
              <Select.Root value={serviceSlug} onValueChange={(value) => { setServiceSlug(value); setFilter(""); setSubOpen(false); }}>
                <Select.Trigger id="package-service-trigger" className="form-control package-select-trigger" aria-label="Choose a service">
                  <Select.Value placeholder="Select a service" />
                  <Select.Icon className="package-select-icon"><ChevronDown aria-hidden="true" /></Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="package-service-menu" position="popper" sideOffset={8} data-lenis-prevent>
                    <Select.Viewport>
                      {services.map((service, index) => <Select.Item className="package-service-option" key={service.slug} value={service.slug}>
                        <span className="package-service-option-index">0{index + 1}</span><Select.ItemText>{service.title}</Select.ItemText><Select.ItemIndicator className="package-service-option-check"><Check aria-hidden="true" /></Select.ItemIndicator>
                      </Select.Item>)}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div className="package-field-group">
              <span className="field-label" id="package-subservice-label"><span className="package-field-step">02</span>Choose what you need</span>
              {!activeService ? <button className="form-control package-sub-disabled" type="button" disabled aria-labelledby="package-subservice-label"><span>Choose a service to see options</span><ChevronDown aria-hidden="true" /></button> : <div className="package-sub-dropdown">
                <button className="form-control package-dropdown-trigger" type="button" aria-expanded={subOpen} aria-haspopup="dialog" aria-controls="package-sub-panel" aria-labelledby="package-subservice-label" onClick={() => setSubOpen((open) => !open)}>
                  <span>{serviceSelections ? `${serviceSelections} ${serviceSelections === 1 ? "item" : "items"} selected` : `Select ${activeService.title.toLowerCase()} options`}</span><ChevronDown className={subOpen ? "is-open" : ""} aria-hidden="true" />
                </button>
                {subOpen && <><button className="package-sheet-backdrop" type="button" aria-label="Close sub-service options" onClick={() => setSubOpen(false)} /><div className="package-sub-panel" id="package-sub-panel" role="dialog" aria-label={`${activeService.title} sub-services`} onKeyDown={(event) => { if (event.key === "Escape") setSubOpen(false); }} data-lenis-prevent>
                  <div className="package-sub-header"><div><span className="eyebrow">Choose from</span><strong>{activeService.title}</strong></div><button type="button" onClick={() => setSubOpen(false)} aria-label="Close options">Close</button></div>
                  <label className="package-search-label" htmlFor="package-sub-filter">Filter options</label><input id="package-sub-filter" className="form-control package-sub-search" type="search" placeholder={`Search ${activeService.title.toLowerCase()} options`} value={filter} onChange={(event) => setFilter(event.target.value)} />
                  <div className="package-sub-options" role="group" aria-label={`${activeService.title} sub-services`}>
                    {visibleSubs.map((sub, index) => { const id = `package-sub-${sub.id}`; return <label className="package-sub-option" key={sub.id} htmlFor={id}><span className="package-sub-option-number">{String(index + 1).padStart(2, "0")}</span><span className="package-sub-option-name">{sub.label}</span><Checkbox.Root id={id} className="package-checkbox" checked={selections.some((entry) => entry.service === serviceSlug && entry.sub === sub.id)} onCheckedChange={(checked) => toggleSub(sub.id, checked === true)}><Checkbox.Indicator className="package-checkbox-indicator" aria-hidden="true"><Check /></Checkbox.Indicator></Checkbox.Root></label>; })}
                    {visibleSubs.length === 0 && <p className="package-empty-filter">No matching options. Try another search.</p>}
                  </div>
                  <div className="package-sub-footer"><span>{serviceSelections} selected</span><button type="button" onClick={() => setSubOpen(false)}>Done <ArrowRight aria-hidden="true" /></button></div>
                </div></>}
              </div>}
            </div>
          </div>
        </div>

        <div className={`package-selection-area${chosen.length ? " has-selections" : ""}`}>
          {chosen.length ? <div className="selection-chips" role="status" aria-live="polite" aria-label="Selected services">{chosen.map((item) => <span className="selection-chip" key={`${item.service}:${item.sub}`}><span className="selection-chip-service">{item.serviceName}</span><span className="selection-chip-divider" aria-hidden="true">/</span><span>{item.subName}</span><button type="button" aria-label={`Remove ${item.serviceName}: ${item.subName}`} onClick={() => setSelections((current) => current.filter((entry) => !(entry.service === item.service && entry.sub === item.sub)))}>×</button></span>)}</div> : <p className="package-selection-empty">Your selected services will appear here.</p>}
        </div>

        <div className="package-card-bottom">
          <div className="package-price"><span className="package-price-label">Project pricing</span><strong>{priceLabel(pricing.oneForAll)}</strong></div>
          <div className="package-continue-wrap"><button className="button button-primary" type="button" onClick={continueBrief} disabled={!selections.length}><span>Continue with this brief</span><span className="button-icon" aria-hidden="true"><ArrowUpRight /></span></button>{!selections.length && <small>Add at least one item to continue.</small>}</div>
        </div>
      </article>

      <article className="package-card package-card-custom">
        <div className="package-card-topline"><span className="package-index">02</span><span className="package-kicker">Made for your needs</span><span className="package-custom-mark" aria-hidden="true"><Sparkles /></span></div>
        <div className="package-card-intro"><h3>Custom</h3><p>For bigger or more unusual projects, let’s talk through the possibilities and shape a plan together.</p></div>
        <div className="custom-package-visual" aria-label="A simple three-step custom project approach">
          <div className="custom-package-orbit" aria-hidden="true"><span /><span /><span /><i><Sparkles /></i></div>
          <div className="custom-package-steps"><div><span>01</span><p>Talk through the big picture</p><ArrowRight aria-hidden="true" /></div><div><span>02</span><p>Shape the right scope</p><ArrowRight aria-hidden="true" /></div><div><span>03</span><p>Get a tailored quote</p><Check aria-hidden="true" /></div></div>
        </div>
        <div className="package-custom-note"><span className="package-custom-note-icon"><Layers3 aria-hidden="true" /></span><span>A conversation first. A clear scope next.</span></div>
        <div className="package-card-bottom">
          <div className="package-price"><span className="package-price-label">Project pricing</span><strong>{priceLabel(pricing.custom)}</strong></div>
          <Link className="button button-secondary" href="/book-consultation" onClick={() => track("book_call_click")}><span>Book a discovery call</span><span className="package-secondary-arrow" aria-hidden="true"><ArrowUpRight /></span></Link>
        </div>
      </article>
    </div>
    <p className="package-note"><span className="package-note-dot" aria-hidden="true" />Every project is scoped to fit. Share your goals and we’ll recommend a direction.</p>
  </section>;
}
