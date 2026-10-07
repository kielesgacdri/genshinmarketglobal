'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import ProductGrid from '@/components/ProductGrid';
import Link from 'next/link';
import { Search, SlidersHorizontal, Bell } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Semua');
  const [search, setSearch] = useState('');

  const categories = ['Semua', 'Akun', 'Top Up', 'Item'];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*, profiles:seller_id(username)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    setProducts(data || []);
    setLoading(false);
  };

  const filtered = products.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg pt-16 pb-24">
      <Navbar />

      {/* Search + Notif */}
      <div className="px-4 pt-4 pb-3 flex gap-2">
        <div className="flex-1 bg-card border border-border rounded-xl flex items-center px-3 py-2.5 gap-2">
          <Search size={16} className="text-muted" />
          <input
            type="text"
            placeholder="Cari akun..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm placeholder:text-muted"
          />
        </div>
        <button className="bg-card border border-border rounded-xl px-3 relative">
          <Bell size={18} className="text-muted" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-danger"></span>
        </button>
      </div>

      {/* Hero */}
      <div className="px-4 mb-4">
        <h1 className="text-2xl font-extrabold gradient-text leading-tight">
          GenshinMarketGlobal
        </h1>
        <p className="text-xs text-muted mt-0.5">Marketplace akun game terpercaya</p>
      </div>

      {/* Categories */}
      <div className="px-4 mb-4 flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              category === cat
                ? 'bg-primary text-white shadow-glow'
                : 'bg-card border border-border text-muted'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Banner */}
      <div className="px-4 mb-5">
        <Link
          href="/jadi-seller"
          className="relative block overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-accent p-4"
        >
          <div className="relative z-10">
            <p className="text-[10px] font-medium text-white/80 uppercase tracking-wider">
              Mau jualan juga?
            </p>
            <p className="text-sm font-bold text-white mt-0.5">
              Posting produk sekarang →
            </p>
          </div>
          <div className="absolute -right-2 -bottom-4 text-7xl opacity-20">🏪</div>
        </Link>
      </div>

      {/* Section Title */}
      <div className="px-4 mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold">Produk Terbaru</h2>
        <span className="text-[10px] text-muted">{filtered.length} item</span>
      </div>

      <ProductGrid products={filtered} loading={loading} />
    </div>
  );
              }
