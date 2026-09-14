import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
  wide = false,
}: {
  className?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 sm:px-10 lg:px-16",
        wide ? "max-w-[1600px]" : "max-w-[1280px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
