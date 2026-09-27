import { createFileRoute } from "@tanstack/react-router";
import { SiteShell, PageTitle } from "@/components/site-shell";
import { education, site } from "@/data/site";

export const Route = createFileRoute("/bio")({ component: Bio });

function Bio() {
  return (
    <SiteShell>
      <PageTitle kicker="THE MAN" title="BIOGRAPHY" />
      <div className="grid gap-8 md:grid-cols-[280px_1fr] items-start">
        <figure className="frame-gold mx-auto h-fit p-1.5">
          <img
            src={`${import.meta.env.BASE_URL}art/bio.png`}
            alt="Studio portrait of Muhammed Akheel"
            className="block w-full h-auto object-cover"
          />
        </figure>
        <article className="space-y-4 text-sm leading-relaxed">
          <p>
            {site.name} grew up on the Malabar's now works as a cybersecurity researcher - penetration
            testing, vulnerability research, bug bounty hunting, and SOC operations - with a side
            habit of doing so random things!. After all a self certified Philosopher.
          </p>
          <p>
            The through-line is the same whether the room is a classroom or a bug bounty program:
            map the surface, respect the scope, keep a human in the loop, and file evidence that
            a tired triager can actually use. He builds the tools he wished he had at 2 a.m.
            DEMOGORGON is that.
          </p>
          <p>
            In 2024 the quiet work got loud. EC-Council put him in the Hall of Fame. NASA, via
            Bugcrowd, took high-impact web findings. LG(Life's Good 😉) Electronics sent thanks for a critical
            application bug. Yahoo and DeHaat were in the same season of responsible disclosure.
          </p>
          <p>
            By day (and some nights): DO Hacking, fall in to some rabbit holes and the new awkward dance of
            AI-assisted security. Offenso Hackers Academy and Red Team Hacker Academy have both
            had me on the bill.
          </p>
          <p className="text-gold">{site.tagline} Self licensed.</p>

          <dl className="mt-6 grid gap-3 border-t border-gold/30 pt-5 sm:grid-cols-2">
            <div>
              <dt className="font-display text-2xs tracking-[0.25em] text-gold">EDUCATION</dt>
              <dd>
                {education.degree}
                <br />
                {education.school}
                <br />
                {education.years}
              </dd>
            </div>
            <div>
              <dt className="font-display text-2xs tracking-[0.25em] text-gold">CERTIFICATION</dt>
              <dd>{education.cert}</dd>
            </div>
            <div>
              <dt className="font-display text-2xs tracking-[0.25em] text-gold">GITHUB</dt>
              <dd>
                <a href={site.github} target="_blank" rel="noreferrer">
                  {site.githubHandle}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-display text-2xs tracking-[0.25em] text-gold">GROUND NAME</dt>
              <dd>Overman.</dd>
            </div>
          </dl>
        </article>
      </div>
    </SiteShell>
  );
}
