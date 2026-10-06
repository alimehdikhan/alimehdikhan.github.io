import { ChevronRight, Mail, MapPin, Phone } from 'lucide-react';
import { SectionHead } from './ui/SectionHead';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Reveal } from './fx/Reveal';
import { ContactForm } from './ContactForm';
import { VariableContact } from './fx/VariableContact';
import { ContactReveal } from './fx/ContactReveal';
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
  { href: RESUME.github, label: 'GitHub', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg', invDark: true },
  { href: RESUME.linkedin, label: 'LinkedIn', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg' },
];

export function Contact() {
  return (
    <section id="contact" className="section-y" aria-labelledby="contact-title">
      <ContactReveal />
      <div className="container-page">
        {/* the lime panel: its own token scope turns everything inside to ink
            on lime; GSAP expands it into view on wider screens */}
        <div className="contact-panel theme-lime rounded-[2.5rem] px-5 py-12 sm:px-10 md:px-14 md:py-16 lg:px-16">
          <div className="contact-inner">
            <SectionHead
              title={
                <>
                  Contact <em>Me</em>
                </>
              }
              index="07"
              label="Get In Touch"
              titleId="contact-title"
            />

            <Reveal stagger={0.08}>
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
                Available for Entry-Level Roles
              </span>

              <div className="mt-4">
                <VariableContact />
              </div>

              <p className="mt-6 max-w-[48ch] text-muted-foreground md:text-lg">
                Open to Software Engineering and AI/ML roles, internships, and interesting Python or ML collaborations. Email is the fastest way to reach me — I actually read it.
              </p>

              <EmailActions email={RESUME.email} />
            </Reveal>

            <div className="mt-12 grid gap-4 lg:grid-cols-[1.5fr_1fr] lg:gap-6">
              <Reveal>
                <Card className="h-full p-6 md:p-10">
                  <h3 className="text-xl font-semibold tracking-[-0.02em]">Send a message</h3>
                  <p className="mt-1 text-sm text-muted-foreground" id="form-note">
                    All fields are required.
                  </p>
                  <ContactForm />
                </Card>
              </Reveal>

              <Reveal>
                <Card className="flex h-full flex-col p-6 md:p-8">
                  <h3 className="text-xl font-semibold tracking-[-0.02em]">Details</h3>
                  <div className="mt-4 flex flex-col divide-y divide-border">
                    {contactDetails.map(({ title, value, href, external, Icon }) => (
                      <a
                        key={title}
                        href={href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        className="group -mx-2 flex items-center gap-4 rounded-2xl px-2 py-4 transition-colors duration-200 hover:bg-foreground/[0.03]"
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-secondary">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="text-[13px] text-muted-foreground">{title}</span>
                          <span className="truncate text-[15px] font-medium">{value}</span>
                        </span>
                        <ChevronRight
                          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 motion-safe:group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </a>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-2 lg:mt-auto lg:pt-8">
                    {socialLinks.map((social) => (
                      <Button key={social.label} asChild variant="secondary" size="icon">
                        <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                          <img
                            className={social.invDark ? 'inv-dark' : undefined}
                            src={social.img}
                            alt=""
                            width="16"
                            height="16"
                            loading="lazy"
                            aria-hidden="true"
                          />
                        </a>
                      </Button>
                    ))}
                  </div>
                </Card>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
