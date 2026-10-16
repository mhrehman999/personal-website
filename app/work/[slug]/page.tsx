import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/content/services";
import { workProjects } from "@/content/work";
import { absoluteUrl } from "@/lib/site-url";
import { ProjectMedia } from "@/components/work/ProjectMedia";

export function generateStaticParams() { return workProjects.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = workProjects.find((entry) => entry.slug === slug);
  if (!project) return {};
  const title = project.title.replace(/^TODO:\s*/, "Project");
  const description = project.summary.replace(/^TODO:\s*/, "Selected studio work in progress.");
  return { title, description, alternates: { canonical: `/work/${slug}` } };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = workProjects.findIndex((entry) => entry.slug === slug);
  if (index < 0) notFound();
  const project = workProjects[index];
  const next = workProjects[(index + 1) % workProjects.length];
  const category = services.find((service) => service.slug === project.category);
  const title = project.title.replace(/^TODO:\s*/, "Project title coming soon");
  const projectStructuredData = { "@context": "https://schema.org", "@type": "CreativeWork", name: title, creator: { "@type": "Organization", name: "MH Rehman" }, description: project.summary, url: absoluteUrl(`/work/${project.slug}`), ...(project.hasCoverImage ? { image: absoluteUrl(project.coverImage) } : {}) };
  return <main className="phase-page studio-page project-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectStructuredData).replace(/</g, "\\u003c") }} />
    <Link className="project-back-link" href="/work"><span aria-hidden="true">←</span> All work</Link>
    <p className="eyebrow">{category?.title ?? project.category}</p>
    <h1 className="phase-title">{title}</h1>
    {project.summary && <p className="phase-lede">{project.summary}</p>}
    <div className="project-meta-grid" role="group" aria-label="Project details"><div><span className="eyebrow">Client</span><p>{project.client}</p></div>{project.year && <div><span className="eyebrow">Year</span><p>{project.year}</p></div>}{project.role && <div><span className="eyebrow">Role</span><p>{project.role}</p></div>}<div><span className="eyebrow">Service</span><p>{category?.title ?? project.category}</p></div></div>
    <figure className="project-detail-cover">{project.hasCoverImage ? <ProjectMedia image={project.coverImage} video={project.coverVideo} alt={project.coverAlt} priority sizes="(max-width: 767px) 100vw, 90vw" controls /> : <div className="project-detail-placeholder" aria-hidden="true"><span>{title.charAt(0)}</span></div>}</figure>
    {project.summary && <section className="project-story" aria-labelledby="project-story-heading"><p className="eyebrow">The project</p><h2 className="phase-subtitle" id="project-story-heading">Project overview</h2><p>{project.summary}</p>{project.role && <div className="project-deliverables"><h3>Studio role</h3><p>{project.role}</p></div>}</section>}
    {project.galleryImages.length > 0 && <section className="project-gallery" aria-labelledby="project-gallery-heading"><p className="eyebrow">Selected details</p><h2 className="phase-subtitle" id="project-gallery-heading">Project gallery</h2><div className="project-gallery-grid">{project.galleryImages.map((image, imageIndex) => <figure className="project-gallery-image" key={image}><Image src={image} alt={`${title} project detail ${imageIndex + 1}`} fill sizes="(max-width: 767px) 100vw, 50vw" /></figure>)}</div></section>}
    <nav className="project-next" aria-label="Project navigation"><div><p className="eyebrow">Next project</p><Link href={`/work/${next.slug}`}>{next.title.replace(/^TODO:\s*/, "Project coming soon")} <span aria-hidden="true">↗</span></Link></div><Link className="button button-secondary" href="/work">Explore all work <span aria-hidden="true">↗</span></Link></nav>
    <div className="phase-cta-row"><Link className="button button-primary" href={`/contact?service=${project.category}`}>Start a similar project <span className="button-icon" aria-hidden="true">↗</span></Link><Link className="button button-secondary" href="/services">Explore services <span aria-hidden="true">↗</span></Link></div>
  </main>;
}
