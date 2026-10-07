'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data } = await supabase
      .from('chat_rooms')
      .select('*, products(title, price)')
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id},owner_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    setRooms(data || []);
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-dark flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-bold mb-4">💬 Chat</h1>

        {rooms.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p>Belum ada chat</p>
          </div>
        ) : (
          <div className="space-y-2">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-card border border-border rounded-xl p-3 hover:border-primary cursor-pointer"
              >
                <p className="font-semibold text-sm">{room.products?.title || 'Produk'}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Status: {room.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
