'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import ProductGrid from '@/components/ProductGrid';
import { Search, Bell } from 'lucide-react';

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
    const { data } = await supabase
      .from('products')
      .select('*, profiles:seller_id(username)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  const filtered = products.filter((p) => {
    const matchCat = category === 'Semua' || p.game === category;
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0f1729] pt-16 pb-24">
      <Navbar />

      <div className="px-4 pt-4 pb-3 flex gap-2">
        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl flex items-center px-3 py-2.5 gap-2">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="Cari akun..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
          />
        </div>
        <button className="bg-white/5 border border-white/10 rounded-xl px-3">
          <Bell size={18} className="text-gray-500" />
        </button>
      </div>

      <div className="px-4 mb-4">
        <h1 className="text-2xl font-extrabold text-white leading-tight">
          GenshinMarket<span className="text-cyan-400">Global</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">Marketplace akun game terpercaya</p>
      </div>

      <div className="px-4 mb-4 flex gap-2 overflow-x-auto pb-1">
        {['Semua', 'Genshin Impact', 'Free Fire', 'Mobile Legends'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              category === cat
                ? 'bg-blue-600 text-white'
                : 'bg-white/5 border border-white/10 text-gray-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="px-4 mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-white">Produk Terbaru</h2>
        <span className="text-[10px] text-gray-500">{filtered.length} item</span>
      </div>

      <ProductGrid products={filtered} loading={loading} />
    </div>
  );
}
