<?php

namespace Tests\Feature\Admin;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_admin_products(): void
    {
        $response = $this->get(route('admin.products.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_regular_user_cannot_access_admin_products(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $response = $this->actingAs($user)->get(route('admin.products.index'));

        $response->assertStatus(403);
    }

    public function test_admin_can_view_products_list(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        Product::factory()->count(5)->create();

        $response = $this->actingAs($admin)->get(route('admin.products.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/products/index')
            ->has('products.data', 5)
        );
    }

    public function test_admin_can_view_create_product_form(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->get(route('admin.products.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/products/create')
        );
    }

    public function test_admin_can_create_product(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->post(route('admin.products.store'), [
            'name' => 'New Product',
            'description' => 'Product description',
            'price' => 99.99,
            'stock_quantity' => 50,
        ]);

        $response->assertRedirect(route('admin.products.index'));
        $response->assertSessionHas('success', 'Product created successfully.');

        $this->assertDatabaseHas('products', [
            'name' => 'New Product',
            'description' => 'Product description',
            'price' => 99.99,
            'stock_quantity' => 50,
        ]);
    }

    public function test_product_creation_requires_valid_data(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->post(route('admin.products.store'), [
            'name' => '',
            'price' => -10,
            'stock_quantity' => -5,
        ]);

        $response->assertSessionHasErrors(['name', 'price', 'stock_quantity']);
    }

    public function test_admin_can_view_edit_product_form(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $product = Product::factory()->create();

        $response = $this->actingAs($admin)->get(route('admin.products.edit', $product));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/products/edit')
            ->where('product.id', $product->id)
        );
    }

    public function test_admin_can_update_product(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $product = Product::factory()->create([
            'name' => 'Old Name',
            'price' => 50.00,
        ]);

        $response = $this->actingAs($admin)->put(route('admin.products.update', $product), [
            'name' => 'Updated Name',
            'description' => 'Updated description',
            'price' => 75.00,
            'stock_quantity' => 100,
        ]);

        $response->assertRedirect(route('admin.products.index'));
        $response->assertSessionHas('success', 'Product updated successfully.');

        $product->refresh();
        $this->assertEquals('Updated Name', $product->name);
        $this->assertEquals(75.00, $product->price);
        $this->assertEquals(100, $product->stock_quantity);
    }

    public function test_admin_can_delete_product(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $product = Product::factory()->create();

        $response = $this->actingAs($admin)->delete(route('admin.products.destroy', $product));

        $response->assertRedirect(route('admin.products.index'));
        $response->assertSessionHas('success', 'Product deleted successfully.');

        $this->assertDatabaseMissing('products', [
            'id' => $product->id,
        ]);
    }

    public function test_admin_can_view_single_product(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $product = Product::factory()->create();

        $response = $this->actingAs($admin)->get(route('admin.products.show', $product));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('admin/products/show', shouldExist: false)
            ->where('product.id', $product->id)
        );
    }
}

