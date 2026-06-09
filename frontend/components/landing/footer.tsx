import { Logo } from './logo'

const columns = [
  {
    title: 'Product',
    links: ['Features', 'AI tools', 'Leaderboards', 'Study groups', 'Pricing'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Blog', 'Press', 'Contact'],
  },
  {
    title: 'Resources',
    links: ['Help center', 'Community', 'Students', 'Campus reps', 'Status'],
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms', 'Cookies', 'Security'],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The student collaboration platform that makes studying social,
              rewarding, and a little addictive.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {col.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} StudySync, Inc. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made for students, by students.
          </p>
        </div>
      </div>
    </footer>
  )
}
