'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';

export default function DetailProduk() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  const loadProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, profiles:seller_id(username, avatar_url)')
      .eq('id', id)
      .single();

    if (error) {
      alert('Produk tidak ditemukan');
      router.push('/');
      return;
    }
    setProduct(data);
    setLoading(false);
  };

  const handleBeli = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Harus login dulu');
      router.push('/login');
      return;
    }

    // Bikin chat room otomatis
    const { data: room, error } = await supabase
      .from('chat_rooms')
      .insert({
        product_id: product.id,
        buyer_id: user.id,
        seller_id: product.seller_id,
        owner_id: product.seller_id,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      alert('Error: ' + error.message);
      return;
    }

    router.push('/chat');
  };

  if (loading) {
    return <div className="min-h-screen bg-dark flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark text-white pb-24">
      <div className="bg-card aspect-video">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            No Image
          </div>
        )}
      </div>

      <div className="p-4">
        <h1 className="text-xl font-bold mb-2">{product.title}</h1>
        <p className="text-2xl font-bold text-primary mb-4">
          Rp {product.price?.toLocaleString('id-ID')}
        </p>

        <div className="bg-card border border-border rounded-xl p-3 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold">
            {product.profiles?.username?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-semibold text-sm">{product.profiles?.username || 'Seller'}</p>
            <p className="text-xs text-gray-400">Seller</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <h2 className="font-semibold mb-2">Deskripsi</h2>
          <p className="text-sm text-gray-300 whitespace-pre-wrap">{product.description}</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h2 className="font-semibold mb-2">Detail</h2>
          <div className="text-sm space-y-1 text-gray-300">
            <p>Game: {product.game}</p>
            {product.server && <p>Server: {product.server}</p>}
            {product.login_type && <p>Login: {product.login_type}</p>}
            {product.is_first_owner !== null && <p>First Owner: {product.is_first_owner ? 'Ya' : 'Tidak'}</p>}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-dark border-t border-border p-4">
        <button
          onClick={handleBeli}
          className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 rounded-lg"
        >
          🛒 Beli (Rekber)
        </button>
      </div>
    </div>
  );
}
