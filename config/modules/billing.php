<?php

return [
    /*
     * Enable or disable the biling module.
     */
    'enabled' => env('BILLING_ENABLED', false),

    /*
     * Configure the publishable & secret API key for Stripe.
     */
    'keys' => [
        'publishable' => env('BILLING_PUBLISHABLE_KEY', ''),
        'secret' => env('BILLING_SECRET_KEY', ''),
    ],

    /*
     * Configure Stripe product & price identifiers.
     */
    'stripe' => [
        'subscription_product' => env('STRIPE_SUBSCRIPTION_PRODUCT', ''),
        'subscription_price' => env('STRIPE_SUBSCRIPTION_PRICE', ''),
        'one_off_price' => env('STRIPE_ONE_OFF_PRICE', ''),
    ],

    /*
     * Choose whether to add PayPal integration to the Panel.
     */
    'paypal' => env('BILLING_PAYPAL', false),

    /*
     * Choose whether to add Link integration to the Panel.
     */
    'link' => env('BILLING_LINK', false),

    /*
     * Set a currency code and symbol to use for billing.
     */
    'currency' => [
        'symbol' => '$',
        'code' => 'usd',
    ],
];
