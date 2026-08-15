import { Link } from 'react-router-dom'
import heroImage from '@/assets/images/hero-lagos-street.jpg'
import sunsetImage from '@/assets/images/section-nigeria-sunset.jpg'
import marketImage from '@/assets/images/market-mile12-lagos.jpg'
import wasteImage from '@/assets/images/waste-pile-kaduna.jpg'
import houseImage from '@/assets/images/housing-estate-lagos.jpg'
import { FeatureCard } from '@/components/FeatureCard'

const steps = [
  { number: '01', title: 'Waste is added', description: 'A public user adds simulated waste to a smart bin near them.' },
  { number: '02', title: 'Level updates', description: 'The bin’s fill level rises in real time and is recorded.' },
  { number: '03', title: 'Thresholds trigger alerts', description: 'At 80%, 90%, and 100% full, NISEPA staff and admins are notified.' },
  { number: '04', title: 'Collection is recorded', description: 'Staff collect the bin and log it — the level resets and history updates.' },
]

const features = [
  {
    title: 'Real-Time Monitoring',
    description: 'Track waste levels across every registered bin as they change, without refreshing the page.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M8 17V9m4 8V5m4 12v-5" />
      </svg>
    ),
  },
  {
    title: 'Smart Alerts',
    description: 'Automatic 80%, 90%, and 100% threshold alerts reach staff and administrators the moment a bin needs attention.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    title: 'Public Reporting',
    description: 'Anyone can report a waste issue near them, adding another set of eyes on the network.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.5-4.03-7-7.5-7-10.5A7 7 0 0 1 19 10.5c0 3-2.5 6.47-7 10.5Z" />
        <circle cx="12" cy="10.5" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Collection History',
    description: 'Every collection is logged, giving NISEPA a clear record of bin activity over time.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.75} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
]

export function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="group relative overflow-hidden">
        <img
          src={heroImage}
          alt="An aerial view of a busy street market in Lagos, Nigeria"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/70 to-neutral-950/40" />

        <div className="relative mx-auto max-w-6xl px-6 py-28 text-center sm:py-36">
          <h1 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Smart Waste Monitoring for Niger State
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-neutral-200">
            NISEPA SmartBin connects public and household waste bins to a live monitoring network — giving staff
            and administrators the visibility they need to keep Niger State clean.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              to="/register"
              className="rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg"
            >
              Get started
            </Link>
            <Link
              to="/smart-bin"
              className="rounded-md border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20"
            >
              See the smart bin
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">How it works</h2>
          <p className="mx-auto mt-2 max-w-xl text-neutral-600">
            A simple loop connects the public, the bins, and NISEPA’s response teams.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-lg p-3 transition-all duration-200 hover:-translate-y-1 hover:bg-neutral-0 hover:shadow-md"
            >
              <span className="text-sm font-semibold text-brand-600">{step.number}</span>
              <h3 className="mt-2 text-base font-semibold text-neutral-900">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The problem */}
      <section className="bg-neutral-0 py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2">
          <div className="group overflow-hidden rounded-xl shadow-sm">
            <img
              src={wasteImage}
              alt="Uncollected waste piled up along a street in Kaduna State, Nigeria"
              className="h-72 w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105 lg:h-96"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">The problem NISEPA is solving</h2>
            <p className="mt-4 text-neutral-600">
              Across Niger State, waste that isn't tracked is waste that gets forgotten — piling up along roads and
              drainage until it becomes a health hazard. Without visibility into which bins are full, collection
              teams either arrive too late or waste trips on bins that barely need attention.
            </p>
            <p className="mt-4 text-neutral-600">
              SmartBin closes that gap: every bin reports its level continuously, so NISEPA always knows exactly
              where to send a truck next.
            </p>
          </div>
        </div>
      </section>

      {/* Bins reach homes too */}
      <section className="py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <h2 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">Now reaching homes, not just roadsides</h2>
            <p className="mt-4 text-neutral-600">
              SmartBin isn't limited to shared market and roadside bins. NISEPA can register a bin directly to a
              household — once assigned, that resident sees their own bin's level right on their dashboard when
              they sign in.
            </p>
            <p className="mt-4 text-neutral-600">
              Everyone, logged in or not, can still browse the full network — roadside and household bins alike —
              from the Smart Bin page.
            </p>
            <Link
              to="/smart-bin"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800 hover:underline"
            >
              Browse the full network
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path
                  fillRule="evenodd"
                  d="M10.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4l3.3-3.3H3a1 1 0 1 1 0-2h10.6l-3.3-3.3a1 1 0 0 1 0-1.4Z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
          <div className="order-1 grid grid-cols-2 gap-4 lg:order-2">
            <div className="group col-span-2 overflow-hidden rounded-xl shadow-sm sm:col-span-1">
              <img
                src={houseImage}
                alt="A residential housing estate in Lagos, Nigeria — the kind of household SmartBin now reaches"
                className="h-56 w-full object-cover object-top transition-transform duration-500 motion-safe:group-hover:scale-105"
              />
            </div>
            <div className="group col-span-2 overflow-hidden rounded-xl shadow-sm sm:col-span-1">
              <img
                src={marketImage}
                alt="A busy market in Lagos, Nigeria, full of vendors and shoppers"
                className="h-56 w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-neutral-0 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-neutral-900 sm:text-3xl">Built for real monitoring</h2>
            <p className="mx-auto mt-2 max-w-xl text-neutral-600">
              Everything NISEPA needs to track bins, respond to alerts, and keep a record of collections.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.description} />
            ))}
          </div>
        </div>
      </section>

      {/* Mission strip */}
      <section className="group relative overflow-hidden">
        <img
          src={sunsetImage}
          alt="Sunset over a residential neighborhood in Nigeria"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-neutral-950/70" />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">A cleaner Niger State, one bin at a time</h2>
          <p className="mt-4 text-neutral-200">
            NISEPA SmartBin is an academic prototype demonstrating how connected waste bins can give the Niger
            State Environmental Protection Agency timely, reliable visibility into collection needs.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-block rounded-md bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg"
          >
            Create your account
          </Link>
        </div>
      </section>
    </div>
  )
}
