import { ArrowUpRight, Check, GithubMark, LinkedinMark, Mail, MapPin, Phone, Send } from '@/components/ui/icons';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { IconTile } from './ui/icon-tile';
import { Reveal } from './fx/Reveal';
import { ContactForm } from './ContactForm';
import { ContactBackdrop } from './ContactBackdrop';
import { VariableContact } from './fx/VariableContact';
import { ContactReveal } from './fx/ContactReveal';
import { LocalClock } from './fx/LocalClock';
import { EmailActions } from './EmailActions';
import { RESUME } from '../data/resume';

const contactDetails = [
  { title: 'Email', value: RESUME.email, href: `mailto:${RESUME.email}`, Icon: Mail },
  { title: 'Phone', value: RESUME.phone, href: `tel:${RESUME.phone.replace(/[^+\d]/g, '')}`, Icon: Phone },
  {
    title: 'Location',
    value: RESUME.location,
    href: 'https://www.google.com/maps/search/?api=1&query=Lucknow,+Uttar+Pradesh,+India',
    external: true,
    Icon: MapPin,
  },
];

const socialLinks = [
  { href: RESUME.github, label: 'GitHub', Icon: GithubMark },
  { href: RESUME.linkedin, label: 'LinkedIn', Icon: LinkedinMark },
];

/* what happens after Send, in plain words */
const steps = [
  { title: 'You write', text: 'Tell me about the role, project or idea.', Icon: Send },
  { title: 'It reaches my inbox', text: 'Delivered straight to my email.', Icon: Mail },
  { title: 'I reply', text: 'I’ll get back to you soon.', Icon: Check },
];

export function Contact() {
  return (
    <section id="contact" className="section-y" aria-labelledby="contact-title">
      <ContactReveal />
      <div className="container-page">
        {/* the lime panel: its own token scope turns everything inside to ink
            on lime; GSAP expands it into view on wider screens */}
        <div className="contact-panel theme-lime relative isolate overflow-hidden rounded-[2.5rem] px-5 py-12 sm:px-10 md:px-14 md:py-16 lg:px-16">
          <ContactBackdrop />
          <div className="contact-inner">
            <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
              <Reveal stagger={0.08}>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
                  <span className="inline-flex items-center gap-2.5 font-semibold text-muted-foreground">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
                    Contact
                  </span>
                  <span className="inline-flex items-center gap-2.5 rounded-full bg-foreground/[0.08] py-1.5 pr-3.5 pl-3 text-[13px] font-medium">
                    <span className="relative flex size-2" aria-hidden="true">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-50 motion-reduce:animate-none" />
                      <span className="relative inline-flex size-2 rounded-full bg-primary" />
                    </span>
                    Available for entry-level roles
                  </span>
                </div>

                <div className="mt-7">
                  <VariableContact />
                </div>

                <p className="mt-6 max-w-[46ch] text-muted-foreground md:text-lg">
                  I&apos;m looking for entry-level Software Engineering and AI/ML roles, and I&apos;m happy to talk about internships or Python and ML projects. Email is the quickest way to reach me.
                </p>

                <EmailActions email={RESUME.email} />
              </Reveal>

              <Reveal>
                <Card className="flex flex-col p-5 md:p-7">
                  {/* the one thing a recruiter wonders: is it a sensible hour for them to call or write */}
                  <div className="flex items-end justify-between gap-4 rounded-2xl bg-foreground px-5 py-4 text-primary-foreground">
                    <div>
                      <p className="text-[13px] whitespace-nowrap opacity-70">Local time in Lucknow</p>
                      <p className="display mt-1 text-[clamp(2.25rem,4vw,3rem)] leading-none font-semibold tracking-[-0.04em] tabular-nums">
                        <LocalClock timeZone="Asia/Kolkata" />
                      </p>
                    </div>
                    <p className="hidden pb-1 text-right text-[13px] opacity-70 sm:block">
                      India Standard Time
                      <br />
                      UTC+5:30
                    </p>
                  </div>

                  <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em]">Details</h3>
                  <div className="mt-2 flex flex-col gap-1">
                    {contactDetails.map(({ title, value, href, external, Icon }) => (
                      <a
                        key={title}
                        href={href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        className="group -mx-2 flex items-center gap-4 rounded-2xl px-2 py-3 transition-colors duration-200 hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.04]"
                      >
                        <IconTile icon={Icon} size="md" />
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="text-[13px] text-muted-foreground">{title}</span>
                          <span className="truncate text-[15px] font-medium">{value}</span>
                        </span>
                        <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                      </a>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-border pt-5">
                    <span className="mr-auto text-sm text-muted-foreground">Elsewhere</span>
                    {socialLinks.map(({ href, label, Icon }) => (
                      <Button key={label} asChild variant="glass" size="icon">
                        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                          <Icon />
                        </a>
                      </Button>
                    ))}
                  </div>
                </Card>
              </Reveal>
            </div>

            <Reveal className="mt-6 lg:mt-8">
              <Card className="p-6 md:p-10">
                <div className="grid gap-8 lg:grid-cols-[0.62fr_1.38fr] lg:gap-14">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-[-0.025em]">Send a message</h3>
                    <p className="mt-2 text-muted-foreground" id="form-note">
                      All fields are required.
                    </p>
                    <ol className="mt-8 hidden lg:block">
                      {steps.map(({ title, text, Icon }, i) => (
                        <li key={title} className="relative pb-7 pl-11 last:pb-0">
                          {i < steps.length - 1 && <span aria-hidden="true" className="absolute top-8 bottom-1 left-[13px] w-px bg-foreground/20" />}
                          <span
                            aria-hidden="true"
                            className="absolute top-0 left-0 grid size-7 place-items-center rounded-full bg-foreground text-primary-foreground"
                          >
                            <Icon className="size-3.5" />
                          </span>
                          <p className="font-semibold">{title}</p>
                          <p className="mt-0.5 text-[15px] text-muted-foreground">{text}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <ContactForm />
                </div>
              </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
