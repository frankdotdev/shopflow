import { useEffect, useState, useCallback } from "react";
import { Product, Filters, SortOption } from "@/types";
import { fetchAllProducts } from "@/database/repositories";

let cache: Product[] | null = null;

export function useAllProducts() {
  const [products, setProducts] = useState<Product[]>(cache ?? []);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    let mounted = true;
    if (cache) {
      setProducts(cache);
      setLoading(false);
      return;
    }
    fetchAllProducts().then((p) => {
      cache = p;
      if (mounted) {
        setProducts(p);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    const p = await fetchAllProducts();
    cache = p;
    setProducts(p);
  }, []);

  return { products, loading, refresh };
}

export function applyFilters(products: Product[], filters: Filters, categoryId?: string): Product[] {
  return products.filter((p) => {
    if (categoryId && p.category !== categoryId) return false;
    if (filters.categories.length && !filters.categories.includes(p.category)) return false;
    if (p.price < filters.priceMin || p.price > filters.priceMax) return false;
    if (p.rating < filters.minRating) return false;
    if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
    if (filters.sizes.length && !p.sizes.some((s) => filters.sizes.includes(s))) return false;
    if (filters.colors.length && !p.colors.some((c) => filters.colors.includes(c))) return false;
    if (filters.inStockOnly && p.stock <= 0) return false;
    if (filters.discountedOnly && !p.discount) return false;
    return true;
  });
}

export function applySort(products: Product[], sort: SortOption): Product[] {
  const arr = [...products];
  switch (sort) {
    case "newest":
      return arr.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    case "price_asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price_desc":
      return arr.sort((a, b) => b.price - a.price);
    case "rating":
      return arr.sort((a, b) => b.rating - a.rating);
    case "popular":
      return arr.sort((a, b) => Number(b.isPopular) - Number(a.isPopular) || b.reviewCount - a.reviewCount);
    default:
      return arr;
  }
}
