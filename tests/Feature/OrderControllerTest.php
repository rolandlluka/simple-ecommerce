<?php

namespace Tests\Feature;

use App\Jobs\LowStockNotificationJob;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_view_orders(): void
    {
        $response = $this->get(route('orders.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_user_can_view_empty_orders_list(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('orders.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('orders/index')
            ->has('orders.data', 0)
        );
    }

    public function test_user_can_view_their_orders(): void
    {
        $user = User::factory()->create();
        Order::factory()->count(3)->create(['user_id' => $user->id]);
        Order::factory()->count(2)->create();

        $response = $this->actingAs($user)->get(route('orders.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('orders/index')
            ->has('orders.data', 3)
        );
    }

    public function test_user_cannot_checkout_with_empty_cart(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('orders.store'));

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Your cart is empty.');
    }

    public function test_user_can_checkout_and_create_order(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        $product1 = Product::factory()->create(['price' => 10.00, 'stock_quantity' => 10]);
        $product2 = Product::factory()->create(['price' => 20.00, 'stock_quantity' => 10]);

        CartItem::create([
            'user_id' => $user->id,
            'product_id' => $product1->id,
            'quantity' => 2,
        ]);

        CartItem::create([
            'user_id' => $user->id,
            'product_id' => $product2->id,
            'quantity' => 1,
        ]);

        $response = $this->actingAs($user)->post(route('orders.store'));

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Order placed successfully!');

        $order = Order::where('user_id', $user->id)->first();
        $this->assertNotNull($order);
        $this->assertEquals(40, $order->total);
        $this->assertEquals('completed', $order->status);

        $this->assertEquals(2, $order->items()->count());

        $product1->refresh();
        $product2->refresh();
        $this->assertEquals(8, $product1->stock_quantity);
        $this->assertEquals(9, $product2->stock_quantity);

        $this->assertEquals(0, CartItem::where('user_id', $user->id)->count());
    }

    public function test_checkout_fails_if_insufficient_stock(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock_quantity' => 5]);

        CartItem::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => 10,
        ]);

        $response = $this->actingAs($user)->post(route('orders.store'));

        $response->assertRedirect();
        $response->assertSessionHas('error');

        $this->assertEquals(0, Order::where('user_id', $user->id)->count());

        $product->refresh();
        $this->assertEquals(5, $product->stock_quantity);
    }

    public function test_low_stock_notification_is_dispatched_on_checkout(): void
    {
        Queue::fake();

        $user = User::factory()->create();
        $product = Product::factory()->create(['stock_quantity' => 15]);

        CartItem::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => 6,
        ]);

        $this->actingAs($user)->post(route('orders.store'));

        Queue::assertPushed(LowStockNotificationJob::class, function ($job) use ($product) {
            return $job->product->id === $product->id;
        });
    }

    public function test_user_can_view_single_order(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get(route('orders.show', $order));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('orders/show')
            ->where('order.id', $order->id)
        );
    }

    public function test_user_cannot_view_other_users_orders(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $order = Order::factory()->create(['user_id' => $user1->id]);

        $response = $this->actingAs($user2)->get(route('orders.show', $order));

        $response->assertStatus(403);
    }
}

