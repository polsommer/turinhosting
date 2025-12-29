<?php

namespace Jexactyl\Services\Storefront;

class StoreLayoutService
{
    public static function fromSetting($setting): array
    {
        if (is_string($setting) && $setting !== '') {
            $decoded = json_decode($setting, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                return self::normalize($decoded);
            }
        }

        if (is_array($setting)) {
            return self::normalize($setting);
        }

        return self::defaultLayout();
    }

    public static function defaultLayout(): array
    {
        return config('jexactyl.store_layout', [
            'overview' => [
                ['type' => 'hero'],
                ['type' => 'featured'],
                ['type' => 'catalog'],
            ],
            'resources' => [
                ['type' => 'resource-hero'],
                ['type' => 'resource-grid'],
                ['type' => 'resource-tips'],
                ['type' => 'resource-cta'],
            ],
            'purchase' => [
                ['type' => 'purchase-hero'],
                ['type' => 'balance-summary'],
                ['type' => 'earnings'],
            ],
            'create' => [
                ['type' => 'create-hero'],
                ['type' => 'create-cta'],
            ],
        ]);
    }

    public static function normalize($layout): array
    {
        $defaults = self::defaultLayout();

        if (!is_array($layout)) {
            return $defaults;
        }

        if (empty($layout['purchase']) && isset($layout['balance'])) {
            $layout['purchase'] = $layout['balance'];
        }

        return [
            'overview' => self::normalizeSection($layout['overview'] ?? null, $defaults['overview'] ?? []),
            'resources' => self::normalizeSection($layout['resources'] ?? null, $defaults['resources'] ?? []),
            'purchase' => self::normalizeSection($layout['purchase'] ?? null, $defaults['purchase'] ?? []),
            'create' => self::normalizeSection($layout['create'] ?? null, $defaults['create'] ?? []),
        ];
    }

    private static function normalizeSection($section, array $fallback): array
    {
        if (!is_array($section)) {
            return $fallback;
        }

        if ($section === []) {
            return [];
        }

        $blocks = [];

        foreach ($section as $block) {
            if (!is_array($block)) {
                continue;
            }

            $type = trim((string) ($block['type'] ?? ''));
            if ($type === '') {
                continue;
            }

            $blocks[] = self::normalizeBlock($type, $block);
        }

        return $blocks ?: $fallback;
    }

    private static function normalizeBlock(string $type, array $block): array
    {
        switch ($type) {
            case 'resource-hero':
                return self::normalizeResourceHeroBlock($block);
            case 'featured':
                return self::normalizeFeaturedBlock($block);
            case 'catalog':
                return self::normalizeCatalogBlock($block);
            case 'resource-grid':
                return self::normalizeResourceGridBlock($block);
            case 'resource-tips':
                return self::normalizeResourceTipsBlock($block);
            case 'resource-cta':
                return self::normalizeResourceCtaBlock($block);
            case 'purchase-hero':
                return self::normalizePurchaseHeroBlock($block);
            case 'balance-summary':
                return self::normalizeBalanceSummaryBlock($block);
            case 'earnings':
                return self::normalizeEarningsBlock($block);
            case 'create-hero':
                return self::normalizeCreateHeroBlock($block);
            case 'create-cta':
                return self::normalizeCreateCtaBlock($block);
            default:
                return array_merge($block, ['type' => $type]);
        }
    }

    private static function normalizeFeaturedBlock(array $block): array
    {
        $defaults = [
            'type' => 'featured',
            'title' => self::cleanString($block['title'] ?? 'Featured VPS plans'),
            'description' => self::cleanString($block['description'] ?? 'Highlight the most popular VPS packages.'),
            'productIds' => self::cleanList($block['productIds'] ?? []),
            'categoryIds' => self::cleanList($block['categoryIds'] ?? []),
            'limit' => isset($block['limit']) ? max(1, (int) $block['limit']) : null,
        ];

        return array_merge($defaults, $block, ['type' => 'featured']);
    }

    private static function normalizeCatalogBlock(array $block): array
    {
        $defaults = [
            'type' => 'catalog',
            'title' => self::cleanString($block['title'] ?? 'Shop'),
            'description' => self::cleanString($block['description'] ?? 'Browse VPS plans built for production workloads, staging, and personal projects.'),
        ];

        return array_merge($defaults, $block, ['type' => 'catalog']);
    }

    private static function normalizeResourceGridBlock(array $block): array
    {
        $resources = self::cleanList($block['resources'] ?? []);
        if ($resources === []) {
            $resources = ['cpu', 'memory', 'disk', 'slot', 'port', 'backup', 'database'];
        }

        $defaults = [
            'type' => 'resource-grid',
            'resources' => $resources,
        ];

        return array_merge($defaults, $block, ['type' => 'resource-grid', 'resources' => $resources]);
    }

    private static function normalizeResourceHeroBlock(array $block): array
    {
        $defaults = [
            'type' => 'resource-hero',
            'eyebrow' => self::cleanString($block['eyebrow'] ?? 'Resource Add-ons'),
            'title' => self::cleanString($block['title'] ?? 'Boost your VPS in seconds'),
            'description' => self::cleanString($block['description'] ?? 'Top up CPU, RAM, storage, and more instantly. Changes apply right away.'),
            'highlights' => self::cleanList($block['highlights'] ?? ['Instant activation', 'Pay with balance', 'No downtime']),
        ];

        return array_merge($defaults, $block, [
            'type' => 'resource-hero',
            'highlights' => $defaults['highlights'],
        ]);
    }

    private static function normalizeResourceTipsBlock(array $block): array
    {
        $defaults = [
            'type' => 'resource-tips',
            'title' => self::cleanString($block['title'] ?? 'How to use resources'),
        ];

        return array_merge($defaults, $block, ['type' => 'resource-tips']);
    }

    private static function normalizeResourceCtaBlock(array $block): array
    {
        $defaults = [
            'type' => 'resource-cta',
            'title' => self::cleanString($block['title'] ?? 'Ready to get started?'),
            'description' => self::cleanString($block['description'] ?? ''),
            'link' => self::cleanString($block['link'] ?? '/store/create'),
            'linkLabel' => self::cleanString($block['linkLabel'] ?? 'Create a server'),
        ];

        return array_merge($defaults, $block, ['type' => 'resource-cta']);
    }

    private static function normalizePurchaseHeroBlock(array $block): array
    {
        $defaults = [
            'type' => 'purchase-hero',
            'eyebrow' => self::cleanString($block['eyebrow'] ?? 'Secure Checkout'),
            'title' => self::cleanString($block['title'] ?? 'Add credits for faster VPS launches'),
            'description' => self::cleanString($block['description'] ?? 'Top up once and spend instantly on plans, upgrades, and renewals.'),
            'highlights' => self::cleanList($block['highlights'] ?? ['Stripe & PayPal', 'Secure payments', 'Spend immediately']),
        ];

        return array_merge($defaults, $block, [
            'type' => 'purchase-hero',
            'highlights' => $defaults['highlights'],
        ]);
    }

    private static function normalizeBalanceSummaryBlock(array $block): array
    {
        $defaults = [
            'type' => 'balance-summary',
            'balanceTitle' => self::cleanString($block['balanceTitle'] ?? 'Account Balance'),
            'gatewaysTitle' => self::cleanString($block['gatewaysTitle'] ?? 'Add Funds'),
        ];

        return array_merge($defaults, $block, ['type' => 'balance-summary']);
    }

    private static function normalizeEarningsBlock(array $block): array
    {
        $defaults = [
            'type' => 'earnings',
            'title' => self::cleanString($block['title'] ?? 'Idle Balance Earnings'),
            'description' => self::cleanString($block['description'] ?? 'See how much you will earn per minute while AFK.'),
        ];

        return array_merge($defaults, $block, ['type' => 'earnings']);
    }

    private static function normalizeCreateHeroBlock(array $block): array
    {
        $defaults = [
            'type' => 'create-hero',
            'eyebrow' => self::cleanString($block['eyebrow'] ?? 'Launch Flow'),
            'title' => self::cleanString($block['title'] ?? 'Build the exact VPS you need'),
            'description' => self::cleanString($block['description'] ?? 'Start with a plan or customize every resource, then deploy in minutes.'),
            'steps' => self::cleanSteps($block['steps'] ?? [
                ['title' => 'Configure', 'description' => 'Set CPU, RAM, and storage.'],
                ['title' => 'Select', 'description' => 'Pick node, nest, and egg.'],
                ['title' => 'Deploy', 'description' => 'Review and launch instantly.'],
            ]),
        ];

        return array_merge($defaults, $block, [
            'type' => 'create-hero',
            'steps' => $defaults['steps'],
        ]);
    }

    private static function normalizeCreateCtaBlock(array $block): array
    {
        $defaults = [
            'type' => 'create-cta',
            'title' => self::cleanString($block['title'] ?? 'Need more resources or credits?'),
            'description' => self::cleanString($block['description'] ?? 'Visit the store to add resources or funds before checkout.'),
            'links' => self::cleanLinks($block['links'] ?? [
                ['label' => 'Add resources', 'href' => '/store/resources'],
                ['label' => 'Add credits', 'href' => '/store/credits'],
            ]),
        ];

        return array_merge($defaults, $block, [
            'type' => 'create-cta',
            'links' => $defaults['links'],
        ]);
    }

    private static function cleanList($items): array
    {
        if (!is_array($items)) {
            return [];
        }

        return array_values(array_filter(array_map(static function ($item) {
            return trim((string) $item);
        }, $items), static fn ($item) => $item !== ''));
    }

    private static function cleanSteps($items): array
    {
        if (!is_array($items)) {
            return [];
        }

        $steps = [];

        foreach ($items as $item) {
            if (!is_array($item)) {
                continue;
            }

            $title = self::cleanString($item['title'] ?? '');
            $description = self::cleanString($item['description'] ?? '');
            if ($title === '' && $description === '') {
                continue;
            }

            $steps[] = [
                'title' => $title,
                'description' => $description,
            ];
        }

        return $steps;
    }

    private static function cleanLinks($items): array
    {
        if (!is_array($items)) {
            return [];
        }

        $links = [];

        foreach ($items as $item) {
            if (!is_array($item)) {
                continue;
            }

            $label = self::cleanString($item['label'] ?? '');
            $href = self::cleanString($item['href'] ?? '');
            if ($label === '' || $href === '') {
                continue;
            }

            $links[] = [
                'label' => $label,
                'href' => $href,
            ];
        }

        return $links;
    }

    private static function cleanString($value): string
    {
        return trim((string) $value);
    }
}
