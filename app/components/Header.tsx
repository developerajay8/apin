"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

// Fake auth state (replace with real auth logic)
const isAuthenticated = false; // true if logged in

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Videos", href: "/videos" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-black text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-white">
              MyBrand
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-gray-300 transition"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="flex space-x-3">
              {isAuthenticated ? (
                <button
                  onClick={() => alert("Logging out...")}
                  className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/90">
          <nav className="flex flex-col px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-2 px-3 rounded hover:bg-white/10 transition"
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col space-y-2 mt-2">
              {isAuthenticated ? (
                <button
                  onClick={() => alert("Logging out...")}
                  className="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="w-full px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition text-center"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="w-full px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition text-center"
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
