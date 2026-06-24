export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-10 md:flex-row md:items-center">
        <div>
          <p className="text-xl font-black text-white">TLN Pass</p>
          <p className="mt-2 text-sm text-zinc-500">Tallinn, Estonia</p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-zinc-500">
          <a href="/partners" className="hover:text-white">
            Partners
          </a>
          <a href="/membership" className="hover:text-white">
            Membership
          </a>
          <a href="/business" className="hover:text-white">
            For business
          </a>
          <a href="/contact" className="hover:text-white">
            Contact
          </a>
          <a href="mailto:hello@tlnpass.ee" className="hover:text-white">
            hello@tlnpass.ee
          </a>
        </div>
      </div>
    </footer>
  );
}
