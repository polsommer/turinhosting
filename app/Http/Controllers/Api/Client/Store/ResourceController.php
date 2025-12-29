<?php

namespace Jexactyl\Http\Controllers\Api\Client\Store;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Jexactyl\Exceptions\DisplayException;
use Jexactyl\Services\Store\ResourcePurchaseService;
use Jexactyl\Transformers\Api\Client\Store\CostTransformer;
use Jexactyl\Transformers\Api\Client\Store\UserTransformer;
use Jexactyl\Http\Controllers\Api\Client\ClientApiController;
use Jexactyl\Http\Requests\Api\Client\Store\PurchaseResourceRequest;

class ResourceController extends ClientApiController
{
    /**
     * ResourceController constructor.
     */
    public function __construct(private ResourcePurchaseService $purchaseService)
    {
        parent::__construct();
    }

    /**
     * Get the resources for the authenticated user.
     *
     * @throws DisplayException
     */
    public function user(Request $request)
    {
        return $this->fractal->item($request->user())
            ->transformWith($this->getTransformer(UserTransformer::class))
            ->toArray();
    }

    /**
     * Get the cost of resources.
     *
     * @throws DisplayException
     */
    public function costs(Request $request)
    {
        $data = [];
        $prefix = 'jexactyl::store:cost:';
        $types = ['cpu', 'memory', 'disk', 'slot', 'port', 'backup', 'database'];

        foreach ($types as $type) {
            array_push($data, $this->settings->get($prefix . $type, 0));
        }

        return $this->fractal->item($data)
            ->transformWith($this->getTransformer(CostTransformer::class))
            ->toArray();
    }

    /**
     * Allows a user to earn money via passive earning.
     *
     * @throws DisplayException
     */
    public function earn(Request $request)
    {
        throw new DisplayException('Balance earning is currently disabled.');
    }

    /**
     * Allows users to purchase resources via the store.
     *
     * @throws DisplayException
     */
    public function purchase(PurchaseResourceRequest $request): JsonResponse
    {
        $this->purchaseService->handle($request);

        return new JsonResponse([], Response::HTTP_NO_CONTENT);
    }
}
