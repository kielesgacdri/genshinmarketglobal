'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import {
  LogOut, Crown, ArrowLeft, Mail, AlertTriangle, Package,
  ShoppingBag, MessageCircle, Settings, ChevronRight, Shield,
  Star, Store, Edit3, HelpCircle, FileText
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilPage() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ products: 0, orders: 0, chats: 0 });
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
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

    // Load stats
    const [{ count: p }, { count: o }, { count: c }] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('seller_id', user.id),
      supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('buyer_id', user.id),
      supabase.from('chat_rooms').select('*', { count: 'exact', head: true }).or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`),
    ]);

    setStats({ products: p || 0, orders: o || 0, chats: c || 0 });
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
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

  const roleBadge = {
    owner: { bg: 'bg-yellow-500/15', border: 'border-yellow-500/30', text: 'text-yellow-400', label: 'Owner', icon: Crown },
    seller: { bg: 'bg-green-500/15', border: 'border-green-500/30', text: 'text-green-400', label: 'Seller', icon: Store },
    buyer: { bg: 'bg-blue-500/15', border: 'border-blue-500/30', text: 'text-blue-400', label: 'Buyer', icon: Star },
  }[profile?.role] || {};

  const RoleIcon = roleBadge.icon;

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white pb-24 fade-in">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push('/')} className="p-2 glass rounded-xl active:scale-95 transition">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-bold">Profil Saya</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Profile Card */}
        <div className="glass rounded-3xl p-5 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>

          <div className="relative flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-blue-500/30">
                {profile?.username?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#0a0e1a]"></div>
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
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${roleBadge.bg} border ${roleBadge.border}`}>
              <RoleIcon size={11} className={roleBadge.text} />
              <span className={`text-[10px] font-black ${roleBadge.text} uppercase tracking-wider`}>{roleBadge.label}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="glass rounded-2xl p-3 text-center">
            <Package size={16} className="text-blue-400 mx-auto mb-1.5" />
            <p className="text-lg font-black">{stats.products}</p>
            <p className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Produk</p>
          </div>
          <div className="glass rounded-2xl p-3 text-center">
            <ShoppingBag size={16} className="text-green-400 mx-auto mb-1.5" />
            <p className="text-lg font-black">{stats.orders}</p>
            <p className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Order</p>
          </div>
          <div className="glass rounded-2xl p-3 text-center">
            <MessageCircle size={16} className="text-cyan-400 mx-auto mb-1.5" />
            <p className="text-lg font-black">{stats.chats}</p>
            <p className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Chat</p>
          </div>
        </div>

        {/* Owner Panel */}
        {profile?.role === 'owner' && (
          <Link
            href="/owner"
            className="flex items-center justify-between w-full glass rounded-2xl p-4 border-yellow-500/20 bg-yellow-500/5 active:scale-[0.98] transition"
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
            <ChevronRight size={16} className="text-yellow-400" />
          </Link>
        )}

        {/* Jadi Seller */}
        {profile?.role === 'buyer' && (
          <Link
            href="/jadi-seller"
            className="flex items-center justify-between w-full glass rounded-2xl p-4 border-green-500/20 bg-green-500/5 active:scale-[0.98] transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Store size={18} className="text-green-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-green-400">Jadi Seller</p>
                <p className="text-[10px] text-gray-500">Rp 10.000 / bulan</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-green-400" />
          </Link>
        )}

        {/* Menu */}
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">Menu</p>
          <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
            <MenuItem href="/chat" icon={MessageCircle} iconColor="text-cyan-400" title="Chat Saya" subtitle="Lihat semua percakapan" />
            <MenuItem href="/transaksi" icon={ShoppingBag} iconColor="text-green-400" title="Transaksi" subtitle="Riwayat pembelian & penjualan" />
            <MenuItem href="/edit-profil" icon={Edit3} iconColor="text-purple-400" title="Edit Profil" subtitle="Ubah username & foto" />
          </div>
        </div>

        {/* Bantuan */}
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">Bantuan</p>
          <div className="glass rounded-2xl overflow-hidden divide-y divide-white/5">
            <MenuItem href="/faq" icon={HelpCircle} iconColor="text-blue-400" title="Pusat Bantuan" subtitle="FAQ & cara penggunaan" />
            <MenuItem href="/syarat" icon={FileText} iconColor="text-gray-400" title="Syarat & Ketentuan" subtitle="Aturan penggunaan web" />
            <MenuItem href="/privasi" icon={Shield} iconColor="text-gray-400" title="Kebijakan Privasi" subtitle="Perlindungan data Anda" />
          </div>
        </div>

        {/* Logout */}
        <div className="pt-4">
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-sm font-semibold active:scale-[0.98] transition"
          >
            <LogOut size={14} />
            Keluar dari Akun
          </button>
          <p className="text-center text-[10px] text-gray-600 mt-4">
            GenshinMarketGlobal v1.0
          </p>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/60 backdrop-blur-sm fade-in">
          <div className="w-full max-w-xs bg-[#141a2a] rounded-3xl p-6 border border-white/10 fade-in">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/15 border border-red-500/20 flex items-center justify-center mb-4">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            <h3 className="text-center font-bold text-lg mb-2">Keluar dari Akun?</h3>
            <p className="text-center text-xs text-gray-400 mb-6">
              Anda akan logout dari akun <span className="text-white font-semibold">{profile?.username}</span>. Yakin ingin keluar?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loggingOut}
                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 py-3 rounded-xl bg-red-500 text-sm font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loggingOut ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogOut size={14} />
                    Keluar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({ href, icon: Icon, iconColor, title, subtitle }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-4 active:bg-white/5 transition"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
          <Icon size={16} className={iconColor} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-[10px] text-gray-500">{subtitle}</p>
        </div>
      </div>
      <ChevronRight size={16} className="text-gray-600" />
    </Link>
  );
    }
