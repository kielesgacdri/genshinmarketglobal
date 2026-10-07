'use client';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 p-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-card rounded-xl h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p>Belum ada produk</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
