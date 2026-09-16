"use client";

import { signOut } from "next-auth/react";

type AdminHeaderProps = {
  name?: string | null;
  email?: string | null;
};

export default function AdminHeader({
  name,
  email,
}: AdminHeaderProps) {
  async function handleLogout() {
    await signOut({
      callbackUrl: "/admin/login",
    });
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-lg font-bold">Shopigo Admin</h1>

          <div className="mt-1 text-sm text-gray-500">
            {name || email || "Admin"}
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
}