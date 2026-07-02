'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun, Tv2, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const navLinks = ['Live', 'Schedule', 'Sports', 'About'];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0F172A]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/30 group-hover:shadow-red-500/50 transition-all duration-300">
            <Tv2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-white">Stream</span>
            <span className="text-red-500">Zone</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="rounded-md px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}

          <button
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white transition-all duration-200"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0F172A] px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="rounded-md px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200"
              onClick={() => setMobileOpen(false)}
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
