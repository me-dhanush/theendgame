import { requireUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();

  return <div className="max-w-7xl mx-auto border-x relative">{children}</div>;
}
