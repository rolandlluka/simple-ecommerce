import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import products from '@/routes/products';
import cart from '@/routes/cart';
import orders from '@/routes/orders';
import adminProducts from '@/routes/admin/products';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { auth, cartCount } = usePage<SharedData>().props;
    const isAdmin = (auth?.user as { is_admin?: boolean })?.is_admin || false;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <h1 className="text-3xl font-bold mb-8">Welcome to E-Commerce!</h1>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Browse Products Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Browse Products</CardTitle>
                            <CardDescription>
                                Explore our product catalog
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href={products.index.url()}>
                                <Button className="w-full">View Products</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Shopping Cart Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Shopping Cart</CardTitle>
                            <CardDescription>
                                View and manage your cart
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href={cart.index.url()}>
                                <Button className="w-full relative" variant="outline">
                                    View Cart
                                    {cartCount > 0 && (
                                        <Badge 
                                            variant="default" 
                                            className="ml-2 h-5 min-w-5 px-1.5 flex items-center justify-center rounded-full"
                                        >
                                            {cartCount}
                                        </Badge>
                                    )}
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* My Orders Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>My Orders</CardTitle>
                            <CardDescription>
                                Track your order history
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href={orders.index.url()}>
                                <Button className="w-full" variant="outline">View Orders</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Admin Panel Card - Only for admins */}
                    {isAdmin && (
                        <Card className="md:col-span-2 lg:col-span-3 border-primary">
                            <CardHeader>
                                <CardTitle>Admin Panel</CardTitle>
                                <CardDescription>
                                    Manage products and inventory
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href={adminProducts.index.url()}>
                                    <Button className="w-full" variant="default">
                                        Manage Products
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
