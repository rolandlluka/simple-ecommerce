import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AppLayout } from '@/layouts/app-layout';
import { Heading } from '@/components/heading';
import ordersRoutes from '@/routes/orders';

interface Product {
  id: number;
  name: string;
  price: string;
}

interface OrderItem {
  id: number;
  quantity: number;
  price: string;
  product: Product;
}

interface Order {
  id: number;
  total: string;
  status: string;
  created_at: string;
  items: OrderItem[];
}

interface Props {
  order: Order;
}

export default function OrderShow({ order }: Props) {
  return (
    <AppLayout>
      <Head title={`Order #${order.id}`} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link href={ordersRoutes.index.url()}>
            <Button variant="outline" size="sm">
              ← Back to Orders
            </Button>
          </Link>
        </div>

        <Heading>Order #{order.id}</Heading>

        <div className="grid gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span className="font-medium">
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    order.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : order.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-4 border-t">
                <span>Total:</span>
                <span>${order.total}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start py-4 border-b last:border-0"
                  >
                    <div className="flex-grow">
                      <h4 className="font-semibold">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        ${item.price} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

