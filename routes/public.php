<?php

use Illuminate\Support\Facades\Route;
use Everest\Http\Controllers\Api\Public\BillingPricingController;

Route::get('/pricing', [BillingPricingController::class, 'index']);
