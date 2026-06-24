const links = [
  { label: "Partners", href: "/partners" },
  { label: "Membership", href: "/membership" },
  { label: "My pass", href: "/join" },
  { label: "For business", href: "/business" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg font-black text-black">
            TLN
          </div>

          <div>
            <p className="text-lg font-black tracking-tight text-white">
              TLN Pass
            </p>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
              Tallinn membership
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-bold text-zinc-400 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="/admin"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-black text-zinc-300 transition hover:bg-white hover:text-black"
          >
            Admin
          </a>

          <a
            href="/join"
            className="rounded-full bg-white px-6 py-3 text-sm font-black text-black transition hover:scale-105 hover:bg-zinc-200"
          >
            Join now
          </a>
        </div>

        <a
          href="/join"
          className="rounded-full bg-white px-5 py-3 text-sm font-black text-black transition hover:scale-105 md:hidden"
        >
          Join
        </a>
      </div>

      <div className="border-t border-white/10 px-6 py-3 lg:hidden">
        <nav className="mx-auto flex max-w-7xl gap-3 overflow-x-auto">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black text-zinc-300"
            >
              {link.label}
            </a>
          ))}

          <a
            href="/admin"
            className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black text-zinc-300"
          >
            Admin
          </a>
        </nav>
      </div>
    </header>
  );
}
