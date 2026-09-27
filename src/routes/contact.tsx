import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageTitle } from "@/components/site-shell";
import { site } from "@/data/site";

export const Route = createFileRoute("/contact")({ component: Contact });

function Contact() {
  return (
    <SiteShell>
      <PageTitle kicker="" title="CONTACT" />
      <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
        <figure className="frame-gold p-1.5">
          <img
            src={`${import.meta.env.BASE_URL}art/bio.png`}
            alt="Leather jacket, CRT glow"
            className="aspect-portrait w-full object-cover"
          />
        </figure>
        <div className="border border-gold bg-ink-soft p-5">
          <p className="text-sm leading-relaxed">
            Ready to connect talk about Security, Philosophy, AI.
            My social handles are below connect me for further talks!
          </p>
          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="font-display text-2xs tracking-[0.25em] text-gold">EMAIL</dt>
              <dd>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </dd>
            </div>
            <div>
              <dt className="font-display text-2xs tracking-[0.25em] text-gold">TELEPHONE</dt>
              <dd>
                <a href={`tel:${site.phone.replace(/\s+/g, "")}`}>{site.phone}</a>
              </dd>
            </div>
            <div>
              <dt className="font-display text-2xs tracking-[0.25em] text-gold">LINKEDIN</dt>
              <dd>
                <a href={site.linkedin} target="_blank" rel="noreferrer">
                  linkedin.com/in/muakheel
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-display text-2xs tracking-[0.25em] text-gold">GITHUB</dt>
              <dd>
                <a href={site.github} target="_blank" rel="noreferrer">
                  github.com/{site.githubHandle}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-display text-2xs tracking-[0.25em] text-gold">BASED IN</dt>
              <dd>{site.location}</dd>
            </div>
          </dl>
          <a
            href={`mailto:${site.email}?subject=Hello%20from%20the%20official%20site`}
            className="bevel mt-6 inline-flex min-h-11 items-center px-5 font-display text-xs tracking-[0.25em] no-underline"
          >
            WRITE A LETTER
          </a>
        </div>
      </div>
    </SiteShell>
  );
}
