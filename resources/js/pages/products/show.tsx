import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/layouts/app-layout';
import { Heading } from '@/components/heading';
import productsRoutes from '@/routes/products';
import cartRoutes from '@/routes/cart';
import { router } from '@inertiajs/react';

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stock_quantity: number;
}

interface Props {
  product: Product;
}

export default function ProductShow({ product }: Props) {
  const handleAddToCart = () => {
    router.post(
      cartRoutes.store.url(),
      {
        product_id: product.id,
        quantity: 1,
      },
      {
        preserveScroll: true,
      }
    );
  };

  return (
    <AppLayout>
      <Head title={product.name} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href={productsRoutes.index.url()}>
          <Button variant="outline" className="mb-6">
            ← Back to Products
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">{product.name}</CardTitle>
            <CardDescription className="text-lg">${product.price}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {product.description || 'No description available.'}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Stock: {product.stock_quantity} units
              </span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className="w-full"
            >
              {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}

