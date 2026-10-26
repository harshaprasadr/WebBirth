import { useRef } from 'react'
import { company } from '@/data/site'
import { useGSAP } from '@/lib/gsap'
import { registerReveals } from '@/animations/reveal'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

type Doc = { title: string; updated?: string; sections: { h: string; p: string[] }[] }

/**
 * Plain-language baseline copy. Have it reviewed by counsel before relying on it.
 */
const docs: Record<'privacy' | 'terms', Doc> = {
  privacy: {
    title: 'Privacy Policy',
    sections: [
      {
        h: 'Who we are',
        p: [
          'Webbirth Private Ltd, its subsidiaries and branch operations hereinafter referred as \'WebBirth\', \'we\', \'us\' or \'our\' is committed to respect your privacy and choices. This statement highlights our privacy practices regarding Personal Information that we collect and store about you through this website and also for those Personal Information that you provide us while participating in our events and campaigns.',
        ],
      },
      {
        h: 'Personal information we collect',
        p: [
          'For the purposes of this privacy statement, \'Personal Information\' is any data which relates to an individual who may be identified from that data, or from a combination of a set of data, and other information which is in possession of WebBirth.',
          'Information that you provide via our website, including information you provide when you register on our website e.g. name, email address, designation, company, country and telephone number.',
          'Information about your computer and about your visits to and use of this site, such as your Internet Protocol (IP) address, demographics, your computer\'s operating system, browser type and information collected via cookies.',
        ],
      },
      {
        h: 'How we use your information',
        p: [
          'To provide better usability, troubleshooting and site maintenance. To understand which parts of the website are visited and how frequently. To create your user ID and identify you once you register on our website.',
          'To contact you and respond to your questions or requests. To provide access to desirable content based on your preferences. To process job application and related requests.',
        ],
      },
      {
        h: 'Legal basis of processing',
        p: [
          'We process your Personal Information when it is necessary for the performance of a contract to which you are the party or in order to take steps at your request prior to entering into a contract. If you do not provide the Personal Information that we need in order to provide our services, we will not be able to provide our services to you.',
          'We also process your Personal Information when it is necessary for the purposes of a legitimate interest pursued by us or a third party, when these interests are not overridden by your data protection rights.',
        ],
      },
      {
        h: 'Data recipients & disclosure',
        p: [
          'WebBirth does not share your Personal Information with third parties for their direct marketing purposes. WebBirth does not sell your Personal Information to third parties.',
          'We may share your Personal Information within WebBirth or with any of its subsidiaries, business partners, service vendors, authorized third-party agents, or contractors.',
          'In general, WebBirth, domiciled in Bangalore, is the data controller processing your Personal Information.',
        ],
      },
      {
        h: 'Use of cookies',
        p: [
          'Our website uses cookies to enhance your browsing experience. Please refer to our Cookie Policy for more details.',
          'Do Not Track (DNT) is a privacy preference that users can set in some web browsers, allowing users to opt out of tracking by websites and online services. At the present time, the World Wide Web Consortium (W3C) has not yet established universal standards for recognizable DNT signals and therefore, WebBirth does not recognize DNT.',
        ],
      },
      {
        h: 'Your privacy rights',
        p: [
          'Subject to the laws of your country, you have the right to access, correct, delete or transfer your Personal Information that we hold, including your profile and preferences. You also have the right to object to certain processing and, where we have asked for your consent to process your Personal Information, to withdraw this consent.',
          'These rights may be limited in some situations — for example, where we can demonstrate that we have a legal requirement to process your Personal Information.',
          `You can assert your rights by contacting us at ${company.email}.`,
        ],
      },
      {
        h: 'Data security & retention',
        p: [
          'WebBirth adopts reasonable and appropriate security practices and procedures including administrative, physical security, and technical controls in order to safeguard your Personal Information.',
          'Personal Information will not be retained for a period more than necessary to fulfil the purposes outlined in this privacy statement, unless a longer retention period is required by law or for directly related legitimate business purposes.',
        ],
      },
      {
        h: 'Linked websites',
        p: [
          'WebBirth provides links to third-party websites and services. However, WebBirth is not responsible for the privacy statements, practices, or the contents of such third-party websites.',
        ],
      },
      {
        h: 'Payment failure policy',
        p: [
          'In the event of delayed or missed payments, we will be forced to suspend all services associated with your brand. This includes, but is not limited to, your server, website, domain, hosting, Google search engine indexing, social media accounts, Google Ads account, Google My Business profile, and any other related assets.',
          'If payment is not received within 7 to 15 days of the due date, we will initiate the suspension process. If you have multiple services subscribed under your brand, failure to make payment for any single service will result in the suspension of all services, as all billing is grouped under one brand name.',
          'As part of this process, your domain will be redirected to webbirth.in until the outstanding payment is settled. Once payment is made, services will be promptly restored.',
        ],
      },
      {
        h: 'Shipping, return & refund policy',
        p: [
          'Shipping Policy, Return Policy, and Refund Policy are not applicable to our services in the field of IT, which includes website development, web applications, mobile apps, digital marketing, and e-commerce solutions.',
        ],
      },
      {
        h: 'Updates & contact',
        p: [
          'WebBirth may change the data privacy practices and update this privacy statement as and when the need arises, and the same will be made available on the website. Our commitment to protect the privacy of website users will continue to remain.',
          `Contact address: ${company.address.join(', ')}. Mobile: ${company.phones.join(' | ')}. Email: ${company.email}.`,
        ],
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    sections: [
      {
        h: 'Services offered',
        p: [
          'We offer a range of services including website development, web application development, mobile application development, hosting & domain services, e-commerce website/app development, digital marketing, and UI/UX design. When you engage our services, you are agreeing to comply with these terms.',
        ],
      },
      {
        h: 'Client responsibilities',
        p: [
          'As a client, it is important to provide accurate information for project execution and maintain open communication throughout the development phase. Timely feedback helps us ensure a successful project completion.',
          'Clients are responsible for providing necessary information, materials, and feedback in a timely manner to facilitate the delivery of services. Delays caused by the client may affect project timelines and outcomes.',
        ],
      },
      {
        h: 'Payment terms',
        p: [
          'Payment terms will be outlined in the project proposal or agreement. Please adhere to the agreed-upon payment schedule to avoid delays in project completion. WebBirth reserves the right to suspend or terminate services if payment is not received as agreed.',
          'In the event of delayed or missed payments, we will be forced to suspend all services associated with your brand. This includes, but is not limited to, your server, website, domain, hosting, Google search engine indexing, social media accounts, Google Ads account, Google My Business profile, and any other related assets.',
          'If payment is not received within 7 to 15 days of the due date, we will initiate the suspension process. If you have multiple services subscribed under your brand, failure to make payment for any single service will result in the suspension of all services, as all billing is grouped under one brand name.',
          'As part of this process, your domain will be redirected to webbirth.in until the outstanding payment is settled. Once payment is made, services will be promptly restored.',
          'We appreciate your understanding, as we must cover our operational costs to continue providing you with quality service.',
        ],
      },
      {
        h: 'Intellectual property & ownership',
        p: [
          'The ownership of completed projects, including source code, designs, and content, will transfer to you upon full and final payment, unless otherwise agreed upon in writing.',
          'WebBirth retains ownership of all intellectual property rights, including but not limited to design concepts, code, and marketing materials, unless otherwise agreed upon in writing.',
        ],
      },
      {
        h: 'Confidentiality',
        p: [
          'Both parties agree to keep confidential any proprietary or sensitive information disclosed during the course of the project.',
        ],
      },
      {
        h: 'Project timelines & scope changes',
        p: [
          'Project timelines will be outlined in the project proposal or agreement. WebBirth is not responsible for delays caused by factors outside of its control.',
          'Changes to the scope of work or project specifications may incur additional costs. All changes must be agreed upon in writing.',
        ],
      },
      {
        h: 'Termination',
        p: [
          'Either party may terminate the agreement in writing if the other party breaches its obligations. Termination fees may apply.',
        ],
      },
      {
        h: 'Governing law',
        p: [
          'These terms are governed by the laws of India, with courts in Bengaluru, Karnataka having jurisdiction.',
          'By using WebBirth\'s services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.',
        ],
      },
    ],
  },
}

export function LegalPage({ kind }: { kind: keyof typeof docs }) {
  const scope = useRef<HTMLElement>(null)
  const doc = docs[kind]
  useDocumentTitle(`${doc.title} — WebBirth`)
  useGSAP(() => registerReveals(scope.current!), { scope, dependencies: [kind], revertOnUpdate: true })

  return (
    <main ref={scope} id="main" className="gutter bg-paper section-pb pt-32 lg:pt-40">
      <p className="type-meta flex items-center gap-4 text-muted">
        <span>Legal</span>
        <span className="flex-1" aria-hidden="true" />
        
      </p>
      <h1 data-reveal="lines" className="type-display mt-12 uppercase">
        {doc.title}
      </h1>
      <div className="section-gap grid gap-y-14 lg:grid-cols-12">
        {doc.sections.map((s, i) => (
          <section key={s.h} data-reveal="fade" className="grid gap-4 border-t border-line pt-6 lg:col-span-12 lg:grid-cols-12">
            <h2 className="flex gap-4 text-xl font-medium tracking-tight lg:col-span-4">
              <span className="type-meta pt-1.5 text-muted">{String(i + 1).padStart(2, '0')}</span>
              {s.h}
            </h2>
            <div className="type-body flex max-w-2xl flex-col gap-4 text-ink/75 lg:col-span-7 lg:col-start-6">
              {s.p.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
