<?php

namespace Tests\Feature\Jobs;

use App\Jobs\LowStockNotificationJob;
use App\Mail\LowStockNotification;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class LowStockNotificationJobTest extends TestCase
{
    use RefreshDatabase;

    public function test_low_stock_notification_is_sent_to_admins(): void
    {
        Mail::fake();

        $admin1 = User::factory()->create(['is_admin' => true, 'email' => 'admin1@example.com']);
        $admin2 = User::factory()->create(['is_admin' => true, 'email' => 'admin2@example.com']);
        User::factory()->create(['is_admin' => false, 'email' => 'user@example.com']);

        $product = Product::factory()->create([
            'name' => 'Low Stock Product',
            'stock_quantity' => 5,
        ]);

        $job = new LowStockNotificationJob($product);
        $job->handle();

        Mail::assertSent(LowStockNotification::class, function ($mail) use ($admin1) {
            return $mail->hasTo($admin1->email);
        });

        Mail::assertSent(LowStockNotification::class, function ($mail) use ($admin2) {
            return $mail->hasTo($admin2->email);
        });

        Mail::assertSent(LowStockNotification::class, 2);
    }

    public function test_low_stock_notification_contains_product_info(): void
    {
        Mail::fake();

        $admin = User::factory()->create(['is_admin' => true]);
        $product = Product::factory()->create([
            'name' => 'Test Product',
            'stock_quantity' => 5,
        ]);

        $job = new LowStockNotificationJob($product);
        $job->handle();

        Mail::assertSent(LowStockNotification::class, function ($mail) use ($product, $admin) {
            return $mail->hasTo($admin->email)
                && $mail->product->id === $product->id
                && $mail->product->name === 'Test Product';
        });
    }

    public function test_job_can_be_dispatched(): void
    {
        Mail::fake();

        $admin = User::factory()->create(['is_admin' => true]);
        $product = Product::factory()->create(['stock_quantity' => 5]);

        LowStockNotificationJob::dispatch($product);

        Mail::assertSent(LowStockNotification::class);
    }
}

