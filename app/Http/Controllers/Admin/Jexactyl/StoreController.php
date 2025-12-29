<?php

namespace Jexactyl\Http\Controllers\Admin\Jexactyl;

use Illuminate\View\View;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use Jexactyl\Http\Controllers\Controller;
use Jexactyl\Exceptions\Model\DataValidationException;
use Jexactyl\Exceptions\Repository\RecordNotFoundException;
use Jexactyl\Http\Requests\Admin\Jexactyl\StoreProductRequest;
use Jexactyl\Contracts\Repository\SettingsRepositoryInterface;

class StoreController extends Controller
{
    /**
     * StoreController constructor.
     */
    public function __construct(
        private AlertsMessageBag $alert,
        private SettingsRepositoryInterface $settings
    ) {
    }

    /**
     * Render the Jexactyl store settings interface.
     */
    public function index(): View
    {
        $prefix = 'jexactyl::store:';
        $catalog = $this->getStoreProducts();

        $currencies = [];
        foreach (config('store.currencies') as $key => $value) {
            $currencies[] = ['code' => $key, 'name' => $value];
        }

        return view('admin.jexactyl.store', [
            'enabled' => $this->settings->get($prefix . 'enabled', false),
            'paypal_enabled' => $this->settings->get($prefix . 'paypal:enabled', false),
            'stripe_enabled' => $this->settings->get($prefix . 'stripe:enabled', false),
            'selected_currency' => $this->settings->get($prefix . 'currency', 'USD'),
            'currencies' => $currencies,

            'earn_enabled' => $this->settings->get('jexactyl::earn:enabled', false),
            'earn_amount' => $this->settings->get('jexactyl::earn:amount', 1),

            'cpu' => $this->settings->get($prefix . 'cost:cpu', 100),
            'memory' => $this->settings->get($prefix . 'cost:memory', 50),
            'disk' => $this->settings->get($prefix . 'cost:disk', 25),
            'slot' => $this->settings->get($prefix . 'cost:slot', 250),
            'port' => $this->settings->get($prefix . 'cost:port', 20),
            'backup' => $this->settings->get($prefix . 'cost:backup', 20),
            'database' => $this->settings->get($prefix . 'cost:database', 20),

            'limit_cpu' => $this->settings->get($prefix . 'limit:cpu', 100),
            'limit_memory' => $this->settings->get($prefix . 'limit:memory', 4096),
            'limit_disk' => $this->settings->get($prefix . 'limit:disk', 10240),
            'limit_port' => $this->settings->get($prefix . 'limit:port', 1),
            'limit_backup' => $this->settings->get($prefix . 'limit:backup', 1),
            'limit_database' => $this->settings->get($prefix . 'limit:database', 1),
            'store_products' => $catalog,
            'store_products_json' => json_encode($catalog, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES),
        ]);
    }

    /**
     * Handle settings update.
     *
     * @throws DataValidationException
     * @throws RecordNotFoundException
     */
    public function update(StoreProductRequest $request): RedirectResponse
    {
        $normalized = $request->normalize();

        $catalog = $this->getCatalogPayload($request);
        unset($normalized['store:products'], $normalized['store:products:json']);

        foreach ($normalized as $key => $value) {
            $this->settings->set('jexactyl::' . $key, $value);
        }

        $this->settings->set('jexactyl::store:products', json_encode($catalog, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        $this->alert->success('If you have enabled a payment gateway, please remember to configure them. <a href="https://docs.jexactyl.com">Documentation</a>')->flash();

        return redirect()->route('admin.jexactyl.store');
    }

    private function getStoreProducts(): array
    {
        $setting = $this->settings->get('jexactyl::store:products');

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

    private function getCatalogPayload(StoreProductRequest $request): array
    {
        $catalog = $request->input('store:products', []);

        if ($request->filled('store:products:json')) {
            $decoded = json_decode($request->input('store:products:json'), true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $catalog = $decoded;
            }
        }

        return [
            'categories' => $this->normalizeCategories($catalog['categories'] ?? []),
            'products' => $this->normalizeProducts($catalog['products'] ?? []),
        ];
    }

    private function normalizeCategories(array $categories): array
    {
        $normalized = [];

        foreach ($categories as $category) {
            if (!is_array($category)) {
                continue;
            }

            $id = trim((string) ($category['id'] ?? ''));
            $name = trim((string) ($category['name'] ?? ''));

            if ($id === '' && $name === '') {
                continue;
            }

            $normalized[] = [
                'id' => $id,
                'name' => $name,
                'description' => trim((string) ($category['description'] ?? '')),
                'icon' => trim((string) ($category['icon'] ?? '')),
            ];
        }

        return $normalized;
    }

    private function normalizeProducts(array $products): array
    {
        $normalized = [];

        foreach ($products as $product) {
            if (!is_array($product)) {
                continue;
            }

            $id = trim((string) ($product['id'] ?? ''));
            $name = trim((string) ($product['name'] ?? ''));

            if ($id === '' && $name === '') {
                continue;
            }

            $specs = array_filter([
                'cpu' => trim((string) ($product['specs']['cpu'] ?? '')),
                'memory' => trim((string) ($product['specs']['memory'] ?? '')),
                'disk' => trim((string) ($product['specs']['disk'] ?? '')),
                'bandwidth' => trim((string) ($product['specs']['bandwidth'] ?? '')),
            ], static fn ($value) => $value !== '');

            $provisioning = array_filter([
                'cpu' => isset($product['provisioning']['cpu']) ? (int) $product['provisioning']['cpu'] : null,
                'memory' => isset($product['provisioning']['memory']) ? (int) $product['provisioning']['memory'] : null,
                'disk' => isset($product['provisioning']['disk']) ? (int) $product['provisioning']['disk'] : null,
                'ports' => isset($product['provisioning']['ports']) ? (int) $product['provisioning']['ports'] : null,
                'backups' => isset($product['provisioning']['backups']) ? (int) $product['provisioning']['backups'] : null,
                'databases' => isset($product['provisioning']['databases']) ? (int) $product['provisioning']['databases'] : null,
            ], static fn ($value) => $value !== null);

            $normalized[] = array_filter([
                'id' => $id,
                'name' => $name,
                'category' => trim((string) ($product['category'] ?? '')),
                'price' => isset($product['price']) ? (float) $product['price'] : null,
                'billing' => trim((string) ($product['billing'] ?? '')),
                'specs' => $specs,
                'tag' => trim((string) ($product['tag'] ?? '')),
                'region' => trim((string) ($product['region'] ?? '')),
                'highlight' => filter_var($product['highlight'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'features' => $this->cleanList($product['features'] ?? []),
                'badges' => $this->cleanList($product['badges'] ?? []),
                'cta' => trim((string) ($product['cta'] ?? '')),
                'provisioning' => $provisioning,
            ], static fn ($value) => $value !== null && $value !== '' && $value !== []);
        }

        return $normalized;
    }

    private function cleanList(array $items): array
    {
        return array_values(array_filter(array_map(static function ($item) {
            return trim((string) $item);
        }, $items), static fn ($item) => $item !== ''));
    }
}
