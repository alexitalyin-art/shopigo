"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import Link from "next/link";
import { useSession } from "next-auth/react";


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { totalItems } = useCart();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight"
        >
          Shopigo
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium hover:text-gray-500">
            Home
          </Link>

          <Link href="/shop" className="text-sm font-medium hover:text-gray-500">
            Shop
          </Link>

          <Link
            href="/categories"
            className="text-sm font-medium hover:text-gray-500"
          >
            Categories
          </Link>

          <Link
            href="/about"
            className="text-sm font-medium hover:text-gray-500"
          >
            About
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            aria-label="Search"
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
          >
            Search
          </button>

          {session?.user ? (
            <Link
              href="/account"
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium hover:bg-gray-100"
            >
              Account
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium hover:bg-gray-100"
            >
              Login
            </Link>
          )}

          <Link
            href="/cart"
            className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
              Cart {totalItems > 0 && `(${totalItems})`}

          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-md border border-gray-300 px-3 py-2 text-lg md:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="border-t border-gray-200 px-6 py-5 md:hidden">
          <div className="flex flex-col gap-5">

            <Link
              href="/"
              className="text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/shop"
              className="text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </Link>

            <Link
              href="/categories"
              className="text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Categories
            </Link>

            <Link
              href="/about"
              className="text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>

            <button
              type="button"
              className="text-left text-sm font-medium"
            >
              Search
            </button>

            {session?.user ? (
              <Link
                href="/account"
                className="rounded-full border border-gray-300 px-5 py-3 text-center text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Account
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-gray-300 px-5 py-3 text-center text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            )}

            <Link
              href="/cart"
              className="rounded-full bg-black px-5 py-3 text-center text-sm font-medium text-white"
              onClick={() => setMenuOpen(false)}
            >
               Cart {totalItems > 0 && `(${totalItems})`}
            </Link>

          </div>
        </nav>
      )}
    </header>
  );
}