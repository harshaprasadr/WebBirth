import { useId, useRef, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { company, projectTypes } from '@/data/site'
import { useGSAP } from '@/lib/gsap'
import { registerReveals } from '@/animations/reveal'
import { cn } from '@/lib/cn'
import { PillButton } from './ui'

type Values = {
  name: string
  email: string
  phone: string
  company: string
  projectType: string
  message: string
}
type Errors = Partial<Record<keyof Values, string>>
type Status = 'idle' | 'sending' | 'sent' | 'mailto' | 'error'

const initial: Values = { name: '', email: '', phone: '', company: '', projectType: '', message: '' }
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined

function validate(v: Values): Errors {
  const e: Errors = {}
  if (!v.name.trim()) e.name = 'Please tell us your name.'
  if (!v.email.trim()) e.email = 'We need an email to reply.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) e.email = 'That email doesn’t look right.'
  if (v.phone && !/^[+()\d\s-]{7,20}$/.test(v.phone)) e.phone = 'Use digits, spaces, + or -.'
  if (!v.projectType) e.projectType = 'Pick the closest match.'
  if (v.message.trim().length < 10) e.message = 'A sentence or two about the project helps.'
  return e
}

const mailtoHref = (v: Values) => {
  const body = [
    `Name: ${v.name}`,
    `Email: ${v.email}`,
    ...(v.phone ? [`Phone: ${v.phone}`] : []),
    ...(v.company ? [`Company: ${v.company}`] : []),
    `Project type: ${v.projectType}`,
    '',
    v.message,
  ].join('\n')
  return `mailto:${company.email}?subject=${encodeURIComponent(`Project inquiry — ${v.name}`)}&body=${encodeURIComponent(body)}`
}

export function ContactForm() {
  const scope = useRef<HTMLElement>(null)
  const [values, setValues] = useState<Values>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')

  useGSAP(() => registerReveals(scope.current!), { scope })

  const set = (k: keyof Values) => (val: string) => {
    setValues((v) => ({ ...v, [k]: val }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    if ((form.elements.namedItem('website') as HTMLInputElement | null)?.value) return // honeypot

    const found = validate(values)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    if (!ENDPOINT) {
      window.location.href = mailtoHref(values)
      setStatus('mailto')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
      setValues(initial)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section ref={scope} id="contact" data-hides-cta aria-labelledby="contact-title" className="gutter relative bg-paper section-y">
      <div className="type-meta flex items-center gap-4 text-muted">
        <span data-reveal="fade">Contact</span>
        <span className="flex-1" aria-hidden="true" />
        <span data-reveal="fade">{company.email}</span>
      </div>

      <h2 id="contact-title" data-reveal="lines" className="type-hero mt-[clamp(1.5rem,3vw,3rem)] uppercase">
        Let&rsquo;s talk<span className="text-accent">.</span>
      </h2>

      <div className="section-gap grid gap-16 lg:grid-cols-12">
        {/* details */}
        <aside className="grid gap-8 sm:grid-cols-2 lg:col-span-4 lg:flex lg:flex-col lg:gap-10" aria-label="Contact details">
          <Detail label="Email">
            <a href={`mailto:${company.email}`} className="inline-flex min-h-11 items-center text-[clamp(1.4rem,2.2vw,2rem)] font-medium tracking-[-0.03em]">
              <span className="link-reveal">{company.email}</span>
            </a>
          </Detail>
          <Detail label="Phone">
            <ul className="flex flex-col text-lg">
              {company.phones.map((p) => (
                <li key={p}>
                  <a href={`tel:${p.replace(/\s/g, '')}`} className="inline-flex min-h-11 items-center">
                    <span className="link-reveal">{p}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Detail>
          <Detail label="Studio">
            <a href={company.mapUrl} target="_blank" rel="noreferrer" className="group block text-lg leading-snug">
              {company.address.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
              <span className="type-meta mt-2 inline-flex items-center gap-1 text-muted group-hover:text-ink">
                Open in maps <ArrowUpRight className="size-3.5" strokeWidth={1.75} />
              </span>
            </a>
          </Detail>
        </aside>

        {/* form */}
        <form noValidate onSubmit={onSubmit} className="lg:col-span-7 lg:col-start-6" aria-describedby="form-status">
          <div className="grid gap-x-8 gap-y-2 md:grid-cols-2">
            <Field label="Name" name="name" autoComplete="name" required value={values.name} onValue={set('name')} error={errors.name} />
            <Field label="Email" name="email" type="email" autoComplete="email" required value={values.email} onValue={set('email')} error={errors.email} />
            <Field label="Phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onValue={set('phone')} error={errors.phone} />
            <Field label="Company" name="company" autoComplete="organization" value={values.company} onValue={set('company')} />
          </div>

          <fieldset className="mt-10">
            <legend className="type-meta text-muted">
              Project type <span className="text-accent">*</span>
            </legend>
            <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-invalid={!!errors.projectType}>
              {projectTypes.map((t) => {
                const checked = values.projectType === t
                return (
                  <label
                    key={t}
                    className={cn(
                      'relative flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent',
                      checked ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink',
                    )}
                  >
                    <input
                      type="radio"
                      name="projectType"
                      value={t}
                      checked={checked}
                      onChange={() => set('projectType')(t)}
                      className="sr-only"
                    />
                    {checked && <Check className="size-3.5" strokeWidth={2} aria-hidden="true" />}
                    {t}
                  </label>
                )
              })}
            </div>
            {errors.projectType && <p className="mt-2 text-sm text-red-600">{errors.projectType}</p>}
          </fieldset>

          <div className="mt-6">
            <Field
              label="Tell us about the project"
              name="message"
              multiline
              required
              value={values.message}
              onValue={set('message')}
              error={errors.message}
            />
          </div>

          {/* honeypot */}
          <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
            <label>
              Website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <p id="form-status" role="status" aria-live="polite" className="type-meta max-w-xs text-muted">
              {status === 'sending' && 'Sending…'}
              {status === 'sent' && <span className="text-ink">Thank you — your inquiry is in. We’ll be in touch shortly.</span>}
              {status === 'mailto' && <span className="text-ink">Your email app should open with the inquiry ready to send.</span>}
              {status === 'error' && (
                <span className="text-red-600">
                  Something went wrong. Please email{' '}
                  <a className="underline" href={mailtoHref(values)}>
                    {company.email}
                  </a>
                  .
                </span>
              )}
              {status === 'idle' && 'Fields marked * are required.'}
            </p>
            <PillButton type="submit" disabled={status === 'sending'} className="self-start sm:self-auto">
              Send inquiry
            </PillButton>
          </div>
        </form>
      </div>
    </section>
  )
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div data-reveal="fade">
      <p className="type-meta mb-3 text-muted">{label}</p>
      {children}
    </div>
  )
}

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value'> & {
  label: string
  name: string
  value: string
  onValue: (v: string) => void
  error?: string
  multiline?: boolean
}

/** Underlined field with a floating label and an accent rule that draws on focus. */
function Field({ label, name, value, onValue, error, multiline, required, ...rest }: FieldProps) {
  const id = useId()
  const errId = `${id}-err`
  const shared = {
    id,
    name,
    value,
    required,
    placeholder: ' ',
    'aria-invalid': !!error,
    'aria-describedby': error ? errId : undefined,
    className:
      'peer block w-full resize-none bg-transparent pb-3 pt-7 text-lg outline-none placeholder-transparent focus-visible:outline-none',
  }
  return (
    <div className="relative">
      {multiline ? (
        <textarea {...shared} rows={4} onChange={(e) => onValue(e.target.value)} />
      ) : (
        <input {...shared} {...rest} onChange={(e) => onValue(e.target.value)} />
      )}
      <label
        htmlFor={id}
        className="type-meta pointer-events-none absolute left-0 top-7 origin-left text-muted transition-all duration-500 ease-[var(--ease-expo)] peer-focus:top-1 peer-focus:text-accent peer-[:not(:placeholder-shown)]:top-1"
      >
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      <span className={cn('absolute bottom-0 left-0 h-px w-full', error ? 'bg-red-500' : 'bg-line')} aria-hidden="true" />
      <span
        className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[var(--ease-expo)] peer-focus:scale-x-100"
        aria-hidden="true"
      />
      <p id={errId} className={cn('min-h-6 pt-1.5 text-sm text-red-600', !error && 'invisible')}>
        {error ?? '·'}
      </p>
    </div>
  )
}
