'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SITE } from '@/constants/site';
import { useSound } from '@/hooks/useSound';
import { asset, cn } from '@/lib/utils';

type FormState = { name: string; email: string; subject: string; message: string };
type FormErrors = Partial<Record<keyof FormState, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (values.name.trim().length < 2) errors.name = 'Please enter your name.';
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (values.message.trim().length < 12)
    errors.message = 'A little more detail, please (12+ characters).';
  return errors;
}

/** Labelled field with an animated focus underline and inline error. */
function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40"
      >
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error ? (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            id={`${id}-error`}
            role="alert"
            className="text-[11.5px] text-destructive"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function CopyRow({
  icon: Icon,
  label,
  value,
  href,
  copyValue,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
  copyValue?: string;
}) {
  const [copied, setCopied] = useState(false);
  const { play } = useSound();

  const copy = async () => {
    if (!copyValue) return;
    try {
      await navigator.clipboard.writeText(copyValue);
      play('click');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked by permissions — the value stays selectable.
    }
  };

  const content = (
    <>
      <span className="flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <span className="flex items-center gap-2 text-[14px] text-white/85 transition-colors group-hover:text-white">
        {value}
        {href ? <ArrowUpRight className="h-3.5 w-3.5 text-white/30" /> : null}
      </span>
    </>
  );

  return (
    <div className="group relative flex items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-4 transition-colors hover:bg-white/[0.03]">
      {href ? (
        <a
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel="noreferrer"
          className="flex flex-1 items-center justify-between gap-4"
        >
          {content}
        </a>
      ) : (
        <div className="flex flex-1 items-center justify-between gap-4">{content}</div>
      )}
      {copyValue ? (
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy ${label.toLowerCase()}`}
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors',
            copied
              ? 'border-accent-cyan/50 text-accent-cyan'
              : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white',
          )}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      ) : null}
    </div>
  );
}

export function Contact() {
  const [values, setValues] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);
  const { play } = useSound();

  const update =
    (key: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [key]: event.target.value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    // The site is fully static, so the form hands off to the user's mail
    // client with everything pre-filled rather than posting to a server.
    const subject = encodeURIComponent(
      values.subject.trim() || `Portfolio enquiry — ${values.name}`,
    );
    const body = encodeURIComponent(`${values.message}\n\n— ${values.name}\n${values.email}`);
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;

    play('reveal');
    setSent(true);
    window.setTimeout(() => setSent(false), 6000);
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-accent/[0.12] blur-[140px]"
      />

      <div className="relative mx-auto max-w-[1440px]">
        <SectionHeading
          eyebrow="07 — Contact"
          title={<>Open to internships in design &amp; mechatronics.</>}
          description="Have a project, a role or a question? Email is the fastest route — the form below will open your mail client with everything filled in."
        />

        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="relative flex flex-col gap-5 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-xl sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label="Your name" error={errors.name}>
                  <Input
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={update('name')}
                    placeholder="Jane Doe"
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                </Field>
                <Field id="email" label="Email" error={errors.email}>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={update('email')}
                    placeholder="jane@company.com"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                </Field>
              </div>

              <Field id="subject" label="Subject (optional)">
                <Input
                  id="subject"
                  name="subject"
                  value={values.subject}
                  onChange={update('subject')}
                  placeholder="Internship — mechanical design"
                />
              </Field>

              <Field id="message" label="Message" error={errors.message}>
                <Textarea
                  id="message"
                  name="message"
                  value={values.message}
                  onChange={update('message')}
                  placeholder="Tell me about the role or the project…"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
              </Field>

              <div className="flex flex-wrap items-center gap-4">
                <MagneticButton>
                  <Button type="submit" variant="accent" size="lg">
                    Send message
                    <Send className="h-4 w-4" />
                  </Button>
                </MagneticButton>

                <AnimatePresence>
                  {sent ? (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9, x: -8 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 text-[13px] text-accent-cyan"
                      role="status"
                    >
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-accent-cyan/50 bg-accent-cyan/10"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </motion.span>
                      Your mail client should be open — thanks for reaching out.
                    </motion.span>
                  ) : null}
                </AnimatePresence>
              </div>
            </form>
          </div>

          {/* Direct details */}
          <div className="flex flex-col gap-5 lg:col-span-5">
            <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-xl">
              <CopyRow
                icon={Mail}
                label="Email"
                value={SITE.email}
                href={`mailto:${SITE.email}`}
                copyValue={SITE.email}
              />
              <CopyRow
                icon={Phone}
                label="Phone"
                value={SITE.phone}
                href={`tel:${SITE.phoneHref}`}
                copyValue={SITE.phoneHref}
              />
              <CopyRow
                icon={Github}
                label="GitHub"
                value="github.com/MAamish7"
                href={SITE.socials.github}
              />
              <CopyRow
                icon={Linkedin}
                label="LinkedIn"
                value="/in/mohammad-aamish"
                href={SITE.socials.linkedin}
              />
              <CopyRow icon={MapPin} label="Location" value={SITE.location} />
            </div>

            <div className="flex flex-col gap-4 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-accent/[0.12] to-transparent p-6 backdrop-blur-xl">
              <span className="eyebrow">Résumé</span>
              <p className="text-[14px] leading-relaxed text-white/60">
                The full one-page résumé — skills, projects, certifications and academic record.
              </p>
              <MagneticButton className="self-start">
                <Button variant="outline" asChild>
                  <a href={asset(SITE.resume)} download data-cursor="PDF">
                    Download PDF
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
