export default function Header() {
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
          <a
            href="/"
            className="text-sm font-medium hover:text-gray-500"
          >
            Home
          </a>

          <a
            href="/shop"
            className="text-sm font-medium hover:text-gray-500"
          >
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

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button
            type="button"
            aria-label="Search"
            className="hidden rounded-full border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 sm:block"
          >
            Search
          </button>

          {/* Cart */}
          <a
            href="/cart"
            className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Cart
          </a>
        </div>

      </div>
    </header>
  );
}