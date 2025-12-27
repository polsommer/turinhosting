<?php

namespace Everest\Http\Controllers\Api\Client\Billing;

use Carbon\Carbon;
use Stripe\StripeClient;
use Everest\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Everest\Exceptions\DisplayException;
use Everest\Http\Controllers\Api\Client\ClientApiController;
use Everest\Contracts\Repository\SettingsRepositoryInterface;

class StripeCheckoutController extends ClientApiController
{
    private StripeClient $stripe;

    public function __construct(private SettingsRepositoryInterface $settings)
    {
        parent::__construct();

        $secret = $this->settings->get('settings::modules:billing:keys:secret');

        if (!$secret) {
            throw new DisplayException('Stripe API keys are missing.');
        }

        $this->stripe = new StripeClient($secret);
    }

    /**
     * Create a Stripe checkout session for subscriptions.
     */
    public function subscription(Request $request): JsonResponse
    {
        $data = $request->validate([
            'success_url' => 'required|url',
            'cancel_url' => 'required|url',
        ]);

        $priceId = config('modules.billing.stripe.subscription_price');

        if (!$priceId) {
            throw new DisplayException('Stripe subscription price is not configured.');
        }

        $customerId = $this->getOrCreateCustomer($request->user());

        $session = $this->stripe->checkout->sessions->create([
            'mode' => 'subscription',
            'customer' => $customerId,
            'success_url' => $data['success_url'],
            'cancel_url' => $data['cancel_url'],
            'line_items' => [
                [
                    'price' => $priceId,
                    'quantity' => 1,
                ],
            ],
            'subscription_data' => [
                'metadata' => [
                    'user_id' => (string) $request->user()->id,
                ],
            ],
            'client_reference_id' => $request->user()->uuid,
        ]);

        return response()->json([
            'id' => $session->id,
            'url' => $session->url,
        ]);
    }

    /**
     * Create a Stripe checkout session for one-off purchases.
     */
    public function oneOff(Request $request): JsonResponse
    {
        $data = $request->validate([
            'success_url' => 'required|url',
            'cancel_url' => 'required|url',
        ]);

        $priceId = config('modules.billing.stripe.one_off_price');

        if (!$priceId) {
            throw new DisplayException('Stripe one-off price is not configured.');
        }

        $customerId = $this->getOrCreateCustomer($request->user());

        $session = $this->stripe->checkout->sessions->create([
            'mode' => 'payment',
            'customer' => $customerId,
            'success_url' => $data['success_url'],
            'cancel_url' => $data['cancel_url'],
            'line_items' => [
                [
                    'price' => $priceId,
                    'quantity' => 1,
                ],
            ],
            'client_reference_id' => $request->user()->uuid,
        ]);

        return response()->json([
            'id' => $session->id,
            'url' => $session->url,
        ]);
    }

    /**
     * Generate a Stripe customer portal session.
     */
    public function portal(Request $request): JsonResponse
    {
        $data = $request->validate([
            'return_url' => 'nullable|url',
        ]);

        $customerId = $this->getOrCreateCustomer($request->user());

        $session = $this->stripe->billingPortal->sessions->create([
            'customer' => $customerId,
            'return_url' => $data['return_url'] ?? config('app.url'),
        ]);

        return response()->json([
            'url' => $session->url,
        ]);
    }

    /**
     * List customer invoices (stub).
     */
    public function invoices(Request $request): JsonResponse
    {
        return response()->json([
            'data' => [],
            'generated_at' => Carbon::now()->toIso8601String(),
        ]);
    }

    private function getOrCreateCustomer(User $user): string
    {
        if ($user->stripe_id) {
            return $user->stripe_id;
        }

        $customer = $this->stripe->customers->create([
            'email' => $user->email,
            'name' => $user->username,
            'metadata' => [
                'user_id' => (string) $user->id,
            ],
        ]);

        $user->stripe_id = $customer->id;
        $user->save();

        return $customer->id;
    }
}
