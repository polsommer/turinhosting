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
    $key = 'base64:' . base64_encode(random_bytes(32));

    if ($hasKeyLine) {
        $envContents = preg_replace('/^APP_KEY=.*$/m', 'APP_KEY=' . $key, $envContents);
    } else {
        $envContents = rtrim($envContents) . PHP_EOL . 'APP_KEY=' . $key . PHP_EOL;
    }

    file_put_contents($envPath, $envContents);
}
