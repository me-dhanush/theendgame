import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();

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
