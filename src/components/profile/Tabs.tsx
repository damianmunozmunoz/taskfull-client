import { FingerPrintIcon, UserIcon } from '@heroicons/react/20/solid'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from "framer-motion"

const tabs = [
  { name: 'Mi Cuenta', href: '/profile', icon: UserIcon },
  { name: 'Cambiar Password', href: '/profile/password', icon: FingerPrintIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Tabs() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentTab = tabs.find(tab => tab.href === location.pathname) || tabs[0]

  return (
    <div className='mb-10'>
      {/* Versión select (mobile) */}
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">Select a tab</label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-teal-600 focus:ring-teal-600"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => navigate(e.target.value)}
          value={currentTab.href}
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.href}>{tab.name}</option>
          ))}
        </select>
      </div>

      {/* Versión desktop con barrita animada */}
      <div className="hidden sm:block">
        <div className="relative border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.href
              return (
                <Link
                  key={tab.name}
                  to={tab.href}
                  className={classNames(
                    "group relative inline-flex items-center py-4 px-1 text-sm font-medium transition-colors",
                    isActive
                      ? "text-teal-600"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <tab.icon
                    className={classNames(
                      isActive ? "text-teal-600" : "text-gray-400 group-hover:text-gray-500",
                      "-ml-0.5 mr-2 h-5 w-5"
                    )}
                    aria-hidden="true"
                  />
                  <span>{tab.name}</span>

                  {/* Barrita animada */}
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-teal-600"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
