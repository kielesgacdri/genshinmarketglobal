'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Home, MessageCircle, ShoppingBag, User, Crown, LogIn } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

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

  const guard = (e, path) => {
    if (!user) {
      e.preventDefault();
      router.push('/login');
    }
  };

  const tabs = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/chat', icon: MessageCircle, label: 'Chat' },
    { href: '/transaksi', icon: ShoppingBag, label: 'Order' },
    { href: user ? '/profil' : '/login', icon: User, label: user ? 'Profil' : 'Masuk' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/30">
              G
            </div>
            <div>
              <p className="font-extrabold text-sm text-white leading-none">GenshinMarket</p>
              <p className="text-[9px] text-cyan-400 font-semibold tracking-wider">GLOBAL</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {profile?.role === 'owner' && (
              <Link
                href="/owner"
                className="text-[11px] font-bold px-3 py-2 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1.5"
              >
                <Crown size={12} />
                PANEL
              </Link>
            )}
            {!user && (
              <Link
                href="/login"
                className="text-[11px] font-bold px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center gap-1.5 shadow-lg shadow-blue-500/30"
              >
                <LogIn size={12} />
                Masuk
              </Link>
            )}
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-2xl mx-auto grid grid-cols-4">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                onClick={(e) => t.href !== '/' && t.href !== '/login' ? guard(e, t.href) : null}
                className="flex flex-col items-center py-3 gap-1 relative"
              >
                <Icon
                  size={20}
                  className={active ? 'text-blue-400' : 'text-gray-600'}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span className={`text-[10px] font-semibold ${active ? 'text-blue-400' : 'text-gray-600'}`}>
                  {t.label}
                </span>
                {active && (
                  <div className="absolute top-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
    }
