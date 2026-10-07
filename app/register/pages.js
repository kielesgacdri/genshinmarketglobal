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

    const { data, error: err } = await supabase.auth.signUp({
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
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl p-6 border border-border">
        <h1 className="text-2xl font-bold text-center mb-6">
          🌏 Daftar
        </h1>

        {error && (
          <div className="bg-danger/20 border border-danger text-danger text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-dark border border-border rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark border border-border rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark border border-border rounded-lg px-4 py-3 text-white focus:border-primary outline-none"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Daftar'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Udah punya akun?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
