import Link from "next/link";
import { cn } from "@/lib/utils";

type StyleProps = {
  className?: string;
  variant?: "solid" | "outline" | "text";
  size?: "sm" | "md";
};

type CommonProps = StyleProps & {
  children: React.ReactNode;
};

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap uppercase tracking-[0.14em] font-sans transition-colors duration-300 ease-[var(--ease-editorial)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold disabled:opacity-40 disabled:pointer-events-none";

const sizes = {
  sm: "text-[11px] px-5 py-2.5",
  md: "text-xs px-7 py-3.5",
};

const variants = {
  solid: "bg-ink text-paper hover:bg-gold hover:text-ink",
  outline: "border border-current/40 text-current hover:border-current",
  text: "px-0! py-0! text-current border-b border-current/30 hover:border-current pb-1",
};

function classes({ variant = "solid", size = "md", className }: StyleProps) {
  return cn(base, sizes[size], variants[variant], className);
}

export function Button({
  children,
  onClick,
  type = "button",
  ...props
}: CommonProps & {
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button type={type} onClick={onClick} className={classes(props)}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  children,
  external = false,
  onClick,
  ...props
}: CommonProps & { href: string; external?: boolean; onClick?: () => void }) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick} className={classes(props)}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClick} className={classes(props)}>
      {children}
    </Link>
  );
}
