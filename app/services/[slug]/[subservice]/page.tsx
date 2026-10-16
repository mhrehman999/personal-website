import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services } from "@/content/services";
import { ServiceContent } from "@/components/services/ServiceContent";

export function generateStaticParams() { return services.flatMap((service) => service.subServices.map((sub) => ({ slug: service.slug, subservice: sub.id }))); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string; subservice: string }> }): Promise<Metadata> {
  const { slug, subservice } = await params;
  const service = services.find((item) => item.slug === slug);
  const sub = service?.subServices.find((item) => item.id === subservice);
  return sub ? { title: `${sub.label} | ${service!.title}`, description: sub.description, alternates: { canonical: `/services/${slug}/${subservice}` } } : {};
}

export default async function SubservicePage({ params }: { params: Promise<{ slug: string; subservice: string }> }) {
  const { slug, subservice } = await params;
  const service = services.find((item) => item.slug === slug);
  const sub = service?.subServices.find((item) => item.id === subservice);
  if (!service || !sub) notFound();
  return <ServiceContent service={service} sub={sub} />;
}
