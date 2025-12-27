<?php

namespace Everest\Http\ViewComposers;

use Illuminate\View\View;

class AssetComposer
{
    /**
     * Provide access to the asset service in the views.
     */
    public function compose(View $view): void
    {
        $view->with('siteConfiguration', [
            'name' => config('app.name') ?? 'Everest',
            'mode' => config('app.mode') ?? 'standard',
            'setup' => config('app.setup') ?? false,
            'debug' => env('APP_DEBUG') ?? false,
            'locale' => config('app.locale') ?? 'en',
            'auto_update' => boolval(config('app.auto_update', false)),
            'speed_dial' => boolval(config('app.speed_dial', false)),
            'indicators' => boolval(config('app.indicators', false)),
            'recaptcha' => [
                'enabled' => config('recaptcha.enabled', false),
                'siteKey' => config('recaptcha.website_key') ?? '',
            ],
            'storefront' => [
                'headline' => config('app.storefront_headline')
                    ?? 'Deliver standout VPS hosting with a professional front door and the power of JexPanel.',
                'subheading' => config('app.storefront_subheading')
                    ?? 'Create a premium experience for your customers with lightning-fast provisioning, clear pricing, and a control panel that feels effortless to navigate.',
                'cta_label' => config('app.storefront_cta') ?? 'View pricing',
                'contact_email' => config('app.storefront_contact_email') ?? 'sales@turinhosting.com',
                'show_pricing' => boolval(config('app.storefront_show_pricing', true)),
            ],
        ]);
    }
}
