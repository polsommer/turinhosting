<?php

namespace Jexactyl\Http\Controllers\Admin\Jexactyl;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\Factory as ViewFactory;
use Illuminate\View\View;
use Jexactyl\Contracts\Repository\SettingsRepositoryInterface;
use Jexactyl\Http\Controllers\Controller;
use Jexactyl\Models\Node;
use Illuminate\Contracts\Config\Repository as ConfigRepository;

class OnboardingController extends Controller
{
    public function __construct(
        private SettingsRepositoryInterface $settings,
        private ConfigRepository $config,
        private ViewFactory $view
    ) {
    }

    public function index(): View
    {
        $completedSteps = $this->completedSteps();

        return $this->view->make('admin.jexactyl.onboarding', [
            'onboardingData' => [
                'completedSteps' => $completedSteps,
                'saveUrl' => route('admin.jexactyl.onboarding.update'),
                'steps' => $this->buildSteps(),
            ],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'steps' => 'array',
            'steps.*' => 'in:billing,branding,nodes,store',
        ]);

        $steps = array_values(array_unique($data['steps'] ?? []));

        $this->settings->set('jexactyl::onboarding:steps', json_encode($steps));
        $this->settings->set('jexactyl::onboarding:completed', count($steps) === 4 ? 'true' : 'false');

        return response()->json(['steps' => $steps]);
    }

    private function completedSteps(): array
    {
        $raw = $this->settings->get('jexactyl::onboarding:steps', '[]');
        if (!is_string($raw) || $raw === '') {
            return [];
        }

        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) {
            return [];
        }

        return array_values(array_filter($decoded, static fn ($value) => is_string($value)));
    }

    private function buildSteps(): array
    {
        $stripeEnabled = $this->boolSetting('jexactyl::store:stripe:enabled');
        $paypalEnabled = $this->boolSetting('jexactyl::store:paypal:enabled');
        $stripeSecret = (string) $this->config->get('gateways.stripe.secret');
        $stripeWebhook = (string) $this->config->get('gateways.stripe.webhook_secret');
        $paypalClientId = (string) $this->config->get('gateways.paypal.client_id');
        $paypalSecret = (string) $this->config->get('gateways.paypal.client_secret');

        $mailDriver = (string) $this->config->get('mail.default');
        $mailHost = (string) $this->config->get('mail.mailers.smtp.host');
        $mailFrom = (string) $this->config->get('mail.from.address');

        $appName = (string) $this->config->get('app.name');
        $appLogo = (string) $this->config->get('app.logo');
        $themeLayout = $this->config->get('theme.layout');
        $adminTheme = (string) $this->config->get('theme.admin');

        $storeEnabled = $this->boolSetting('jexactyl::store:enabled');
        $storeCurrency = (string) $this->settings->get('jexactyl::store:currency', $this->config->get('gateways.currency', 'USD'));
        $storeProductsRaw = $this->settings->get('jexactyl::store:products');
        $storeProducts = is_string($storeProductsRaw) ? json_decode($storeProductsRaw, true) : [];
        $storeProductsConfigured = is_array($storeProducts) && count($storeProducts) > 0;

        $nodeCount = Node::query()->count();

        return [
            [
                'id' => 'billing',
                'title' => 'Billing & Payments',
                'description' => 'Connect Stripe or PayPal so customers can purchase credits securely.',
                'actions' => [
                    ['label' => 'Configure Store Billing', 'href' => route('admin.jexactyl.store')],
                ],
                'checks' => [
                    [
                        'id' => 'stripe-ready',
                        'label' => 'Stripe enabled with API keys configured',
                        'passed' => $stripeEnabled && $stripeSecret !== '' && $stripeWebhook !== '',
                        'tip' => 'Enable Stripe in Storefront settings and add STRIPE_CLIENT_SECRET + STRIPE_WEBHOOK_SECRET in your environment.',
                    ],
                    [
                        'id' => 'paypal-ready',
                        'label' => 'PayPal enabled with client credentials configured',
                        'passed' => $paypalEnabled && $paypalClientId !== '' && $paypalSecret !== '',
                        'tip' => 'Enable PayPal in Storefront settings and add PAYPAL_CLIENT_ID + PAYPAL_CLIENT_SECRET to the environment.',
                    ],
                ],
            ],
            [
                'id' => 'branding',
                'title' => 'Branding & Theme',
                'description' => 'Personalize the panel name, logo, and theme so your panel feels like home.',
                'actions' => [
                    ['label' => 'Update Appearance', 'href' => route('admin.jexactyl.appearance')],
                    ['label' => 'Advanced Settings', 'href' => route('admin.jexactyl.advanced')],
                ],
                'checks' => [
                    [
                        'id' => 'brand-name',
                        'label' => 'Application name is set',
                        'passed' => $appName !== '',
                        'tip' => 'Set a clear app name in Advanced settings to surface it across emails and titles.',
                    ],
                    [
                        'id' => 'brand-logo',
                        'label' => 'Logo URL is configured',
                        'passed' => $appLogo !== '',
                        'tip' => 'Upload or link a logo in Advanced settings for a branded admin experience.',
                    ],
                    [
                        'id' => 'theme-layout',
                        'label' => 'Theme layout has been published',
                        'passed' => !is_null($themeLayout),
                        'tip' => 'Publish a theme layout to customize colors, typography, and spacing.',
                    ],
                    [
                        'id' => 'admin-theme',
                        'label' => 'Admin theme selection is set',
                        'passed' => $adminTheme !== '',
                        'tip' => 'Pick an admin theme to align the control panel with your branding.',
                    ],
                ],
            ],
            [
                'id' => 'nodes',
                'title' => 'Nodes & Infrastructure',
                'description' => 'Connect a node so servers can deploy and run workloads.',
                'actions' => [
                    ['label' => 'Manage Nodes', 'href' => route('admin.nodes')],
                ],
                'checks' => [
                    [
                        'id' => 'nodes-exist',
                        'label' => 'At least one node is registered',
                        'passed' => $nodeCount > 0,
                        'tip' => 'Add a node to start deploying servers to your infrastructure.',
                    ],
                ],
            ],
            [
                'id' => 'store',
                'title' => 'Store & Communications',
                'description' => 'Finalize storefront settings and confirm mail delivery for receipts and alerts.',
                'actions' => [
                    ['label' => 'Storefront Settings', 'href' => route('admin.jexactyl.store')],
                    ['label' => 'Mail Settings', 'href' => route('admin.jexactyl.mail')],
                ],
                'checks' => [
                    [
                        'id' => 'store-enabled',
                        'label' => 'Storefront is enabled',
                        'passed' => $storeEnabled,
                        'tip' => 'Enable the storefront so users can purchase credits and resources.',
                    ],
                    [
                        'id' => 'store-currency',
                        'label' => 'Store currency is selected',
                        'passed' => $storeCurrency !== '',
                        'tip' => 'Choose a store currency to align billing with your region.',
                    ],
                    [
                        'id' => 'store-products',
                        'label' => 'Store products or pricing configured',
                        'passed' => $storeProductsConfigured,
                        'tip' => 'Configure store products or pricing so users can see available options.',
                    ],
                    [
                        'id' => 'mail-config',
                        'label' => 'Mail delivery configured for notifications',
                        'passed' => $mailDriver === 'smtp' && $mailHost !== '' && $mailFrom !== '',
                        'tip' => 'Set SMTP host and sender details so users receive receipts and alerts.',
                    ],
                ],
            ],
        ];
    }

    private function boolSetting(string $key, bool $default = false): bool
    {
        return filter_var($this->settings->get($key, $default), FILTER_VALIDATE_BOOLEAN);
    }
}
