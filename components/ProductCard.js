'use client';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const gameIcon = {
    'Genshin Impact': '⚔️',
    'Free Fire': '🔫',
    'Mobile Legends': '🛡️',
  }[product.game] || '🎮';

  return (
    <Link href={`/produk/${product.id}`} className="block card-press fade-in">
      <div className="glass rounded-2xl overflow-hidden">
        <div className="aspect-[4/3] bg-white/[0.02] relative">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">
              {gameIcon}
            </div>
          )}

          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
            <span className="text-[10px]">{gameIcon}</span>
            <span className="text-[10px] font-bold text-white">
              {product.game?.split(' ')[0]}
            </span>
          </div>

          {product.server && (
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md">
              <span className="text-[9px] font-semibold text-cyan-400">
                {product.server}
              </span>
            </div>
          )}

          {product.stock <= 3 && product.stock > 0 && (
            <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-orange-500 px-2 py-0.5 rounded-md">
              <span className="text-[9px] font-bold text-white">SISA {product.stock}</span>
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className="text-xs font-bold leading-snug line-clamp-2 mb-2 min-h-[32px] text-white">
            {product.title}
          </h3>

          <p className="text-cyan-400 font-black text-sm mb-2.5">
            Rp {product.price?.toLocaleString('id-ID')}
          </p>

          <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-[8px] font-black text-white">
              {product.profiles?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <span className="text-[10px] text-gray-500 truncate font-medium">
              {product.profiles?.username || 'Seller'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
