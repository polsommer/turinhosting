<?php

$root = dirname(__DIR__);
$envPath = $root . '/.env';
$examplePath = $root . '/.env.example';

if (!file_exists($envPath) && file_exists($examplePath)) {
    copy($examplePath, $envPath);
}

$envContents = file_exists($envPath) ? file_get_contents($envPath) : '';
$hasKeyLine = preg_match('/^APP_KEY=(.*)$/m', $envContents, $matches);
$keyValue = $hasKeyLine ? trim($matches[1]) : '';

if ($keyValue === '' || $keyValue === 'base64:') {
    $artisan = $root . '/artisan';
    $command = escapeshellarg(PHP_BINARY) . ' ' . escapeshellarg($artisan) . ' key:generate --ansi --force';
    passthru($command, $exitCode);

    if ($exitCode !== 0) {
        exit($exitCode);
    }
}
