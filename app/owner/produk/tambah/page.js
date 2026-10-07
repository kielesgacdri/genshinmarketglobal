'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function TambahProduk() {
  const [game, setGame] = useState('Genshin Impact');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [server, setServer] = useState('Asia');
  const [loginType, setLoginType] = useState('');
  const [isFirstOwner, setIsFirstOwner] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Harus login dulu');
      return;
    }

    const { error } = await supabase.from('products').insert({
      seller_id: user.id,
      game,
      title,
      description,
      price: parseInt(price),
      server: game === 'Genshin Impact' ? server : null,
      login_type: loginType,
      is_first_owner: game === 'Mobile Legends' ? isFirstOwner : null,
      images: [],
      stock: 1,
      status: 'active',
    });

    if (error) {
      alert('Error: ' + error.message);
      setLoading(false);
      return;
    }

    alert('Produk berhasil ditambahkan!');
    router.push('/owner');
  };

  return (
    <div className="min-h-screen bg-dark text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-bold mb-4">➕ Tambah Produk</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Pilih Game</label>
            <select
              value={game}
              onChange={(e) => setGame(e.target.value)}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-white"
            >
              <option value="Genshin Impact">Genshin Impact</option>
              <option value="Free Fire">Free Fire</option>
              <option value="Mobile Legends">Mobile Legends</option>
            </select>
          </div>

          {game === 'Genshin Impact' && (
            <div>
              <label className="text-sm text-gray-400 block mb-1">Server</label>
              <select
                value={server}
                onChange={(e) => setServer(e.target.value)}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-white"
              >
                <option value="Asia">Asia</option>
                <option value="America">America</option>
                <option value="Europe">Europe</option>
                <option value="TW/HK/MO">TW/HK/MO</option>
              </select>
            </div>
          )}

          <div>
            <label className="text-sm text-gray-400 block mb-1">Nama Akun</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-white"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-1">Deskripsi</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-white"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-1">Harga (Rp)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-white"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 block mb-1">Login Via</label>
            <input
              type="text"
              value={loginType}
              onChange={(e) => setLoginType(e.target.value)}
              placeholder="Email, Google, Facebook, dll"
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-white"
              required
            />
          </div>

          {game === 'Mobile Legends' && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isFirstOwner}
                onChange={(e) => setIsFirstOwner(e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-400">First Owner</label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Simpan Produk'}
          </button>
        </form>
      </div>
    </div>
  );
            }
