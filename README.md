# Simple E-Commerce System

A clean, modern shopping cart system built with Laravel 12, React 18, Inertia.js, and TailwindCSS.

## Features

### User Features
- 🛍️ Browse products with pagination
- 🛒 Add products to cart (database-backed, not session-based)
- ✏️ Update cart item quantities
- 🗑️ Remove items from cart
- 📦 Checkout and place orders
- 📋 View order history
- 🔐 User authentication (Laravel Fortify + React + Inertia)

### Admin Features
- 👨‍💼 Admin role management
- ➕ Create new products
- ✏️ Edit existing products
- 🗑️ Delete products
- 📊 View all products with stock levels
- 📧 Receive low stock email notifications (via queue jobs)
- 📈 Receive daily sales reports (via scheduled jobs)

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd simple-ecommerce
```

2. **Install PHP dependencies**
```bash
composer install
```

3. **Install Node dependencies**
```bash
npm install
```

4. **Environment setup**
```bash
cp .env.example .env
php artisan key:generate
```

5. **Database setup**
```bash
# Configure your database in .env
# For development, SQLite is pre-configured

# Run migrations and seed database
php artisan migrate:fresh --seed
```

6. **Build assets**
```bash
npm run build
# Or for development
npm run dev
```

7. **Start the application**
```bash
# Run all services (recommended for development)
composer dev

# Or manually:
php artisan serve
php artisan queue:work
npm run dev
```

## Default Users

After seeding, the following users are available:

### Admin User
- **Email**: admin@example.com
- **Password**: password
- **Role**: Admin (can manage products)

### Test User
- **Email**: test@example.com
- **Password**: password
- **Role**: Regular user

## Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/
│   │   │   └── ProductController.php    # Admin product management
│   │   ├── CartController.php           # Shopping cart operations
│   │   ├── OrderController.php          # Order & checkout
│   │   └── ProductController.php        # User product browsing
│   └── Middleware/
│       └── EnsureUserIsAdmin.php        # Admin authorization
├── Models/
│   ├── User.php                         # User model with is_admin
│   ├── Product.php                      # Product model
│   ├── CartItem.php                     # Cart items (user-specific)
│   ├── Order.php                        # Orders
│   └── OrderItem.php                    # Order items
├── Jobs/
│   ├── LowStockNotificationJob.php      # Queue job for low stock alerts
│   └── DailySalesReportJob.php          # Queue job for daily reports
└── Mail/
    ├── LowStockNotification.php         # Low stock email
    └── DailySalesReport.php             # Daily sales report email

resources/js/pages/
├── admin/products/                      # Admin product management pages
│   ├── index.tsx                        # List products
│   ├── create.tsx                       # Create product
│   └── edit.tsx                         # Edit product
├── products/
│   └── index.tsx                        # Browse products (users)
├── cart/
│   └── index.tsx                        # Shopping cart
└── orders/
    ├── index.tsx                        # Order history
    └── show.tsx                         # Order details
```

## Queue & Scheduler

### Queue Jobs
The application uses Laravel's database queue driver for background jobs:

```bash
# Start queue worker
php artisan queue:work
```

**Low Stock Notification Job**: Triggered automatically when a product's stock falls below 10 units during checkout. Sends email to all admin users.

### Scheduled Jobs
Configure your server to run Laravel's scheduler:

```bash
# Add to crontab
* * * * * cd /path-to-project && php artisan schedule:run >> /dev/null 2>&1
```

**Daily Sales Report**: Runs every day at 22:00, sending a comprehensive sales report to all admins.

## Email Configuration

Update your `.env` with email settings:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

For development, you can use [Mailtrap](https://mailtrap.io/) or log driver:
```env
MAIL_MAILER=log
```

## Routes

### Public Routes
- `GET /` - Welcome page
- `GET /login` - Login page
- `GET /register` - Registration page

### Authenticated User Routes
- `GET /dashboard` - User dashboard
- `GET /products` - Browse products
- `GET /cart` - View shopping cart
- `POST /cart` - Add item to cart
- `PUT /cart/{cartItem}` - Update cart item quantity
- `DELETE /cart/{cartItem}` - Remove cart item
- `GET /orders` - View order history
- `GET /orders/{order}` - View order details
- `POST /orders` - Checkout/place order

### Admin Routes (requires `admin` middleware)
- `GET /admin/products` - List all products
- `GET /admin/products/create` - Create product form
- `POST /admin/products` - Store new product
- `GET /admin/products/{product}/edit` - Edit product form
- `PUT /admin/products/{product}` - Update product
- `DELETE /admin/products/{product}` - Delete product

## Development

```bash
# Run all services in development mode
composer dev

# This starts:
# - Laravel development server (port 8000)
# - Queue worker
# - Vite dev server with HMR
# - Laravel Pail (log viewer)
```

## Testing

```bash
# Run tests
composer test

# Or
php artisan test
```

## Database Schema

### Users
- `id`, `name`, `email`, `password`, `is_admin`, `timestamps`

### Products
- `id`, `name`, `description`, `price`, `stock_quantity`, `timestamps`

### Cart Items
- `id`, `user_id`, `product_id`, `quantity`, `timestamps`
- Unique constraint: `(user_id, product_id)`

### Orders
- `id`, `user_id`, `total`, `status`, `timestamps`

### Order Items
- `id`, `order_id`, `product_id`, `quantity`, `price`, `timestamps`

## Best Practices Implemented

✅ Clean MVC architecture
✅ Database-backed cart (no sessions/localStorage)
✅ Queue jobs for email notifications
✅ Scheduled jobs for daily reports
✅ Proper authentication & authorization
✅ RESTful API design
✅ Form validation
✅ Database transactions for checkout
✅ Stock management
✅ Eloquent relationships
✅ Type-safe frontend with TypeScript
✅ Responsive design with TailwindCSS
✅ Component-based UI architecture

## Contributing

This project follows Laravel and React best practices. When contributing:
1. Follow PSR-12 coding standards for PHP
2. Use TypeScript for all React components
3. Write descriptive commit messages
4. Test your changes before submitting

## License

MIT License

## Author

Built with ❤️ using Laravel 12 and React 18

