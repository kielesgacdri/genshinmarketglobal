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
      <div className="text-center py-20 px-4">
        <div className="text-5xl mb-3 opacity-20">📦</div>
        <p className="text-sm text-muted-2 font-medium">Belum ada produk</p>
        <p className="text-xs text-muted mt-1">Produk akan muncul di sini</p>
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
