'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { LogOut, Crown, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ProfilPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/login');

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    setProfile(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white pb-24 fade-in">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push('/')} className="p-2 glass rounded-xl">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-bold">Profil Saya</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4">
        {/* Profile card */}
        <div className="glass rounded-3xl p-5 mb-4 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>

          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-blue-500/30">
              {profile?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-lg truncate">{profile?.username}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Mail size={11} className="text-gray-500" />
                <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            {profile?.role === 'owner' && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/15 border border-yellow-500/30">
                <Crown size={11} className="text-yellow-400" />
                <span className="text-[10px] font-black text-yellow-400 uppercase tracking-wider">Owner</span>
              </div>
            )}
            {profile?.role === 'seller' && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/15 border border-green-500/30">
                <span className="text-[10px] font-black text-green-400 uppercase tracking-wider">Seller</span>
              </div>
            )}
            {profile?.role === 'buyer' && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/30">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider">Buyer</span>
              </div>
            )}
          </div>
        </div>

        {/* Owner panel */}
        {profile?.role === 'owner' && (
          <Link
            href="/owner"
            className="flex items-center justify-between w-full glass rounded-2xl p-4 mb-3 border-yellow-500/20 bg-yellow-500/5 active:scale-[0.98] transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Crown size={18} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-yellow-400">Owner Panel</p>
                <p className="text-[10px] text-gray-500">Kelola web & seller</p>
              </div>
            </div>
            <span className="text-yellow-400">→</span>
          </Link>
        )}

        {/* Jadi seller */}
        {profile?.role === 'buyer' && (
          <Link
            href="/jadi-seller"
            className="flex items-center justify-between w-full glass rounded-2xl p-4 mb-3 active:scale-[0.98] transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-lg">
                🏪
              </div>
              <div>
                <p className="text-sm font-bold text-white">Jadi Seller</p>
                <p className="text-[10px] text-gray-500">Rp 10.000 / bulan</p>
              </div>
            </div>
            <span className="text-gray-500">→</span>
          </Link>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full glass rounded-2xl p-4 flex items-center justify-center gap-2 text-red-400 font-bold active:scale-[0.98] transition border-red-500/20 bg-red-500/5"
        >
          <LogOut size={16} />
          <span className="text-sm">Keluar</span>
        </button>
      </div>
    </div>
  );
              }
