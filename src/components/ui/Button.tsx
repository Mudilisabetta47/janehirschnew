import Link from "next/link";

type Variant = "primary" | "outline" | "light" | "ghost";

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-3.5 text-[0.8125rem] font-medium uppercase tracking-[0.18em] transition-colors duration-500 focus-visible:outline-offset-4 min-h-12";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-bone hover:text-ink before:bg-rose",
  outline: "border border-current text-ink hover:text-bone before:bg-ink",
  light: "bg-bone text-ink hover:text-ink before:bg-rose",
  ghost: "border border-bone/40 text-bone hover:text-ink before:bg-bone",
};

/** Füllfläche, die beim Hover von unten hochfährt */
const fill =
  "before:absolute before:inset-0 before:-z-10 before:translate-y-[101%] before:rounded-[inherit] before:transition-transform before:duration-500 before:ease-[var(--ease-out-expo)] hover:before:translate-y-0 isolate";

type Common = { variant?: Variant; className?: string; children: React.ReactNode; arrow?: boolean };

const Arrow = () => (
  <svg aria-hidden="true" width="18" height="10" viewBox="0 0 18 10" fill="none" className="transition-transform duration-500 group-hover:translate-x-1">
    <path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export function ButtonLink({ href, variant = "primary", className = "", children, arrow = true, ...rest }: Common & { href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">) {
  const external = /^(https?:|mailto:|tel:)/.test(href);
  const cls = `${base} ${variants[variant]} ${fill} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {arrow && <Arrow />}
    </>
  );
  if (external) {
    const isWeb = href.startsWith("http");
    return (
      <a href={href} className={cls} {...(isWeb ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {content}
    </Link>
  );
}

export function Button({ variant = "primary", className = "", children, arrow = true, ...rest }: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} ${fill} disabled:cursor-not-allowed disabled:opacity-60 ${className}`} {...rest}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </button>
  );
}
