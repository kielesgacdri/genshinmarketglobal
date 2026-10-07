'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    alert('Registrasi berhasil! Silakan login.');
    router.push('/login');
  };

  return (
    <div className="auth-bg flex items-center justify-center p-6">
      <div className="auth-card w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1e3a8a] flex items-center justify-center text-2xl mb-4">
            ✨
          </div>
          <h1 className="text-xl font-bold text-gray-900">Buat Akun</h1>
          <p className="text-xs text-gray-500 mt-1">Gratis, hanya butuh 30 detik</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="auth-input"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />
          <input
            type="password"
            placeholder="Password (min. 6 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
            minLength={6}
          />

          <button
            type="submit"
            disabled={loading}
            className="auth-btn mt-4"
          >
            {loading ? 'Memuat...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-[#1e3a8a] font-semibold">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
