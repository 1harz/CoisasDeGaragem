import { useCallback } from 'react';
import { useProductsStore } from '@/store/productsStore';
import { api } from '@/services/api';

export function useProducts() {
  const {
    products,
    selectedProduct,
    filters,
    setProducts,
    setSelectedProduct,
    setFilters,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProductsStore();

  const fetchProducts = useCallback(
    async (newFilters?: typeof filters) => {
      const result = await api.getProducts(newFilters || filters);

      if (result.success) {
        setProducts(result.data.products);
      } else {
        throw new Error(result.error.message);
      }
    },
    [filters, setProducts],
  );

  const fetchProduct = useCallback(
    async (id: string) => {
      const result = await api.getProduct(id);

      if (result.success) {
        setSelectedProduct(result.data);
      } else {
        throw new Error(result.error.message);
      }
    },
    [setSelectedProduct],
  );

  const createProduct = useCallback(
    async (data: {
      name: string;
      description: string;
      price: number;
      currency: string;
      imageUrl?: string;
      category?: string;
      condition?: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
    }) => {
      const result = await api.createProduct(data);

      if (result.success) {
        addProduct(result.data);
        return result.data;
      } else {
        throw new Error(result.error.message);
      }
    },
    [addProduct],
  );

  const editProduct = useCallback(
    async (id: string, updates: Partial<typeof products[0]>) => {
      const result = await api.updateProduct(id, updates);

      if (result.success) {
        updateProduct(id, result.data);
        return result.data;
      } else {
        throw new Error(result.error.message);
      }
    },
    [updateProduct],
  );

  const removeProduct = useCallback(
    async (id: string) => {
      const result = await api.deleteProduct(id);

      if (result.success) {
        deleteProduct(id);
      } else {
        throw new Error(result.error.message);
      }
    },
    [deleteProduct],
  );

  return {
    products,
    selectedProduct,
    filters,
    fetchProducts,
    fetchProduct,
    createProduct,
    editProduct,
    removeProduct,
    setFilters,
    setSelectedProduct,
  };
}
