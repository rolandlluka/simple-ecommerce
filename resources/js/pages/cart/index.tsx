import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AppLayout } from '@/layouts/app-layout';
import { Heading } from '@/components/heading';
import { useState } from 'react';
import cart from '@/routes/cart';
import orders from '@/routes/orders';
import products from '@/routes/products';
import { showToast } from '@/components/toast-container';

interface Product {
  id: number;
  name: string;
  price: string;
  stock_quantity: number;
}

interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

interface Props {
  cartItems: CartItem[];
  total: number;
}

export default function CartIndex({ cartItems, total }: Props) {
  const [updatingItem, setUpdatingItem] = useState<number | null>(null);

  const handleUpdateQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) return;

    setUpdatingItem(itemId);
    router.put(
      cart.update.url(itemId),
      { quantity },
      {
        preserveScroll: true,
        onSuccess: () => {
          showToast('Cart updated successfully', 'success');
        },
        onFinish: () => setUpdatingItem(null),
      }
    );
  };

  const handleRemoveItem = (itemId: number, productName: string) => {
    if (confirm('Remove this item from your cart?')) {
      router.delete(cart.destroy.url(itemId), {
        preserveScroll: true,
        onSuccess: () => {
          showToast(`${productName} removed from cart`, 'success');
        },
      });
    }
  };

  const handleCheckout = () => {
    router.post(orders.store.url(), {}, {
      preserveScroll: false,
    });
  };

  return (
    <AppLayout>
      <Head title="Shopping Cart" />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <Heading>Shopping Cart</Heading>
          <Link href={products.index.url()}>
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Link href={products.index.url()}>
                <Button>Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-grow">
                        <h3 className="font-semibold text-lg">
                          {item.product.name}
                        </h3>
                        <p className="text-muted-foreground">
                          ${item.product.price} each
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.product.stock_quantity} available
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={
                              item.quantity <= 1 || updatingItem === item.id
                            }
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(
                                item.id,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-20 text-center"
                            min="1"
                            max={item.product.stock_quantity}
                            disabled={updatingItem === item.id}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={
                              item.quantity >= item.product.stock_quantity ||
                              updatingItem === item.id
                            }
                          >
                            +
                          </Button>
                        </div>

                        <div className="text-right min-w-[100px]">
                          <p className="font-semibold text-lg">
                            $
                            {(
                              parseFloat(item.product.price) * item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id, item.product.name)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </AppLayout>
  );
}

