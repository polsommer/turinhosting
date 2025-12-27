<?php

namespace Everest\Http\Controllers\Api\Public;

use Illuminate\Http\JsonResponse;
use Everest\Models\Billing\Product;
use Everest\Models\Billing\Category;
use Everest\Http\Controllers\Api\Application\ApplicationApiController;
use Everest\Transformers\Api\Client\ProductTransformer;
use Everest\Transformers\Api\Client\CategoryTransformer;

class BillingPricingController extends ApplicationApiController
{
    public function index(): JsonResponse
    {
        $enabled = boolval(config('modules.billing.enabled', false));
        $currency = [
            'symbol' => config('modules.billing.currency.symbol'),
            'code' => config('modules.billing.currency.code'),
        ];

        if (!$enabled) {
            return response()->json([
                'enabled' => false,
                'currency' => $currency,
                'categories' => [],
                'products' => [],
            ]);
        }

        $categories = Category::query()->where('visible', true)->get();
        $products = Product::query()
            ->whereIn('category_uuid', $categories->pluck('uuid'))
            ->get();

        $categoriesPayload = $this->fractal->collection($categories)
            ->transformWith(CategoryTransformer::class)
            ->toArray();
        $productsPayload = $this->fractal->collection($products)
            ->transformWith(ProductTransformer::class)
            ->toArray();

        return response()->json([
            'enabled' => true,
            'currency' => $currency,
            'categories' => $categoriesPayload['data'] ?? [],
            'products' => $productsPayload['data'] ?? [],
        ]);
    }
}
