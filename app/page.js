'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/welcome');
      } else {
        setUser(data.user);
      }
    });
  }, []);

  if (!user) {
    return (
      <div className="auth-bg flex items-center justify-center">
        <div className="text-white text-sm">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-8 pt-4">
          <h1 className="text-lg font-bold text-gray-900">🌏 GenshinMarket</h1>
          <Link href="/profil" className="text-xs text-[#1e3a8a] font-semibold">
            Profil
          </Link>
        </div>

        <div className="bg-blue-50 rounded-3xl p-6 mb-6">
          <p className="text-xs text-gray-500 mb-1">Selamat datang,</p>
          <p className="text-lg font-bold text-gray-900">
            {user.email?.split('@')[0]}
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/owner"
            className="block bg-[#1e3a8a] text-white font-semibold text-sm p-4 rounded-2xl text-center"
          >
            👑 Dashboard Owner
          </Link>
          <Link
            href="/jadi-seller"
            className="block bg-gray-100 text-gray-700 font-semibold text-sm p-4 rounded-2xl text-center"
          >
            🏪 Jadi Seller
          </Link>
          <Link
            href="/chat"
            className="block bg-gray-100 text-gray-700 font-semibold text-sm p-4 rounded-2xl text-center"
          >
            💬 Chat
          </Link>
        </div>
      </div>
    </div>
  );
              }
