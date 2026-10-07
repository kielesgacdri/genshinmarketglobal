'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import ProductGrid from '@/components/ProductGrid';
import { Search, Bell, Flame } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('Semua');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.log('ERROR:', error.message);
      setLoading(false);
      return;
    }

    // Ambil username seller buat tiap produk
    const withSellers = await Promise.all(
      (data || []).map(async (p) => {
        const { data: prof } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', p.seller_id)
          .maybeSingle();
        return { ...p, profiles: prof };
      })
    );

    setProducts(withSellers);
    setLoading(false);
  };

  const filtered = products.filter((p) => {
    const matchCat = category === 'Semua' || p.game === category;
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0e1a] pt-16 pb-24">
      <Navbar />

      <div className="px-4 pt-5 pb-4 flex gap-2">
        <div className="flex-1 glass rounded-2xl flex items-center px-4 py-3 gap-2.5">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Cari akun Genshin, FF, ML..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
          />
        </div>
        <button className="glass rounded-2xl px-3.5 relative">
          <Bell size={18} className="text-gray-400" />
        </button>
      </div>

      <div className="px-4 mb-5">
        <h1 className="text-[26px] font-black leading-none tracking-tight">
          GenshinMarket<span className="gradient-text">Global</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1.5">Marketplace akun game terpercaya</p>
      </div>

      <div className="px-4 mb-5 flex gap-2 overflow-x-auto pb-1">
        {['Semua', 'Genshin Impact', 'Free Fire', 'Mobile Legends'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
              category === cat
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'glass text-gray-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="px-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame size={14} className="text-orange-400" />
          <h2 className="text-sm font-bold text-white">Produk Terbaru</h2>
        </div>
        <span className="text-[10px] text-gray-500 font-semibold">
          {filtered.length} item
        </span>
      </div>

      <ProductGrid products={filtered} loading={loading} />
    </div>
  );
          }
