import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AppLayout } from '@/layouts/app-layout';
import { Heading } from '@/components/heading';
import productsRoutes from '@/routes/admin/products';

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
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

export default function AdminProductsIndex({ products }: Props) {
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      router.delete(productsRoutes.destroy.url(id), {
        preserveScroll: true,
      });
    }
  };

  return (
    <AppLayout>
      <Head title="Manage Products" />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <Heading>Manage Products</Heading>
          <Link href={productsRoutes.create.url()}>
            <Button>Add New Product</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              Manage your product inventory ({products.total} total products)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Stock</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.data.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{product.name}</div>
                          {product.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">${product.price}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                            product.stock_quantity < 10
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link href={productsRoutes.edit.url(product.id)}>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {products.last_page > 1 && (
              <div className="mt-4 flex justify-center gap-2">
                {Array.from({ length: products.last_page }, (_, i) => i + 1).map(
                  (page) => (
                    <Link
                      key={page}
                      href={productsRoutes.index.url({ query: { page } })}
                      preserveScroll
                    >
                      <Button
                        variant={
                          page === products.current_page ? 'default' : 'outline'
                        }
                        size="sm"
                      >
                        {page}
                      </Button>
                    </Link>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

