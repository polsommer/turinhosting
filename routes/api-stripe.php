<?php

use Illuminate\Support\Facades\Route;
use Everest\Http\Controllers\Api\StripeWebhookController;

Route::post('/webhook', StripeWebhookController::class)->middleware(['throttle:stripe.webhook']);
