'use client';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const gameIcon = {
    'Genshin Impact': '⚔️',
    'Free Fire': '🔫',
    'Mobile Legends': '🛡️',
  }[product.game] || '🎮';

  return (
    <Link href={`/produk/${product.id}`} className="block active:scale-[0.97] transition">
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="aspect-[4/3] bg-white/[0.03] relative">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">
              {gameIcon}
            </div>
          )}
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
            <span className="text-[10px]">{gameIcon}</span>
            <span className="text-[10px] font-semibold text-white">{product.game}</span>
          </div>
          {product.server && (
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded-md">
              <span className="text-[9px] font-medium text-gray-300">{product.server}</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="text-xs font-semibold leading-snug line-clamp-2 mb-2 min-h-[32px] text-white">
            {product.title}
          </h3>
          <p className="text-blue-400 font-bold text-sm mb-2">
            Rp {product.price?.toLocaleString('id-ID')}
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-[8px] font-bold text-white">
              {product.profiles?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <span className="text-[10px] text-gray-500 truncate">
              {product.profiles?.username || 'Seller'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
