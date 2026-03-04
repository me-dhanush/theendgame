import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
const cookieStore = await cookies();
const userId = cookieStore.get("session_user")?.value;

  // 🚪 Not logged in
  if (!userId) {
    redirect("/");
  }

  // 🔎 Fetch user from DB
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  // If cookie exists but user doesn't (edge case)
  if (!user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Welcome, {user.username} ♟️</h1>

      <form action="/api/logout" method="POST">
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-black text-white"
        >
          Logout
        </button>
      </form>
    </div>
  );
}
