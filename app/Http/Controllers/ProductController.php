<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $products = Product::query()
            ->where('stock_quantity', '>', 0)
            ->latest()
            ->paginate(12);

        return Inertia::render('products/index', [
            'products' => $products,
        ]);
    }

    public function show(Product $product)
    {
        return Inertia::render('products/show', [
            'product' => $product,
        ]);
    }
}
