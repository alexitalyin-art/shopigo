"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading account...</p>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Please sign in</h1>

          <p className="mt-2 text-gray-500">
            You need to sign in to view your account.
          </p>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-6 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Sign In
          </button>
        </div>
      </main>
    );
  }

  async function handleLogout() {
    await signOut({
      callbackUrl: "/login",
    });
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                My Account
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Welcome, {session.user.name || "Customer"}
              </h1>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
            >
              Logout
            </button>
          </div>

          <div className="mt-10 space-y-5 border-t border-gray-200 pt-8">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="mt-1 font-medium">
                {session.user.name || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="mt-1 font-medium">
                {session.user.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Account Type</p>
              <p className="mt-1 font-medium capitalize">
                {session.user.role}
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-5">
              <h2 className="font-semibold">My Orders</h2>
              <p className="mt-1 text-sm text-gray-500">
                View your orders
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <h2 className="font-semibold">Addresses</h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage delivery addresses
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-5">
              <h2 className="font-semibold">Profile</h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your profile
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}