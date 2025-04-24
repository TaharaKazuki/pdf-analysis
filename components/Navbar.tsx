'use client';

import { SignedIn, SignedOut, SignOutButton } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <nav className="border-b border-purple-300/5 shadow-[0_4px_20px_-10px] shadow-purple-200/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            PDFtoolAI
          </Link>

          <div className="hidden items-center space-x-4 md:flex">
            <Link
              href="/dashboard"
              className="px-4 py-2 text-white/70 transition-all duration-300 hover:rounded-md hover:text-white hover:shadow-[0_2px_8px_0] hover:shadow-purple-400/40"
            >
              Dashboard
            </Link>
            <Link
              href="/pricing"
              className="px-4 py-2 text-white/70 transition-all duration-300 hover:rounded-md hover:text-white hover:shadow-[0_2px_8px_0] hover:shadow-purple-400/40"
            >
              Pricing
            </Link>
            <SignedIn>
              <SignOutButton>
                <button className="px-4 py-2 text-white/70 transition-all duration-300 hover:rounded-md hover:text-white hover:shadow-[0_2px_8px_0] hover:shadow-purple-400/40">
                  Sign Out
                </button>
              </SignOutButton>
            </SignedIn>
            <SignedOut>
              <div className="flex items-center">
                <Link
                  href="/sign-in"
                  className="group relative inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-white transition-all hover:bg-white/5"
                >
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF1E56] via-[#FF00FF] to-[#00FFFF] opacity-70 blur-sm transition-all group-hover:opacity-100" />
                  <span className="absolute inset-0.5 rounded-full bg-black/50" />
                  <span className="relative font-medium">Sign In</span>
                </Link>
              </div>
            </SignedOut>
          </div>
          {/* Mobile menu button */}
          <div className="z-50 md:hidden">
            <button onClick={toggleMenu} className="p-2">
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        {/* Mobile menu navigation */}

        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className={`absolute inset-0 backdrop-blur-xl transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeMenu}
          />
          <div
            className={`absolute top-16 right-0 left-0 border-b border-purple-300/5 shadow-lg transition-all duration-300 ease-in-out ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
          >
            <div className="flex flex-col space-y-4 text-center">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-white/70 transition-all duration-300 hover:rounded-md hover:text-white hover:shadow-[0_2px_8px_0] hover:shadow-purple-400/40"
              >
                Dashboard
              </Link>
              <Link
                href="/pricing"
                className="px-4 py-2 text-white/70 transition-all duration-300 hover:rounded-md hover:text-white hover:shadow-[0_2px_8px_0] hover:shadow-purple-400/40"
              >
                Pricing
              </Link>
              <div className="mx-auto mt-2 mb-6 max-w-lg">
                <SignedIn>
                  <SignOutButton>
                    <button className="px-4 py-2 text-white/70 transition-all duration-300 hover:rounded-md hover:text-white hover:shadow-[0_2px_8px_0] hover:shadow-purple-400/40">
                      Sign Out
                    </button>
                  </SignOutButton>
                </SignedIn>
                <SignedOut>
                  <div className="flex items-center">
                    <Link
                      href="/sign-in"
                      className="group relative inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-white transition-all hover:bg-white/5"
                    >
                      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF1E56] via-[#FF00FF] to-[#00FFFF] opacity-70 blur-sm transition-all group-hover:opacity-100"></span>
                      <span className="absolute inset-0.5 rounded-full bg-black/50"></span>
                      <span className="relative font-medium">Sign In</span>
                    </Link>
                  </div>
                </SignedOut>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
