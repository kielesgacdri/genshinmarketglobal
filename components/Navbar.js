'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Home, MessageCircle, ShoppingBag, User } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-sm">
              G
            </div>
            <span className="font-bold text-sm">GenshinMarket</span>
          </Link>
          <Link
            href={user ? '/profil' : '/login'}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/20 text-primary border border-primary/30"
          >
            {user ? 'Profil' : 'Masuk'}
          </Link>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border">
        <div className="max-w-2xl mx-auto grid grid-cols-4">
          <Link href="/" className="flex flex-col items-center py-3 gap-1 text-primary">
            <Home size={20} />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link href="/chat" className="flex flex-col items-center py-3 gap-1 text-muted">
            <MessageCircle size={20} />
            <span className="text-[10px] font-medium">Chat</span>
          </Link>
          <Link href="/transaksi" className="flex flex-col items-center py-3 gap-1 text-muted">
            <ShoppingBag size={20} />
            <span className="text-[10px] font-medium">Transaksi</span>
          </Link>
          <Link href={user ? '/profil' : '/login'} className="flex flex-col items-center py-3 gap-1 text-muted">
            <User size={20} />
            <span className="text-[10px] font-medium">Profil</span>
          </Link>
        </div>
      </nav>
    </>
  );
            }
