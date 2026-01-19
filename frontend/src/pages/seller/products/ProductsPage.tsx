import { SellerLayout } from '@/components/seller/SellerLayout';
import { ProductCard } from '@/components/seller/ProductCard';
import { ProductForm } from '@/components/seller/ProductForm';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { QRCodeDisplay } from '@/components/seller/QRCodeDisplay';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Pagination } from '@/components/common/Pagination';
import { useProducts } from '@/hooks/useProducts';
import { api } from '@/services/api';
import { useProductsStore } from '@/store/productsStore';
import { useState, useEffect } from 'react';
import type { Product, CreateProductRequest, UpdateProductRequest } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBox, faBoxOpen } from '@fortawesome/free-solid-svg-icons';

export default function ProductsPage() {
  const { products, fetchProducts } = useProducts();
  const { addProduct, updateProduct, deleteProduct } = useProductsStore();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [qrProduct, setQrProduct] = useState<Product | null>(null);
  const [formError, setFormError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const pageSize = 9;

  // Filter products based on search term
  const filteredProducts = (products || []).filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let comparison = 0;

    if (sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === 'price') {
      comparison = a.price - b.price;
    } else if (sortBy === 'date') {
      comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Paginate sorted products
  const totalPages = Math.ceil(sortedProducts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + pageSize);

  // Reset to page 1 when search term or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder]);

  // Load products on mount
  useState(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError('');
      try {
        await fetchProducts();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  });

  const handleCreate = () => {
    setEditingProduct(undefined);
    setShowForm(true);
    setFormError('');
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
    setFormError('');
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const result = await api.deleteProduct(productId);
        if (result.success) {
          deleteProduct(productId);
        } else {
          alert(result.error?.message || 'Erro ao excluir produto');
        }
      } catch (err) {
        alert('Erro ao excluir produto');
      }
    }
  };

  const handleGenerateQR = async (product: Product) => {
    try {
      const result = await api.getQRCode(product.id);
      if (result.success) {
        setQrProduct(product);
      } else {
        alert(result.error?.message || 'Erro ao gerar QR code');
      }
    } catch (err) {
      alert('Erro ao gerar QR code');
    }
  };

  const handleSubmit = async (data: CreateProductRequest | UpdateProductRequest) => {
    setIsSubmitting(true);
    setFormError('');
    try {
      if (editingProduct) {
        const result = await api.updateProduct(editingProduct.id, data as UpdateProductRequest);
        if (result.success) {
          updateProduct(editingProduct.id, result.data);
          setShowForm(false);
        } else {
          setFormError(result.error?.message || 'Erro ao atualizar produto');
        }
      } else {
        const result = await api.createProduct(data as CreateProductRequest);
        if (result.success) {
          addProduct(result.data);
          setShowForm(false);
        } else {
          setFormError(result.error?.message || 'Erro ao criar produto');
        }
      }
    } catch (err) {
      setFormError('Erro ao salvar produto');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showForm) {
    return (
      <SellerLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button variant="tertiary" onClick={() => setShowForm(false)}>
              ← Voltar para Lista
            </Button>
          </div>
          {formError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{formError}</p>
            </div>
          )}
          <div className="bg-white rounded-lg shadow p-6">
            <ProductForm
              product={editingProduct}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </SellerLayout>
    );
  }

  if (isLoading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Carregando produtos...</p>
          </div>
        </div>
      </SellerLayout>
    );
  }

  if (error) {
    return (
      <SellerLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-900 mb-2">Erro ao carregar produtos</h2>
            <p className="text-red-700">{error}</p>
            <Button variant="primary" onClick={() => fetchProducts()} className="mt-4">
              Tentar novamente
            </Button>
          </div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Meus Produtos
            </h1>
            <p className="text-gray-600">
              Gerencie seus produtos cadastrados para venda na garagem
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              type="search"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="min-w-[200px]"
            />
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'date')}
              className="min-w-[150px]"
              options={[
                { value: 'name', label: 'Nome' },
                { value: 'price', label: 'Preço' },
                { value: 'date', label: 'Data' },
              ]}
            />
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="min-w-[120px]"
              options={[
                { value: 'asc', label: 'A-Z' },
                { value: 'desc', label: 'Z-A' },
              ]}
            />
            <Button variant="primary" onClick={handleCreate}>
              <FontAwesomeIcon icon={faPlus} className="w-5 h-5 mr-2" />
              Novo Produto
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onGenerateQR={handleGenerateQR}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              totalItems={filteredProducts.length}
            />
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && products.length > 0 && (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faBox} className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600">
              Tente buscar com outros termos
            </p>
          </div>
        )}

        {/* Empty State - No Products */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faBoxOpen} className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum produto cadastrado
            </h3>
            <p className="text-gray-600 mb-6">
              Comece adicionando seus produtos para vender na sua garagem
            </p>
            <Button variant="primary" onClick={handleCreate}>
              Adicionar Primeiro Produto
            </Button>
          </div>
        )}

        {/* QR Code Modal */}
        {qrProduct && (
          <Modal
            isOpen={!!qrProduct}
            onClose={() => setQrProduct(null)}
            title="QR Code do Produto"
          >
            <QRCodeDisplay product={qrProduct} />
          </Modal>
        )}
      </div>
    </SellerLayout>
  );
}
