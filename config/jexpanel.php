<?php

return [
    'base_url' => env('JEXPANEL_BASE_URL'),
    'admin_api_key' => env('JEXPANEL_ADMIN_API_KEY'),
    'mock' => env('MOCK_JEXPANEL', false),
    'timeout' => env('JEXPANEL_TIMEOUT', 10),
    'connect_timeout' => env('JEXPANEL_CONNECT_TIMEOUT', 5),
    'retry' => [
        'max_attempts' => env('JEXPANEL_RETRY_MAX_ATTEMPTS', 3),
        'base_delay_ms' => env('JEXPANEL_RETRY_BASE_DELAY_MS', 200),
        'max_delay_ms' => env('JEXPANEL_RETRY_MAX_DELAY_MS', 2000),
    ],
    'endpoints' => [
        'create_or_link_user' => '/admin/users/link-or-create',
        'get_user_servers' => '/admin/users/{userId}/servers',
        'get_server_details' => '/admin/servers/{serverId}',
        'get_provisioning_status' => '/admin/servers/{serverId}/provisioning',
        'suspend_server' => '/admin/servers/{serverId}/suspend',
        'unsuspend_server' => '/admin/servers/{serverId}/unsuspend',
    ],
];
