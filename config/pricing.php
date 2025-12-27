<?php

return [
    'plans' => [
        [
            'name' => 'Starter',
            'price' => '$12',
            'term' => '/mo',
            'billing_term' => 'Monthly billing',
            'specs' => [
                '1 vCPU',
                '2GB RAM',
                '40GB NVMe SSD',
                '2TB transfer',
            ],
            'highlight' => false,
            'promo_badge' => null,
            'cta' => 'Start Starter',
            'cta_url' => '/auth/register',
        ],
        [
            'name' => 'Growth',
            'price' => '$29',
            'term' => '/mo',
            'billing_term' => 'Monthly billing',
            'specs' => [
                '2 vCPU',
                '4GB RAM',
                '80GB NVMe SSD',
                '4TB transfer',
            ],
            'highlight' => true,
            'promo_badge' => 'Most popular',
            'cta' => 'Choose Growth',
            'cta_url' => '/auth/register',
        ],
        [
            'name' => 'Scale',
            'price' => '$59',
            'term' => '/mo',
            'billing_term' => 'Monthly billing',
            'specs' => [
                '4 vCPU',
                '8GB RAM',
                '160GB NVMe SSD',
                '8TB transfer',
            ],
            'highlight' => false,
            'promo_badge' => 'Best value',
            'cta' => 'Go Scale',
            'cta_url' => '/auth/register',
        ],
    ],
    'promos' => [
        [
            'eyebrow' => 'Promo',
            'title' => 'Launch credits',
            'description' => 'Get $200 in credits when you sign up today.',
        ],
        [
            'eyebrow' => 'Promo',
            'title' => 'Migration assistance',
            'description' => 'We help you move workloads in a single afternoon.',
        ],
        [
            'eyebrow' => 'Promo',
            'title' => 'Annual savings',
            'description' => 'Save 15% when you commit to a yearly plan.',
        ],
    ],
    'banner' => [
        'eyebrow' => 'Limited time',
        'title' => 'Deploy your first VPS today and save 20% for 3 months.',
        'description' => 'Secure your launch pricing and lock in predictable infrastructure costs.',
        'cta' => 'Claim offer',
        'cta_url' => '/auth/register',
    ],
    'comparison' => [
        'headline' => 'Compare VPS plans at a glance.',
        'rows' => [
            [
                'label' => 'vCPU',
                'values' => ['1', '2', '4'],
            ],
            [
                'label' => 'Memory',
                'values' => ['2GB', '4GB', '8GB'],
            ],
            [
                'label' => 'Storage',
                'values' => ['40GB NVMe', '80GB NVMe', '160GB NVMe'],
            ],
            [
                'label' => 'Transfer',
                'values' => ['2TB', '4TB', '8TB'],
            ],
            [
                'label' => 'Support',
                'values' => ['Community', 'Priority', '24/7'],
            ],
        ],
    ],
];
