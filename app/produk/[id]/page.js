'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MessageCircle, ShoppingCart, Star, Shield, Package } from 'lucide-react';

export default function DetailProduk() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) load();
  }, [id]);

  const load = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      alert('Produk tidak ditemukan');
      router.push('/');
      return;
    }

    setProduct(data);

    const { data: prof } = await supabase
      .from('profiles')
      .select('username, role')
      .eq('id', data.seller_id)
      .maybeSingle();

    setSeller(prof);
    setLoading(false);
  };

  const handleChat = () => {
    alert('Fitur chat segera hadir!');
  };

  const handleBeli = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }
    alert('Fitur beli + rekber segera hadir!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const gameIcon = {
    'Genshin Impact': '⚔️',
    'Free Fire': '🔫',
    'Mobile Legends': '🛡️',
  }[product.game] || '🎮';

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white pb-32 fade-in">
      <header className="sticky top-0 z-40 glass-strong">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 glass rounded-xl">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-bold truncate flex-1">{product.title}</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        <div className="aspect-square bg-black/40 relative">
          {product.images?.[currentImg] ? (
            <img
              src={product.images[currentImg]}
              alt={product.title}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl opacity-20">
              {gameIcon}
            </div>
          )}

          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <span className="text-sm">{gameIcon}</span>
            <span className="text-xs font-bold">{product.game}</span>
          </div>

          {product.images?.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg">
              <span className="text-xs font-bold">{currentImg + 1}/{product.images.length}</span>
            </div>
          )}
        </div>

        {product.images?.length > 1 && (
          <div className="flex gap-2 p-3 overflow-x-auto">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImg(i)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 ${
                  currentImg === i ? 'border-blue-500' : 'border-white/10'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="p-4 space-y-4">
          <div>
            <p className="text-3xl font-black text-cyan-400">
              Rp {product.price?.toLocaleString('id-ID')}
            </p>
            <h2 className="text-lg font-bold mt-2">{product.title}</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.server && (
              <div className="px-3 py-1.5 rounded-lg glass text-xs font-semibold">
                🌏 {product.server}
              </div>
            )}
            {product.login_type && (
              <div className="px-3 py-1.5 rounded-lg glass text-xs font-semibold">
                🔑 {product.login_type}
              </div>
            )}
            {product.is_first_owner !== null && product.is_first_owner !== undefined && (
              <div className="px-3 py-1.5 rounded-lg glass text-xs font-semibold">
                {product.is_first_owner ? '✅ First Owner' : '❌ Bukan FO'}
              </div>
            )}
            <div className="px-3 py-1.5 rounded-lg glass text-xs font-semibold text-green-400">
              📦 Stok: {product.stock}
            </div>
          </div>

          <div className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-lg font-black">
              {seller?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">{seller?.username || 'Seller'}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] text-gray-400">Seller Terpercaya</span>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-4">
            <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
              <Package size={14} className="text-blue-400" />
              Deskripsi
            </h3>
            <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="glass rounded-2xl p-4 border-green-500/20 bg-green-500/5">
            <div className="flex items-center gap-2 mb-1">
              <Shield size={14} className="text-green-400" />
              <p className="text-xs font-bold text-green-400">GARANSI REKBER AMAN</p>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Transaksi dipandu oleh admin GenshinMarketGlobal. Dana ditahan sampai akun diterima dengan aman.
            </p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 glass-strong p-4">
        <div className="max-w-2xl mx-auto flex gap-2">
          <button
            onClick={handleChat}
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl glass font-semibold text-sm active:scale-95 transition"
          >
            <MessageCircle size={18} className="text-cyan-400" />
            <span>Chat</span>
          </button>
          <button
            onClick={handleBeli}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 font-black text-sm shadow-lg shadow-blue-500/30 active:scale-[0.98] transition"
          >
            <ShoppingCart size={18} />
            Beli Sekarang
          </button>
        </div>
      </div>
    </div>
  );
                }
