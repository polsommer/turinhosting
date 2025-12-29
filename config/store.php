<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Jexactyl Storefront Settings
    |--------------------------------------------------------------------------
    |
    | This configuration file is used to interact with the app in order to
    | get and set configurations for the Jexactyl Storefront.
    |
    */

    'currencies' => [
        'EUR' => 'Euro',
        'USD' => 'US Dollar',
        'JPY' => 'Japanese Yen',
        'GBP' => 'Pound Sterling',
        'CAD' => 'Canadian Dollar',
        'AUD' => 'Australian Dollar',
    ],

    /*
    |--------------------------------------------------------------------------
    | Storefront Product Catalog
    |--------------------------------------------------------------------------
    |
    | Define the products available in the storefront. These are surfaced via
    | the client API and used to populate the Shop landing experience.
    |
    */

    'products' => [
        'categories' => [
            [
                'id' => 'vps-hosting',
                'name' => 'VPS Hosting',
                'description' => 'Performance-focused virtual machines for projects, bots, and web apps.',
                'products' => [
                    [
                        'id' => 'vps-starter',
                        'name' => 'VPS Starter',
                        'description' => 'An entry plan for lightweight services.',
                        'type' => 'vps',
                        'price' => 5,
                        'billing' => 'month',
                        'specs' => [
                            'cpu' => '2 vCPU',
                            'memory' => '4 GB RAM',
                            'disk' => '80 GB NVMe',
                            'bandwidth' => '3 TB',
                        ],
                        'resources' => [
                            'cpu' => 200,
                            'memory' => 4096,
                            'disk' => 81920,
                            'ports' => 1,
                            'backups' => 1,
                            'databases' => 1,
                        ],
                    ],
                    [
                        'id' => 'vps-growth',
                        'name' => 'VPS Growth',
                        'description' => 'Balanced resources for production workloads.',
                        'type' => 'vps',
                        'price' => 12,
                        'billing' => 'month',
                        'specs' => [
                            'cpu' => '4 vCPU',
                            'memory' => '8 GB RAM',
                            'disk' => '160 GB NVMe',
                            'bandwidth' => '6 TB',
                        ],
                        'resources' => [
                            'cpu' => 400,
                            'memory' => 8192,
                            'disk' => 163840,
                            'ports' => 2,
                            'backups' => 2,
                            'databases' => 2,
                        ],
                    ],
                    [
                        'id' => 'vps-scale',
                        'name' => 'VPS Scale',
                        'description' => 'High-memory instances for demanding applications.',
                        'type' => 'vps',
                        'price' => 24,
                        'billing' => 'month',
                        'specs' => [
                            'cpu' => '8 vCPU',
                            'memory' => '16 GB RAM',
                            'disk' => '320 GB NVMe',
                            'bandwidth' => '10 TB',
                        ],
                        'resources' => [
                            'cpu' => 800,
                            'memory' => 16384,
                            'disk' => 327680,
                            'ports' => 3,
                            'backups' => 3,
                            'databases' => 3,
                        ],
                    ],
                ],
            ],
            [
                'id' => 'game-servers',
                'name' => 'Game Servers',
                'description' => 'Deploy community-ready game servers in seconds.',
                'products' => [
                    [
                        'id' => 'game-squad',
                        'name' => 'Squad Builder',
                        'description' => 'Perfect for small co-op and survival servers.',
                        'type' => 'game',
                        'price' => 6,
                        'billing' => 'month',
                        'specs' => [
                            'cpu' => '3 vCPU',
                            'memory' => '6 GB RAM',
                            'disk' => '60 GB SSD',
                            'bandwidth' => '2 TB',
                        ],
                        'resources' => [
                            'cpu' => 300,
                            'memory' => 6144,
                            'disk' => 61440,
                            'ports' => 2,
                            'backups' => 2,
                            'databases' => 1,
                        ],
                    ],
                    [
                        'id' => 'game-party',
                        'name' => 'Party Host',
                        'description' => 'Optimized for mid-sized multiplayer communities.',
                        'type' => 'game',
                        'price' => 14,
                        'billing' => 'month',
                        'specs' => [
                            'cpu' => '6 vCPU',
                            'memory' => '12 GB RAM',
                            'disk' => '120 GB SSD',
                            'bandwidth' => '4 TB',
                        ],
                        'resources' => [
                            'cpu' => 600,
                            'memory' => 12288,
                            'disk' => 122880,
                            'ports' => 3,
                            'backups' => 3,
                            'databases' => 2,
                        ],
                    ],
                    [
                        'id' => 'game-legend',
                        'name' => 'Legend Tier',
                        'description' => 'High-performance setup for large player counts.',
                        'type' => 'game',
                        'price' => 28,
                        'billing' => 'month',
                        'specs' => [
                            'cpu' => '10 vCPU',
                            'memory' => '24 GB RAM',
                            'disk' => '200 GB SSD',
                            'bandwidth' => '8 TB',
                        ],
                        'resources' => [
                            'cpu' => 1000,
                            'memory' => 24576,
                            'disk' => 204800,
                            'ports' => 4,
                            'backups' => 4,
                            'databases' => 3,
                        ],
                    ],
                ],
            ],
        ],
    ],
];
