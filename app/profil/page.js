'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ProfilPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    setProfile(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return <div className="min-h-screen bg-dark flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-bold mb-4">👤 Profil</h1>

        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold">
              {profile?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="font-bold">{profile?.username}</p>
              <p className="text-sm text-gray-400">{profile?.email}</p>
              <span className="inline-block mt-1 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                {profile?.role}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-danger hover:bg-red-600 text-white font-semibold py-3 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
