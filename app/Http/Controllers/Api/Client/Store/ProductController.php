<?php

namespace Jexactyl\Http\Controllers\Api\Client\Store;

use Illuminate\Http\JsonResponse;
use Jexactyl\Http\Controllers\Api\Client\ClientApiController;

class ProductController extends ClientApiController
{
    /**
     * Return the storefront product catalog.
     */
    public function index(): JsonResponse
    {
        return new JsonResponse([
            'categories' => config('store.products.categories', []),
        ]);
    }
}
