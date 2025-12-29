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
                ['type' => 'resource-grid'],
                ['type' => 'resource-tips'],
                ['type' => 'resource-cta'],
            ],
            'purchase' => [
                ['type' => 'balance-summary'],
                ['type' => 'earnings'],
            ],
        ]);
    }

    public static function normalize($layout): array
    {
        $defaults = self::defaultLayout();

        if (!is_array($layout)) {
            return $defaults;
        }

        return [
            'overview' => self::normalizeSection($layout['overview'] ?? null, $defaults['overview'] ?? []),
            'resources' => self::normalizeSection($layout['resources'] ?? null, $defaults['resources'] ?? []),
            'purchase' => self::normalizeSection($layout['purchase'] ?? null, $defaults['purchase'] ?? []),
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
            case 'balance-summary':
                return self::normalizeBalanceSummaryBlock($block);
            case 'earnings':
                return self::normalizeEarningsBlock($block);
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

    private static function cleanList($items): array
    {
        if (!is_array($items)) {
            return [];
        }

        return array_values(array_filter(array_map(static function ($item) {
            return trim((string) $item);
        }, $items), static fn ($item) => $item !== ''));
    }

    private static function cleanString($value): string
    {
        return trim((string) $value);
    }
}
