'use client';
import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <Link href={`/produk/${product.id}`}>
      <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition">
        <div className="aspect-video bg-gray-800 relative">
          {product.images?.[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              No Image
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2">
            {product.title}
          </h3>
          <p className="text-primary font-bold">
            Rp {product.price?.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {product.game} • {product.server || '-'}
          </p>
        </div>
      </div>
    </Link>
  );
}
