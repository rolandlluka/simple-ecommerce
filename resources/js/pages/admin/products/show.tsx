import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/layouts/app-layout';
import { Heading } from '@/components/heading';
import adminProducts from '@/routes/admin/products';

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

export default function AdminProductShow({ product }: Props) {
  return (
    <AppLayout>
      <Head title={`Product: ${product.name}`} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Heading>Product Details</Heading>
          <div className="flex gap-2">
            <Link href={adminProducts.index.url()}>
              <Button variant="outline">Back to List</Button>
            </Link>
            <Link href={adminProducts.edit.url(product.id)}>
              <Button>Edit Product</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{product.name}</CardTitle>
            <CardDescription>Product ID: {product.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {product.description || 'No description provided.'}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Price</h3>
              <p className="text-lg">${product.price}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Stock Quantity</h3>
              <p className="text-lg">{product.stock_quantity} units</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

