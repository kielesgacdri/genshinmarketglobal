'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { LogOut, Package, Users, DollarSign, MessageCircle, Plus, Crown, ArrowLeft } from 'lucide-react';
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

    if (prof?.role !== 'owner') return router.push('/');
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
    window.location.href = '/login';
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white pb-8 fade-in">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/')} className="p-2 glass rounded-xl">
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <Crown size={11} className="text-yellow-400" />
                <p className="text-[10px] text-yellow-400 font-black tracking-wider">OWNER PANEL</p>
              </div>
              <p className="font-bold text-sm">{profile.username}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 bg-red-500/10 border border-red-500/20 rounded-xl">
            <LogOut size={16} className="text-red-400" />
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <div className="glass rounded-2xl p-3.5 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl"></div>
            <Package size={18} className="text-blue-400 mb-2 relative" />
            <p className="text-[10px] text-gray-500 font-semibold relative">Produk</p>
            <p className="text-xl font-black mt-0.5 relative">{stats.products}</p>
          </div>
          <div className="glass rounded-2xl p-3.5 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-20 h-20 bg-green-500/20 rounded-full blur-2xl"></div>
            <Users size={18} className="text-green-400 mb-2 relative" />
            <p className="text-[10px] text-gray-500 font-semibold relative">User</p>
            <p className="text-xl font-black mt-0.5 relative">{stats.users}</p>
          </div>
          <div className="glass rounded-2xl p-3.5 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-20 h-20 bg-yellow-500/20 rounded-full blur-2xl"></div>
            <DollarSign size={18} className="text-yellow-400 mb-2 relative" />
            <p className="text-[10px] text-gray-500 font-semibold relative">Order</p>
            <p className="text-xl font-black mt-0.5 relative">{stats.tx}</p>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/owner/tambah-produk"
          className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-4 font-black text-sm shadow-xl shadow-blue-500/30 mb-4 active:scale-[0.98] transition"
        >
          <Plus size={18} />
          Tambah Produk
        </Link>

        {/* Menu */}
        <div className="space-y-2.5">
          <Link href="/chat" className="flex items-center justify-between w-full glass rounded-2xl p-4 active:scale-[0.98] transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <MessageCircle size={18} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-bold">Chat & Rekber</p>
                <p className="text-[10px] text-gray-500">Kelola transaksi</p>
              </div>
            </div>
            <span className="text-gray-500">→</span>
          </Link>

          <Link href="/owner/kelola-seller" className="flex items-center justify-between w-full glass rounded-2xl p-4 active:scale-[0.98] transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Users size={18} className="text-green-400" />
              </div>
              <div>
                <p className="text-sm font-bold">Kelola Seller</p>
                <p className="text-[10px] text-gray-500">ACC / tolak seller</p>
              </div>
            </div>
            <span className="text-gray-500">→</span>
          </Link>

          <Link href="/" className="flex items-center justify-between w-full glass rounded-2xl p-4 active:scale-[0.98] transition">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Package size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-bold">Lihat Web Publik</p>
                <p className="text-[10px] text-gray-500">Cek tampilan buyer</p>
              </div>
            </div>
            <span className="text-gray-500">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
    }
