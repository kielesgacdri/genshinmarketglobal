'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { LogOut, Package, Users, DollarSign, MessageCircle, Plus } from 'lucide-react';
import Link from 'next/link';

export default function OwnerDashboard() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ products: 0, users: 0, tx: 0 });
  const router = useRouter();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return router.push('/login');

    const { data: prof } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (prof?.role !== 'owner') return router.push('/dashboard');
    setProfile(prof);

    const [{ count: p }, { count: u }, { count: t }] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('transactions').select('*', { count: 'exact', head: true }),
    ]);
    setStats({ products: p || 0, users: u || 0, tx: t || 0 });
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
            <p className="text-xs text-yellow-400 font-semibold">👑 OWNER PANEL</p>
            <h1 className="text-xl font-bold">{profile.username}</h1>
          </div>
          <button onClick={handleLogout} className="p-2 bg-red-500/10 rounded-xl">
            <LogOut size={18} className="text-red-400" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20 rounded-2xl p-3">
            <Package size={16} className="text-blue-400 mb-1" />
            <p className="text-[10px] text-gray-400">Produk</p>
            <p className="text-base font-bold">{stats.products}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/20 rounded-2xl p-3">
            <Users size={16} className="text-green-400 mb-1" />
            <p className="text-[10px] text-gray-400">User</p>
            <p className="text-base font-bold">{stats.users}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/20 rounded-2xl p-3">
            <DollarSign size={16} className="text-yellow-400 mb-1" />
            <p className="text-[10px] text-gray-400">Transaksi</p>
            <p className="text-base font-bold">{stats.tx}</p>
          </div>
        </div>

        <Link
          href="/owner/tambah-produk"
          className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-4 text-center font-semibold mb-3 shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} className="inline mr-2" />
          Tambah Produk
        </Link>

        <div className="space-y-2">
          <button className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left flex items-center gap-3">
            <MessageCircle size={18} className="text-cyan-400" />
            <span className="text-sm font-medium">Chat & Rekber</span>
          </button>
          <button className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left flex items-center gap-3">
            <Users size={18} className="text-green-400" />
            <span className="text-sm font-medium">Kelola Seller</span>
          </button>
        </div>
      </div>
    </div>
  );
}
