import { Link, Outlet } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import marketImage from '@/assets/images/market-crowd-lagos.jpg'
import wasteImage from '@/assets/images/street-vendor-cart.jpg'

const benefits = [
  'Real-time visibility into every monitored bin — roadside and household',
  'Automatic 80% / 90% / 100% threshold alerts',
  'A clear, auditable collection history',
]

export function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex">
        <img
          src={marketImage}
          alt="A busy street in Lagos, Nigeria, full of people going about their day"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/80 via-brand-900/75 to-brand-950/90" />

        <div className="relative">
          <Link to="/">
            <Logo variant="light" />
          </Link>
        </div>
        <div className="relative">
          <h2 className="text-2xl font-semibold">Monitoring waste, together.</h2>
          <ul className="mt-6 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm text-brand-50">
                <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-brand-300">
                  <path
                    fillRule="evenodd"
                    d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center gap-3 rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
            <img
              src={wasteImage}
              alt="Uncollected waste on a Nigerian roadside — the problem NISEPA SmartBin addresses"
              className="h-14 w-14 shrink-0 rounded-md object-cover"
            />
            <p className="text-xs text-brand-100">
              Uncollected waste is a daily reality across Niger State. SmartBin gives NISEPA the visibility to
              respond before it piles up.
            </p>
          </div>
        </div>
        <p className="relative text-xs text-brand-200">NISEPA SmartBin — an academic prototype.</p>
      </div>

      <div className="flex flex-col">
        <div className="p-6 lg:hidden">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-16">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
