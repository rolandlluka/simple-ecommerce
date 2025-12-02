<?php

namespace Tests\Feature\Jobs;

use App\Jobs\DailySalesReportJob;
use App\Mail\DailySalesReport;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class DailySalesReportJobTest extends TestCase
{
    use RefreshDatabase;

    public function test_daily_sales_report_is_sent_to_admins(): void
    {
        Mail::fake();

        $admin1 = User::factory()->create(['is_admin' => true, 'email' => 'admin1@example.com']);
        $admin2 = User::factory()->create(['is_admin' => true, 'email' => 'admin2@example.com']);
        User::factory()->create(['is_admin' => false]); // Regular user

        $job = new DailySalesReportJob();
        $job->handle();

        Mail::assertSent(DailySalesReport::class, function ($mail) use ($admin1) {
            return $mail->hasTo($admin1->email);
        });

        Mail::assertSent(DailySalesReport::class, function ($mail) use ($admin2) {
            return $mail->hasTo($admin2->email);
        });

        Mail::assertSent(DailySalesReport::class, 2); // Only to admins
    }

    public function test_report_includes_todays_orders(): void
    {
        Mail::fake();

        $admin = User::factory()->create(['is_admin' => true]);
        $user = User::factory()->create();

        // Create orders for today
        $order1 = Order::factory()->create([
            'user_id' => $user->id,
            'total' => 100.00,
            'created_at' => now(),
        ]);

        $order2 = Order::factory()->create([
            'user_id' => $user->id,
            'total' => 200.00,
            'created_at' => now(),
        ]);

        // Create order for yesterday (should not be included)
        Order::factory()->create([
            'user_id' => $user->id,
            'total' => 50.00,
            'created_at' => now()->subDay(),
        ]);

        $job = new DailySalesReportJob();
        $job->handle();

        Mail::assertSent(DailySalesReport::class, function ($mail) {
            $reportData = $mail->reportData;
            return $reportData['totalOrders'] === 2
                && $reportData['totalRevenue'] == 300.00; // 100 + 200
        });
    }

    public function test_report_includes_products_sold(): void
    {
        Mail::fake();

        $admin = User::factory()->create(['is_admin' => true]);
        $user = User::factory()->create();
        $product1 = Product::factory()->create(['name' => 'Product 1', 'price' => 10.00]);
        $product2 = Product::factory()->create(['name' => 'Product 2', 'price' => 20.00]);

        $order = Order::factory()->create([
            'user_id' => $user->id,
            'total' => 50.00,
            'created_at' => now(),
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product1->id,
            'quantity' => 2,
            'price' => 10.00,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product2->id,
            'quantity' => 1,
            'price' => 20.00,
        ]);

        $job = new DailySalesReportJob();
        $job->handle();

        Mail::assertSent(DailySalesReport::class, function ($mail) use ($product1, $product2) {
            $productsSold = $mail->reportData['productsSold'];
            
            $product1Data = collect($productsSold)->firstWhere('name', $product1->name);
            $product2Data = collect($productsSold)->firstWhere('name', $product2->name);

            return $product1Data
                && $product1Data->total_quantity == 2
                && $product2Data
                && $product2Data->total_quantity == 1;
        });
    }

    public function test_report_shows_zero_when_no_orders_today(): void
    {
        Mail::fake();

        $admin = User::factory()->create(['is_admin' => true]);

        // Create order for yesterday
        Order::factory()->create([
            'created_at' => now()->subDay(),
        ]);

        $job = new DailySalesReportJob();
        $job->handle();

        Mail::assertSent(DailySalesReport::class, function ($mail) {
            $reportData = $mail->reportData;
            return $reportData['totalOrders'] === 0
                && $reportData['totalRevenue'] == 0;
        });
    }

    public function test_job_can_be_dispatched(): void
    {
        Mail::fake();

        $admin = User::factory()->create(['is_admin' => true]);

        DailySalesReportJob::dispatch();

        // Since queue is set to 'sync' in tests, job runs immediately
        Mail::assertSent(DailySalesReport::class);
    }
}

