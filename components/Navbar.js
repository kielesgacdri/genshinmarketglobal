'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-dark/95 backdrop-blur border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary">
          🌏 GenshinMarketGlobal
        </Link>
        <div className="flex gap-4 text-sm">
          <Link href="/" className="hover:text-primary">Home</Link>
          <Link href="/login" className="hover:text-primary">Login</Link>
        </div>
      </div>
    </nav>
  );
}
