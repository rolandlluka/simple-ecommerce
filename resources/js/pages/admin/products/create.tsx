import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppLayout } from '@/layouts/app-layout';
import { Heading } from '@/components/heading';
import { InputError } from '@/components/input-error';
import productsRoutes from '@/routes/admin/products';

export default function AdminProductCreate() {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(productsRoutes.store.url());
  };

  return (
    <AppLayout>
      <Head title="Create Product" />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Heading>Create New Product</Heading>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>
              Add a new product to your inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  required
                />
                <InputError message={errors.name} />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  rows={4}
                />
                <InputError message={errors.description} />
              </div>

              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={data.price}
                  onChange={(e) => setData('price', e.target.value)}
                  required
                />
                <InputError message={errors.price} />
              </div>

              <div>
                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  value={data.stock_quantity}
                  onChange={(e) => setData('stock_quantity', e.target.value)}
                  required
                />
                <InputError message={errors.stock_quantity} />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={processing}>
                  Create Product
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

