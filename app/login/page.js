'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profile?.role === 'owner') {
      router.push('/owner');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="auth-bg flex items-center justify-center p-6">
      <div className="auth-card w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1e3a8a] flex items-center justify-center text-2xl mb-4">
            🌏
          </div>
          <h1 className="text-xl font-bold text-gray-900">Selamat Datang</h1>
          <p className="text-xs text-gray-500 mt-1">Masuk untuk lanjut</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3">
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
          />

          <div className="text-right pt-1">
            <Link href="/lupa-password" className="text-xs text-[#1e3a8a] font-medium">
              Lupa password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-btn mt-2"
          >
            {loading ? 'Memuat...' : 'Masuk'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-6">
          Belum punya akun?{' '}
          <Link href="/register" className="text-[#1e3a8a] font-semibold">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
              }
