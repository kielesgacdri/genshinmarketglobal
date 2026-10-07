'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const uname = username.toLowerCase().trim();

      const { data: existing } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', uname)
        .maybeSingle();

      if (existing) {
        setError('Username sudah dipakai');
        setLoading(false);
        return;
      }

      const { error: authErr } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username: uname } },
      });

      if (authErr) {
        setError(authErr.message);
        setLoading(false);
        return;
      }

      alert('Registrasi berhasil! Silakan login.');
      window.location.href = '/login';
    } catch (err) {
      setError('Error: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1729] flex items-center justify-center p-5 relative overflow-hidden">
      <div className="absolute top-[-100px] right-[-100px] w-72 h-72 rounded-full bg-blue-600 opacity-20 blur-3xl"></div>
      <div className="absolute bottom-[-100px] left-[-100px] w-72 h-72 rounded-full bg-cyan-500 opacity-20 blur-3xl"></div>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-4">
            <span className="text-3xl font-black text-white">G</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            GenshinMarket<span className="text-cyan-400">Global</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Daftar akun gratis</p>
        </div>

        <div className="bg-white rounded-[2rem] p-7 shadow-2xl">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Daftar</h2>
          <p className="text-xs text-gray-400 mb-6">Isi data di bawah untuk buat akun</p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-xs p-3 rounded-xl mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={18} />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition outline-none"
                required
                minLength={3}
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition outline-none"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password (min 6)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-12 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition outline-none"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 rounded-2xl transition shadow-lg shadow-blue-500/20 disabled:opacity-50 mt-2"
            >
              {loading ? 'Memproses...' : 'Daftar Sekarang'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-blue-600 font-semibold">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
                  }
