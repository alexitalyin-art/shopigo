"use client";

import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* Logo */}
        <a
          href="/"
          className="text-2xl font-bold tracking-tight"
        >
          Shopigo
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a href="/" className="text-sm font-medium hover:text-gray-500">
            Home
          </a>

          <a href="/shop" className="text-sm font-medium hover:text-gray-500">
            Shop
          </a>

          <a
            href="/categories"
            className="text-sm font-medium hover:text-gray-500"
          >
            Categories
          </a>

          <a
            href="/about"
            className="text-sm font-medium hover:text-gray-500"
          >
            About
          </a>
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

          <a
            href="/cart"
            className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Cart
          </a>
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

            <a
              href="/"
              className="text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </a>

            <a
              href="/shop"
              className="text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Shop
            </a>

            <a
              href="/categories"
              className="text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Categories
            </a>

            <a
              href="/about"
              className="text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              About
            </a>

            <button
              type="button"
              className="text-left text-sm font-medium"
            >
              Search
            </button>

            <a
              href="/cart"
              className="rounded-full bg-black px-5 py-3 text-center text-sm font-medium text-white"
              onClick={() => setMenuOpen(false)}
            >
              Cart
            </a>

          </div>
        </nav>
      )}
    </header>
  );
}