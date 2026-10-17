"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/content/site";
import Image from "next/image";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // Menü gilt nur für die Seite, auf der es geöffnet wurde → schließt automatisch bei Navigation.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Nur die Startseite hat einen dunklen Hero → dort startet der Header hell auf dunkel.
  const overDark = pathname === "/" && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => {
    setOpenFor(null);
    toggleRef.current?.focus();
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500 ${
          overDark ? "bg-transparent text-bone" : "bg-bone/85 text-ink shadow-[0_1px_0_0_rgb(24_19_16/0.08)] backdrop-blur-md"
        } ${open ? "!bg-transparent !text-bone !shadow-none !backdrop-blur-none" : ""}`}
      >
        <div className="wrap flex h-[4.5rem] items-center justify-between md:h-24">
          <Link href="/" aria-label={`J.H. – ${site.name}, Startseite`} className="relative z-[60] flex items-center gap-4">
            <Image
              src="/images/logo.png"
              alt=""
              width={96}
              height={96}
              priority
              className={`h-11 w-11 transition-[filter] duration-500 md:h-12 md:w-12 ${overDark || open ? "invert" : ""}`}
            />
            <span className="hidden text-[0.8125rem] font-medium uppercase tracking-[0.3em] sm:block">{site.name}</span>
          </Link>

          <nav aria-label="Hauptnavigation" className="hidden items-center gap-10 md:flex">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`link-line py-1 text-[0.8125rem] uppercase tracking-[0.22em] ${active ? "!bg-[length:100%_1px] hover:!bg-[length:100%_1px]" : "!bg-[length:0%_1px] hover:!bg-[length:100%_1px]"}`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/kontakt?thema=erstgespraech"
              className={`rounded-full border px-5 py-2.5 text-[0.75rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
                overDark ? "border-bone/50 hover:bg-bone hover:text-ink" : "border-ink/40 hover:bg-ink hover:text-bone"
              }`}
            >
              Kostenloses Erstgespräch
            </Link>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="relative z-[60] flex h-12 w-12 items-center justify-center md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            onClick={() => setOpenFor(open ? null : pathname)}
          >
            <span className="relative block h-3 w-7" aria-hidden="true">
              <span className={`absolute left-0 h-px w-full bg-current transition-all duration-500 ${open ? "top-1/2 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-full bg-current transition-all duration-500 ${open ? "top-1/2 -rotate-45" : "bottom-0"}`} />
            </span>
          </button>
        </div>
      </header>
      <MobileMenu open={open} onClose={closeMenu} />
    </>
  );
}
