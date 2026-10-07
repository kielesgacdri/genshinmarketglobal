'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function JadiSeller() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleDaftar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('seller_subscriptions').insert({
      user_id: user.id,
      amount: 10000,
      status: 'pending',
    });

    if (error) {
      alert('Error: ' + error.message);
      setLoading(false);
      return;
    }

    setStep(2);
    setLoading(false);
  };

  const handleSudahBayar = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase
      .from('seller_subscriptions')
      .update({ status: 'paid' })
      .eq('user_id', user.id)
      .eq('status', 'pending');
    
    alert('Pembayaran dikonfirmasi. Tunggu ACC owner ya!');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-dark text-white p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4">🏪 Jadi Seller</h1>

        {step === 1 && (
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="text-5xl mb-4">🏪</div>
            <h2 className="text-lg font-bold mb-2">Daftar Jadi Seller</h2>
            <p className="text-sm text-gray-400 mb-4">
              Bayar Rp 10.000/bulan untuk bisa jualan di GenshinMarketGlobal
            </p>
            <button
              onClick={handleDaftar}
              disabled={loading}
              className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Lanjut Bayar Rp 10.000'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <h2 className="text-lg font-bold mb-2">💳 Pembayaran</h2>
            <p className="text-sm text-gray-400 mb-4">
              Scan QR di bawah buat bayar Rp 10.000
            </p>
            <div className="bg-white rounded-xl p-4 mb-4 inline-block">
              <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                [QR CODE]
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Transfer ke QRIS owner, terus klik tombol di bawah
            </p>
            <button
              onClick={handleSudahBayar}
              className="w-full bg-success hover:bg-green-600 text-white font-semibold py-3 rounded-lg"
            >
              ✅ Saya Sudah Bayar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
