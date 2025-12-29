<?php

namespace Jexactyl\Http\Controllers\Api\Client\Store;

use Illuminate\Http\JsonResponse;
use Jexactyl\Http\Controllers\Api\Client\ClientApiController;

class ProductController extends ClientApiController
{
    public function index(): JsonResponse
    {
        return new JsonResponse($this->getStoreProducts());
    }

    private function getStoreProducts(): array
    {
        $setting = $this->settings->get('jexactyl::store:products', null);

        if (is_string($setting) && $setting !== '') {
            $decoded = json_decode($setting, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return $decoded;
            }
        }

        if (is_array($setting)) {
            return $setting;
        }

        return config('jexactyl.store_products', [
            'categories' => [],
            'products' => [],
        ]);
    }
}
