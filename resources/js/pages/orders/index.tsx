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
import productsRoutes from '@/routes/products';
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

interface PaginatedOrders {
  data: Order[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface Props {
  orders: PaginatedOrders;
}

export default function OrdersIndex({ orders }: Props) {
  return (
    <AppLayout>
      <Head title="My Orders" />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Heading>My Orders</Heading>

        {orders.data.length === 0 ? (
          <Card className="mt-6">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">You haven't placed any orders yet</p>
              <Link href={productsRoutes.index.url()}>
                <Button>Start Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 mt-6">
            {orders.data.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Order #{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">${order.total}</div>
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
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center py-2 border-b last:border-0"
                      >
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity} × ${item.price}
                          </p>
                        </div>
                        <div className="font-semibold">
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link href={ordersRoutes.show.url(order.id)}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {orders.last_page > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: orders.last_page }, (_, i) => i + 1).map(
              (page) => (
                <Link
                  key={page}
                  href={ordersRoutes.index.url({ query: { page } })}
                  preserveScroll
                >
                  <Button
                    variant={page === orders.current_page ? 'default' : 'outline'}
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

