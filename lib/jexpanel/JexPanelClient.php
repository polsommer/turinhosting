<?php

namespace JexPanel;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Log;

class JexPanelClient
{
    protected Client $client;

    public function __construct(?Client $client = null)
    {
        $this->client = $client ?? new Client([
            'timeout' => config('jexpanel.timeout'),
            'connect_timeout' => config('jexpanel.connect_timeout'),
            'http_errors' => false,
        ]);
    }

    public function createOrLinkUser(array $payload): array
    {
        if ($this->isMocked()) {
            return $this->mockResponse('createOrLinkUser', $payload);
        }

        return $this->request('POST', 'create_or_link_user', [
            'json' => $payload,
        ]);
    }

    public function getUserServers(string $userId): array
    {
        if ($this->isMocked()) {
            return $this->mockResponse('getUserServers', ['userId' => $userId]);
        }

        return $this->request('GET', 'get_user_servers', [], ['userId' => $userId]);
    }

    public function getServerDetails(string $serverId): array
    {
        if ($this->isMocked()) {
            return $this->mockResponse('getServerDetails', ['serverId' => $serverId]);
        }

        return $this->request('GET', 'get_server_details', [], ['serverId' => $serverId]);
    }

    public function getProvisioningStatus(string $serverId): array
    {
        if ($this->isMocked()) {
            return $this->mockResponse('getProvisioningStatus', ['serverId' => $serverId]);
        }

        return $this->request('GET', 'get_provisioning_status', [], ['serverId' => $serverId]);
    }

    public function suspendServer(string $serverId, array $payload = []): array
    {
        if ($this->isMocked()) {
            return $this->mockResponse('suspendServer', ['serverId' => $serverId] + $payload);
        }

        return $this->request('POST', 'suspend_server', [
            'json' => $payload,
        ], ['serverId' => $serverId]);
    }

    public function unsuspendServer(string $serverId, array $payload = []): array
    {
        if ($this->isMocked()) {
            return $this->mockResponse('unsuspendServer', ['serverId' => $serverId] + $payload);
        }

        return $this->request('POST', 'unsuspend_server', [
            'json' => $payload,
        ], ['serverId' => $serverId]);
    }

    protected function request(string $method, string $endpointKey, array $options = [], array $pathParams = []): array
    {
        $baseUrl = rtrim((string) config('jexpanel.base_url'), '/');
        $endpoint = $this->resolveEndpoint($endpointKey, $pathParams);
        $url = $baseUrl . $endpoint;
        $headers = [
            'Accept' => 'application/json',
            'Authorization' => 'Bearer ' . config('jexpanel.admin_api_key'),
        ];

        $options = array_merge([
            'headers' => $headers,
        ], $options);

        $maxAttempts = (int) config('jexpanel.retry.max_attempts');
        $baseDelayMs = (int) config('jexpanel.retry.base_delay_ms');
        $maxDelayMs = (int) config('jexpanel.retry.max_delay_ms');

        $attempt = 0;
        $lastError = null;

        while ($attempt < $maxAttempts) {
            $attempt++;

            try {
                Log::info('JexPanel request started', [
                    'endpoint' => $endpointKey,
                    'method' => $method,
                    'url' => $url,
                    'attempt' => $attempt,
                ]);

                $response = $this->client->request($method, $url, $options);
                $status = $response->getStatusCode();
                $body = (string) $response->getBody();
                $data = json_decode($body, true);

                Log::info('JexPanel request completed', [
                    'endpoint' => $endpointKey,
                    'method' => $method,
                    'status' => $status,
                    'attempt' => $attempt,
                ]);

                if ($this->shouldRetry($status)) {
                    $lastError = [
                        'status' => $status,
                        'body' => $body,
                    ];
                    $this->sleepWithBackoff($attempt, $baseDelayMs, $maxDelayMs);
                    continue;
                }

                return [
                    'status' => $status,
                    'data' => $data ?? $body,
                ];
            } catch (RequestException $exception) {
                $lastError = [
                    'message' => $exception->getMessage(),
                ];

                Log::warning('JexPanel request failed', [
                    'endpoint' => $endpointKey,
                    'method' => $method,
                    'attempt' => $attempt,
                    'error' => $exception->getMessage(),
                ]);

                $this->sleepWithBackoff($attempt, $baseDelayMs, $maxDelayMs);
            }
        }

        Log::error('JexPanel request exhausted retries', [
            'endpoint' => $endpointKey,
            'method' => $method,
            'error' => $lastError,
        ]);

        return [
            'status' => 0,
            'data' => $lastError,
        ];
    }

    protected function resolveEndpoint(string $endpointKey, array $pathParams = []): string
    {
        $endpoint = config("jexpanel.endpoints.{$endpointKey}");

        foreach ($pathParams as $key => $value) {
            $endpoint = str_replace('{' . $key . '}', $value, $endpoint);
        }

        return $endpoint;
    }

    protected function shouldRetry(int $status): bool
    {
        return $status >= 500 || $status === 429;
    }

    protected function sleepWithBackoff(int $attempt, int $baseDelayMs, int $maxDelayMs): void
    {
        $delayMs = min($baseDelayMs * (2 ** max(0, $attempt - 1)), $maxDelayMs);
        usleep($delayMs * 1000);
    }

    protected function isMocked(): bool
    {
        return (bool) config('jexpanel.mock');
    }

    protected function mockResponse(string $action, array $payload): array
    {
        Log::info('JexPanel mock response used', [
            'action' => $action,
            'payload' => $payload,
        ]);

        return [
            'status' => 200,
            'data' => [
                'mocked' => true,
                'action' => $action,
                'payload' => $payload,
                'timestamp' => now()->toIso8601String(),
            ],
        ];
    }
}
