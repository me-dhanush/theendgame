"use client";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#262421] text-[#cfcfcf]">
      <div className="w-full max-w-md rounded-md bg-[#2e2a26] border border-[#3a3632] shadow-lg p-8">
        {/* Title */}
        <div className="text-center mb-8">
          <p className="text-sm text-[#a8a29e] mt-2">
            Access your tournaments and manage your events.
          </p>
        </div>

        {/* Login Button */}
        <a
          href="/api/auth/lichess"
          className="block w-full text-center bg-secondary hover:bg-[#c79a72] text-white font-semibold py-3 rounded-sm transition"
        >
          Login with Lichess
        </a>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#3a3632]"></div>
          <span className="text-xs text-[#8a847d]">secure login</span>
          <div className="flex-1 h-px bg-[#3a3632]"></div>
        </div>

        {/* Footer */}
        <p className="text-xs text-center text-[#8a847d]">
          Authentication is handled securely through Lichess.
        </p>
      </div>
    </div>
  );
}
