<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_view_products(): void
    {
        $response = $this->get(route('products.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_user_can_view_products(): void
    {
        $user = User::factory()->create();
        Product::factory()->count(5)->create(['stock_quantity' => 10]);

        $response = $this->actingAs($user)->get(route('products.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('products/index')
            ->has('products.data', 5)
        );
    }

    public function test_products_with_zero_stock_are_not_shown(): void
    {
        $user = User::factory()->create();
        Product::factory()->create(['stock_quantity' => 10]);
        Product::factory()->create(['stock_quantity' => 0]);
        Product::factory()->create(['stock_quantity' => 5]);

        $response = $this->actingAs($user)->get(route('products.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('products/index')
            ->has('products.data', 2)
        );
    }

    public function test_user_can_view_single_product(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'name' => 'Test Product',
            'price' => 99.99,
            'stock_quantity' => 10,
        ]);

        $response = $this->actingAs($user)->get(route('products.show', $product));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('products/show', shouldExist: false)
            ->where('product.id', $product->id)
            ->where('product.name', 'Test Product')
            ->where('product.price', (string) 99.99)
        );
    }

    public function test_products_are_paginated(): void
    {
        $user = User::factory()->create();
        Product::factory()->count(15)->create(['stock_quantity' => 10]);

        $response = $this->actingAs($user)->get(route('products.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('products/index')
            ->has('products.data', 12)
            ->has('products.links')
        );
    }
}

