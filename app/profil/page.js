'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { LogOut, Crown } from 'lucide-react';
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
      <div className="min-h-screen bg-[#0f1729] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1729] text-white p-5">
      <div className="max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-6">👤 Profil</h1>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-2xl font-bold text-white">
              {profile?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg">{profile?.username}</p>
              <p className="text-xs text-gray-500">{profile?.email}</p>
              <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/30">
                {profile?.role === 'owner' && <Crown size={10} className="text-yellow-400" />}
                <span className="text-[10px] font-semibold text-blue-400 uppercase">{profile?.role}</span>
              </div>
            </div>
          </div>
        </div>

        {profile?.role === 'owner' && (
          <Link href="/owner" className="block w-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-semibold py-4 rounded-2xl text-center mb-3">
            👑 Buka Owner Panel
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="w-full bg-red-500/10 border border-red-500/30 text-red-400 font-semibold py-4 rounded-2xl flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </div>
  );
              }
