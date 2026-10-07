'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';

export default function TambahProduk() {
  const router = useRouter();
  const [game, setGame] = useState('Genshin Impact');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState(1);
  const [server, setServer] = useState('Asia');
  const [serverCustom, setServerCustom] = useState('');
  const [loginType, setLoginType] = useState('');
  const [isFirstOwner, setIsFirstOwner] = useState(false);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      alert('Maksimal 5 foto');
      return;
    }

    setUploading(true);
    const uploaded = [];

    for (const file of files) {
      const ext = file.name.split('.').pop();
      const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from('products')
        .upload(filename, file);

      if (upErr) {
        alert('Upload error: ' + upErr.message);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from('products')
        .getPublicUrl(filename);

      uploaded.push(urlData.publicUrl);
    }

    setImages([...images, ...uploaded]);
    setUploading(false);
  };

  const removeImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (images.length < 3) {
      setError('Minimal upload 3 foto');
      return;
    }

    if (game === 'Free Fire' && description.length < 200) {
      setError('Keterangan Free Fire minimal 200 kata');
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Harus login');
      setLoading(false);
      return;
    }

    const finalServer = game === 'Genshin Impact'
      ? (server === 'Lainnya' ? serverCustom : server)
      : null;

    const { error: insErr } = await supabase.from('products').insert({
      seller_id: user.id,
      game,
      title,
      description,
      price: parseInt(price),
      stock: parseInt(stock),
      server: finalServer,
      login_type: loginType,
      is_first_owner: game === 'Mobile Legends' ? isFirstOwner : null,
      images: images,
      status: 'active',
    });

    if (insErr) {
      setError(insErr.message);
      setLoading(false);
      return;
    }

    alert('Produk berhasil ditambahkan!');
    router.push('/owner');
  };

  return (
    <div className="min-h-screen bg-[#0f1729] text-white pb-24">
      <header className="sticky top-0 z-40 bg-[#0f1729]/95 backdrop-blur border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/owner" className="p-2 hover:bg-white/5 rounded-lg">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="font-bold">Tambah Produk</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl">
            {error}
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-gray-400 block mb-2">Pilih Game</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { name: 'Genshin Impact', icon: '⚔️' },
              { name: 'Free Fire', icon: '🔫' },
              { name: 'Mobile Legends', icon: '🛡️' },
            ].map((g) => (
              <button
                key={g.name}
                type="button"
                onClick={() => setGame(g.name)}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition ${
                  game === g.name
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                <span className="text-xl">{g.icon}</span>
                {g.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {game === 'Genshin Impact' && (
          <div>
            <label className="text-xs font-semibold text-gray-400 block mb-2">Server</label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {['Asia', 'America', 'Europe', 'TW/HK/MO'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setServer(s)}
                  className={`py-2.5 rounded-xl border text-xs font-semibold ${
                    server === s
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setServer('Lainnya')}
              className={`w-full py-2.5 rounded-xl border text-xs font-semibold mb-2 ${
                server === 'Lainnya'
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-white/5 border-white/10 text-gray-400'
              }`}
            >
              Lainnya (isi manual)
            </button>
            {server === 'Lainnya' && (
              <input
                type="text"
                placeholder="Tulis server..."
                value={serverCustom}
                onChange={(e) => setServerCustom(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
              />
            )}
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-gray-400 block mb-2">Nama Akun</label>
          <input
            type="text"
            placeholder="Contoh: Starter Vesna AR5"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 block mb-2">
            Deskripsi Akun {game === 'Free Fire' && <span className="text-red-400">(min. 200 kata)</span>}
          </label>
          <textarea
            placeholder="Jelaskan detail akun..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-blue-500 resize-none"
            required
          />
          {game === 'Free Fire' && (
            <p className="text-[10px] text-gray-500 mt-1">{description.length} karakter</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-400 block mb-2">Harga (Rp)</label>
            <input
              type="number"
              placeholder="60000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 block mb-2">Stok</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min={1}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 block mb-2">Login Via</label>
          <input
            type="text"
            placeholder="Contoh: Email, Google, Facebook"
            value={loginType}
            onChange={(e) => setLoginType(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:border-blue-500"
            required
          />
        </div>

        {game === 'Mobile Legends' && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isFirstOwner}
              onChange={(e) => setIsFirstOwner(e.target.checked)}
              className="w-5 h-5 rounded"
              id="firstowner"
            />
            <label htmlFor="firstowner" className="text-sm text-gray-300">First Owner?</label>
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-gray-400 block mb-2">
            Foto Produk <span className="text-red-400">(min. 3, max. 5)</span>
          </label>

          <div className="grid grid-cols-3 gap-2 mb-2">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 p-1 bg-red-500 rounded-full"
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {images.length < 5 && (
              <label className="aspect-square rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition">
                <Upload size={20} className="text-gray-500 mb-1" />
                <span className="text-[10px] text-gray-500">
                  {uploading ? 'Uploading...' : 'Tambah'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>
          <p className="text-[10px] text-gray-500">{images.length} / 5 foto</p>
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-blue-500/20 disabled:opacity-50"
        >
          {loading ? 'Menyimpan...' : 'Simpan Produk'}
        </button>
      </form>
    </div>
  );
      }
