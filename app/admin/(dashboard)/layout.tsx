import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-paper text-ink">
      <Sidebar userName={session.user.name ?? session.user.email ?? ""} />
      <main className="flex-1 overflow-x-hidden p-8 sm:p-12">{children}</main>
    </div>
  );
}
