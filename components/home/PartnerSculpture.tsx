import Image from "next/image";

export function PartnerSculpture() {
  return <div className="partner-sculpture" aria-hidden="true">
    <div className="partner-scene">
      <Image className="partner-scene-open" src="/artwork/partners-table-open.webp" alt="" width={1040} height={693} sizes="(max-width: 599px) 280px, (max-width: 1023px) 330px, 40vw" />
      <Image className="partner-scene-complete" src="/artwork/partners-table-complete.webp" alt="" width={1040} height={693} sizes="(max-width: 599px) 280px, (max-width: 1023px) 330px, 40vw" />
      <span className="partner-scene-marker">+</span>
      <p className="partner-sculpture-caption"><span />A place for you.</p>
    </div>
  </div>;
}
