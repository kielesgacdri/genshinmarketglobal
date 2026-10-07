'use client';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 px-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl h-56 skeleton" />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 px-4 fade-in">
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl glass flex items-center justify-center">
          <span className="text-4xl opacity-40">📦</span>
        </div>
        <p className="text-sm font-bold text-gray-400">Belum ada produk</p>
        <p className="text-xs text-gray-600 mt-1">Produk akan muncul di sini</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
