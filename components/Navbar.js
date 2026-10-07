'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Home, MessageCircle, ShoppingBag, User, Crown, LogIn } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('role, username')
        .eq('id', user.id)
        .single();
      setProfile(data);
    }
  };

  const handleProtectedClick = (e) => {
    if (!user) {
      e.preventDefault();
      window.location.href = '/login';
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f1729]/95 backdrop-blur border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-sm text-white">G</div>
            <span className="font-bold text-sm text-white">GenshinMarket</span>
          </Link>

          <div className="flex items-center gap-2">
            {profile?.role === 'owner' && (
              <Link href="/owner" className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1">
                <Crown size={12} />
                Panel
              </Link>
            )}
            {user ? (
              <Link href="/profil" className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {profile?.username || 'Profil'}
              </Link>
            ) : (
              <Link href="/login" className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white flex items-center gap-1">
                <LogIn size={12} />
                Masuk
              </Link>
            )}
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f1729]/95 backdrop-blur border-t border-white/5">
        <div className="max-w-2xl mx-auto grid grid-cols-4">
          <Link href="/" className="flex flex-col items-center py-3 gap-1 text-blue-400">
            <Home size={20} />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link href="/chat" onClick={handleProtectedClick} className="flex flex-col items-center py-3 gap-1 text-gray-500">
            <MessageCircle size={20} />
            <span className="text-[10px] font-medium">Chat</span>
          </Link>
          <Link href="/transaksi" onClick={handleProtectedClick} className="flex flex-col items-center py-3 gap-1 text-gray-500">
            <ShoppingBag size={20} />
            <span className="text-[10px] font-medium">Transaksi</span>
          </Link>
          <Link href={user ? '/profil' : '/login'} className="flex flex-col items-center py-3 gap-1 text-gray-500">
            <User size={20} />
            <span className="text-[10px] font-medium">Profil</span>
          </Link>
        </div>
      </nav>
    </>
  );
              }
