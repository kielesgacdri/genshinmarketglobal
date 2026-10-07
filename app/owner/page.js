'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OwnerDashboard() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ products: 0, users: 0, transactions: 0 });
  const router = useRouter();

  useEffect(() => {
    checkOwner();
  }, []);

  const checkOwner = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data: prof } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (prof?.role !== 'owner') {
      router.push('/');
      return;
    }

    setProfile(prof);
    loadStats();
  };

  const loadStats = async () => {
    const { count: products } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    const { count: users } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    const { count: transactions } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true });

    setStats({
      products: products || 0,
      users: users || 0,
      transactions: transactions || 0,
    });
  };

  if (!profile) {
    return <div className="min-h-screen bg-dark flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">👑 Dashboard Owner</h1>
          <Link href="/" className="text-sm text-primary">← Home</Link>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <p className="text-sm text-gray-400">Selamat datang,</p>
          <p className="text-lg font-bold">{profile.username}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-primary">{stats.products}</p>
            <p className="text-xs text-gray-400 mt-1">Produk</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-success">{stats.users}</p>
            <p className="text-xs text-gray-400 mt-1">User</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-yellow-500">{stats.transactions}</p>
            <p className="text-xs text-gray-400 mt-1">Transaksi</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/owner/produk/tambah" className="bg-primary hover:bg-blue-600 rounded-xl p-4 text-center font-semibold">
            ➕ Tambah Produk
          </Link>
          <Link href="/chat" className="bg-card border border-border hover:border-primary rounded-xl p-4 text-center font-semibold">
            💬 Chat
          </Link>
        </div>
      </div>
    </div>
  );
    }
