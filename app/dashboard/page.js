'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { LogOut, ShoppingBag, MessageCircle, Store, User } from 'lucide-react';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/login');

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data?.role === 'owner') return router.push('/owner');
    setProfile(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0f1729] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1729] text-white p-5">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-500">Selamat datang,</p>
            <h1 className="text-xl font-bold">{profile.username}</h1>
          </div>
          <button onClick={handleLogout} className="p-2 bg-red-500/10 rounded-xl">
            <LogOut size={18} className="text-red-400" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <ShoppingBag size={20} className="text-blue-400 mb-2" />
            <p className="text-xs text-gray-400">Pembelian</p>
            <p className="text-lg font-bold">0</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <MessageCircle size={20} className="text-cyan-400 mb-2" />
            <p className="text-xs text-gray-400">Chat</p>
            <p className="text-lg font-bold">0</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <button className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left flex items-center gap-3">
            <Store size={18} className="text-yellow-400" />
            <span className="text-sm font-medium">Daftar Jadi Seller</span>
          </button>
          <button className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left flex items-center gap-3">
            <User size={18} className="text-purple-400" />
            <span className="text-sm font-medium">Edit Profil</span>
          </button>
        </div>
      </div>
    </div>
  );
    }
