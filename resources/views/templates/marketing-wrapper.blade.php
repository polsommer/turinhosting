<!DOCTYPE html>
<html lang="en">
    <head>
        @php
            $defaultTitle = config('app.name', 'Everest') . ' | Hosting for your next project';
            $defaultDescription = 'Everest delivers secure, scalable infrastructure with predictable pricing so you can focus on building your next project.';
            $pageTitle = trim($__env->yieldContent('title', $defaultTitle));
            $pageDescription = trim($__env->yieldContent('description', $defaultDescription));
            $pageImage = trim($__env->yieldContent('social_image', asset('favicons/android-chrome-512x512.png')));
            $pageUrl = url()->current();
        @endphp

        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ $pageTitle }}</title>
        <meta name="description" content="{{ $pageDescription }}">
        <link rel="canonical" href="{{ $pageUrl }}">
        <meta property="og:title" content="{{ $pageTitle }}">
        <meta property="og:description" content="{{ $pageDescription }}">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ $pageUrl }}">
        <meta property="og:image" content="{{ $pageImage }}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $pageTitle }}">
        <meta name="twitter:description" content="{{ $pageDescription }}">
        <meta name="twitter:image" content="{{ $pageImage }}">
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
        <link rel="icon" type="image/png" href="/favicons/favicon-32x32.png" sizes="32x32">
        <link rel="icon" type="image/png" href="/favicons/favicon-16x16.png" sizes="16x16">
        <link rel="manifest" href="/favicons/manifest.json">
        <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#bc6e3c">
        <link rel="shortcut icon" href="/favicons/favicon.ico">
        <meta name="msapplication-config" content="/favicons/browserconfig.xml">
        <meta name="theme-color" content="#0e4688">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        @vite('resources/css/app.css')
        <style>
            body {
                font-family: 'Inter', sans-serif;
            }
        </style>
        @yield('assets')
    </head>
    <body class="@yield('body-class', 'bg-slate-950 text-white')">
        @yield('content')
    </body>
</html>
