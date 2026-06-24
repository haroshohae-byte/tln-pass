const links = [
  { label: "Partners", href: "/partners" },
  { label: "How it works", href: "/#how" },
  { label: "Membership", href: "/membership" },
  { label: "For business", href: "/business" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg font-black text-black">
            T
          </div>

          <div>
            <p className="text-lg font-black tracking-tight text-white">
              TLN Pass
            </p>
            <p className="text-xs text-zinc-500">Tallinn Membership Club</p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="/membership"
          className="hidden rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:scale-105 hover:bg-zinc-200 md:inline-flex"
        >
          Join now
        </a>

        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white">
            Menu
          </summary>

          <div className="absolute right-0 top-14 z-50 w-64 rounded-3xl border border-white/10 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-2xl px-4 py-3 text-zinc-300 hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </a>
              ))}

              <a
                href="/membership"
                className="mt-2 rounded-2xl bg-white px-4 py-3 text-center font-black text-black"
              >
                Join now
              </a>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
