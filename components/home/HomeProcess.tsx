import Link from "next/link";
import { processSteps } from "@/content/home";
import { MaskedHeadline } from "@/components/motion/Reveal";

const processHeadingLines = ["From first thought", "to final file."];

function ProcessSymbol({ step }: { step: string }) {
  return (
    <svg className="process-symbol" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {step === "01" && <><circle cx="17" cy="19" r="10" fill="currentColor" /><circle cx="31" cy="29" r="10" stroke="currentColor" strokeWidth="2" /></>}
      {step === "02" && <path d="M7 10h34v10H29l-5-5-5 5H7V10Zm0 18h12l5 5 5-5h12v10H7V28Z" fill="currentColor" />}
      {step === "03" && <><path d="m24 4 5.3 14.7L44 24l-14.7 5.3L24 44l-5.3-14.7L4 24l14.7-5.3L24 4Z" fill="currentColor" /><circle cx="39" cy="9" r="3" fill="currentColor" /></>}
      {step === "04" && <><path d="M8 9h5c8.3 0 15 6.7 15 15v15H8V9Z" fill="currentColor" /><path d="M34 9h6v30h-6c-8.3 0-15-6.7-15-15V9h15Z" stroke="currentColor" strokeWidth="2" /></>}
      {step === "05" && <><circle cx="15" cy="33" r="9" fill="currentColor" /><path d="M17 7h24v24L17 7Z" fill="currentColor" /></>}
    </svg>
  );
}

export function HomeProcess() {
  return (
    <section className="home-process section-wrap" id="process" aria-labelledby="process-heading">
      <div className="home-section-heading process-heading">
        <div>
          <p className="eyebrow">Our approach</p>
          <MaskedHeadline className="home-section-title" id="process-heading" lines={processHeadingLines} />
        </div>
        <p className="process-intro">Clear direction. Open conversations. A thoughtful process that brings your vision into focus.</p>
      </div>
      <ol className="process-grid" aria-label="Our design process">
        {processSteps.map((step, index) => {
          const isHandoff = index === processSteps.length - 1;
          return (
            <li className={`process-card${isHandoff ? " process-card-handoff" : ""}`} key={step.number}>
              <div className="process-card-top">
                <ProcessSymbol step={step.number} />
                <span className="process-card-number" aria-hidden="true">{step.number}</span>
              </div>
              <div className="process-card-copy">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
              {isHandoff && <>
                <Link className="button button-primary process-contact-link" href="/book-consultation">
                  <span>Let’s talk about your project</span><span className="button-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" /></svg></span>
                </Link>
                <div className="process-handoff-art" aria-hidden="true">
                  <svg viewBox="0 0 200 200" fill="none"><circle cx="100" cy="100" r="88" stroke="currentColor" /><circle cx="100" cy="100" r="63" stroke="currentColor" /><path d="M61 139 139 61M61 61h78v78" stroke="currentColor" strokeWidth="3" /></svg>
                </div>
              </>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
