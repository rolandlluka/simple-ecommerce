import { Head, Link, router, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppLayout } from '@/layouts/app-layout';
import { Heading } from '@/components/heading';
import cartRoutes from '@/routes/cart';
import productsRoutes from '@/routes/products';

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stock_quantity: number;
}

interface PaginatedProducts {
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface Props {
  products: PaginatedProducts;
}

export default function ProductsIndex({ products }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const { data, setData, post, processing, reset } = useForm({
    product_id: 0,
    quantity: 1,
  });

  const handleAddToCart = (productId: number) => {
    setData({
      product_id: productId,
      quantity: 1,
    });
    
    router.post(
      cartRoutes.store.url(),
      {
        product_id: productId,
        quantity: 1,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setSelectedProduct(null);
        },
      }
    );
  };

  return (
    <AppLayout>
      <Head title="Products" />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <Heading>Browse Products</Heading>
          <Link href={cartRoutes.index.url()}>
            <Button variant="outline">View Cart</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.data.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-2">{product.name}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {product.description || 'No description available'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">
                    ${product.price}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {product.stock_quantity > 0 ? (
                      <span className="text-green-600">
                        {product.stock_quantity} in stock
                      </span>
                    ) : (
                      <span className="text-red-600">Out of stock</span>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={product.stock_quantity === 0 || processing}
                >
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {products.data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products available at the moment.</p>
          </div>
        )}

        {products.last_page > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: products.last_page }, (_, i) => i + 1).map(
              (page) => (
                <Link
                  key={page}
                  href={productsRoutes.index.url({ query: { page } })}
                  preserveScroll
                >
                  <Button
                    variant={page === products.current_page ? 'default' : 'outline'}
                    size="sm"
                  >
                    {page}
                  </Button>
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

