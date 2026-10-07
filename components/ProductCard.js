'use client';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const gameIcon = {
    'Genshin Impact': '⚔️',
    'Free Fire': '🔫',
    'Mobile Legends': '🛡️',
  }[product.game] || '🎮';

  return (
    <Link href={`/produk/${product.id}`} className="block card-press fade-up">
      <div className="bg-card rounded-2xl overflow-hidden border border-border">
        <div className="aspect-[4/3] bg-card-hi relative">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">
              {gameIcon}
            </div>
          )}

          <div className="absolute top-2 left-2 glass px-2 py-1 rounded-lg flex items-center gap-1">
            <span className="text-[10px]">{gameIcon}</span>
            <span className="text-[10px] font-semibold">{product.game}</span>
          </div>

          {product.server && (
            <div className="absolute bottom-2 left-2 glass px-2 py-0.5 rounded-md">
              <span className="text-[9px] font-medium text-muted-2">{product.server}</span>
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className="text-xs font-semibold leading-snug line-clamp-2 mb-2 min-h-[32px]">
            {product.title}
          </h3>

          <p className="text-primary font-bold text-sm mb-2">
            Rp {product.price?.toLocaleString('id-ID')}
          </p>

          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[8px] font-bold">
              {product.profiles?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <span className="text-[10px] text-muted truncate">
              {product.profiles?.username || 'Seller'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
          }
