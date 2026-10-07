'use client';
import Link from 'next/link';

export default function Welcome() {
  return (
    <div className="auth-bg flex items-center justify-center p-6">
      <div className="auth-card w-full max-w-sm p-8 text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#1e3a8a] flex items-center justify-center text-3xl mb-6">
          🌏
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          GenshinMarketGlobal
        </h1>
        <p className="text-sm text-gray-500 mb-10">
          Jual beli akun game dengan aman & terpercaya
        </p>

        <div className="space-y-3">
          <Link href="/login" className="auth-btn block text-center">
            Masuk
          </Link>
          <Link
            href="/register"
            className="block text-center w-full py-4 rounded-[0.875rem] bg-gray-100 text-gray-700 font-semibold text-sm"
          >
            Daftar Akun Baru
          </Link>
        </div>

        <p className="text-[11px] text-gray-400 mt-8">
          © 2026 GenshinMarketGlobal
        </p>
      </div>
    </div>
  );
}
