import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-paper-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("border border-paper-line bg-white/50 p-6", className)}>{children}</div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="border border-dashed border-paper-line p-12 text-center text-sm text-paper-muted">
      {message}
    </div>
  );
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto border border-paper-line">
      <table className="w-full min-w-[640px] border-collapse text-sm">{children}</table>
    </div>
  );
}

export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-b border-paper-line bg-paper-dim px-4 py-3 text-left text-[11px] uppercase tracking-[0.1em] text-paper-muted">
      {children}
    </th>
  );
}

export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("border-b border-paper-line px-4 py-3", className)}>{children}</td>;
}
