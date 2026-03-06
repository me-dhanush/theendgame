import { Navbar } from "@/components/sections/navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto border-x relative">
      <Navbar />
      {children}
    </div>
  );
}
