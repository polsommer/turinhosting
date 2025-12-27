<?php

namespace Everest\Http\Controllers\Api;

use Carbon\Carbon;
use Stripe\Webhook;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Everest\Models\User;
use Everest\Models\Subscription;
use Stripe\Exception\SignatureVerificationException;

class StripeWebhookController
{
    public function __invoke(Request $request): Response
    {
        $secret = config('cashier.webhook.secret');

        if (!$secret) {
            return response()->noContent(400);
        }

        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature');

        try {
            $event = Webhook::constructEvent(
                $payload,
                $signature,
                $secret,
                config('cashier.webhook.tolerance', 300)
            );
        } catch (SignatureVerificationException | \UnexpectedValueException) {
            return response()->noContent(400);
        }

        switch ($event->type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
                $this->syncSubscription($event->data->object);
                break;
            default:
                break;
        }

        return response()->noContent();
    }

    private function syncSubscription(object $stripeSubscription): void
    {
        if (!isset($stripeSubscription->customer, $stripeSubscription->id)) {
            return;
        }

        $user = User::where('stripe_id', $stripeSubscription->customer)->first();

        if (!$user) {
            return;
        }

        $priceId = null;
        $quantity = null;

        if (!empty($stripeSubscription->items->data[0])) {
            $item = $stripeSubscription->items->data[0];
            $priceId = $item->price->id ?? null;
            $quantity = $item->quantity ?? null;
        }

        Subscription::updateOrCreate(
            ['stripe_id' => $stripeSubscription->id],
            [
                'user_id' => $user->id,
                'type' => 'default',
                'stripe_status' => $stripeSubscription->status ?? 'unknown',
                'stripe_price' => $priceId,
                'quantity' => $quantity,
                'trial_ends_at' => $this->nullableTimestamp($stripeSubscription->trial_end ?? null),
                'ends_at' => $this->nullableTimestamp(
                    $stripeSubscription->ended_at ?? $stripeSubscription->cancel_at ?? null
                ),
            ]
        );
    }

    private function nullableTimestamp(?int $timestamp): ?Carbon
    {
        if (!$timestamp) {
            return null;
        }

        return Carbon::createFromTimestamp($timestamp);
    }
}
