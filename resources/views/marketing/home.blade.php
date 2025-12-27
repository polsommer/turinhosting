<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name', 'Everest') }} | Hosting for your next project</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        @vite('resources/css/app.css')
        <style>
            body {
                font-family: 'Inter', sans-serif;
            }
        </style>
    </head>
    <body class="bg-slate-950 text-white">
        <div class="min-h-screen">
            <header class="border-b border-white/10">
                <div class="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
                    <div class="text-lg font-semibold">{{ config('app.name', 'Everest') }}</div>
                    <nav class="flex items-center gap-4 text-sm text-white/80">
                        <a class="hover:text-white" href="#pricing">Pricing</a>
                        <a class="hover:text-white" href="#features">Features</a>
                        <a class="hover:text-white" href="#promos">Promos</a>
                        <a class="rounded-full border border-white/20 px-4 py-2 text-white hover:border-white/40" href="/auth/login">Sign in</a>
                    </nav>
                </div>
            </header>

            <main>
                <section class="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center">
                    <div class="flex-1">
                        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Launch faster</p>
                        <h1 class="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl">
                            Reliable hosting for teams that move fast.
                        </h1>
                        <p class="mt-6 text-lg text-white/70">
                            Everest delivers secure, scalable infrastructure with predictable pricing so you can focus on building
                            your next project instead of managing servers.
                        </p>
                        <div class="mt-8 flex flex-wrap gap-4">
                            <a class="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-cyan-300" href="/auth/register">
                                Get started
                            </a>
                            <a class="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-white/40" href="/auth/login">
                                View dashboard
                            </a>
                        </div>
                        <div class="mt-10 grid gap-4 text-sm text-white/70 sm:grid-cols-3">
                            <div>
                                <p class="text-2xl font-semibold text-white">99.9%</p>
                                <p>Uptime backed by SLA</p>
                            </div>
                            <div>
                                <p class="text-2xl font-semibold text-white">24/7</p>
                                <p>Expert support coverage</p>
                            </div>
                            <div>
                                <p class="text-2xl font-semibold text-white">5 min</p>
                                <p>Average provisioning</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex-1">
                        <div class="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 p-8 shadow-xl">
                            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200">Live platform</p>
                            <h2 class="mt-4 text-2xl font-semibold">Everything you need in one control plane.</h2>
                            <ul class="mt-6 space-y-4 text-sm text-white/70">
                                <li class="flex items-start gap-3">
                                    <span class="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-slate-900">✓</span>
                                    One-click deployments with prebuilt templates.
                                </li>
                                <li class="flex items-start gap-3">
                                    <span class="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-slate-900">✓</span>
                                    Automated backups and instant restores.
                                </li>
                                <li class="flex items-start gap-3">
                                    <span class="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400 text-slate-900">✓</span>
                                    Real-time metrics with alerting built in.
                                </li>
                            </ul>
                            <div class="mt-8 rounded-2xl border border-white/10 bg-slate-950/60 p-6">
                                <p class="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Latest uptime</p>
                                <div class="mt-3 flex items-center justify-between text-sm">
                                    <span class="text-white">All systems operational</span>
                                    <span class="rounded-full bg-emerald-400/20 px-3 py-1 text-emerald-200">Healthy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="pricing" class="border-t border-white/10 bg-slate-900/40">
                    <div class="mx-auto w-full max-w-6xl px-6 py-16">
                        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p class="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Pricing</p>
                                <h2 class="mt-4 text-3xl font-semibold">Plans built for every stage.</h2>
                                <a class="mt-3 inline-flex text-sm font-semibold text-cyan-200 hover:text-cyan-100" href="#compare">
                                    Compare plans →
                                </a>
                            </div>
                            <p class="max-w-md text-sm text-white/70">
                                Choose a plan that scales with you. Upgrade instantly as your team grows.
                            </p>
                        </div>
                        <div class="mt-10 grid gap-6 lg:grid-cols-3">
                            @foreach ($pricing['plans'] as $plan)
                                <div class="relative rounded-3xl border {{ $plan['highlight'] ? 'border-cyan-400/60 bg-gradient-to-br from-cyan-400/10 via-slate-900/70 to-slate-900/80 shadow-xl' : 'border-white/10 bg-slate-950/60' }} p-8">
                                    @if ($plan['promo_badge'])
                                        <span class="absolute right-6 top-6 rounded-full {{ $plan['highlight'] ? 'bg-cyan-400 text-slate-900' : 'bg-white/10 text-white' }} px-3 py-1 text-xs font-semibold">
                                            {{ $plan['promo_badge'] }}
                                        </span>
                                    @endif
                                    <p class="text-sm font-semibold uppercase tracking-[0.3em] {{ $plan['highlight'] ? 'text-cyan-200' : 'text-white/50' }}">
                                        {{ $plan['name'] }}
                                    </p>
                                    <p class="mt-4 text-3xl font-semibold">
                                        {{ $plan['price'] }}<span class="text-base font-normal text-white/60">{{ $plan['term'] }}</span>
                                    </p>
                                    <p class="mt-2 text-xs uppercase tracking-[0.2em] text-white/50">{{ $plan['billing_term'] }}</p>
                                    <ul class="mt-6 space-y-3 text-sm text-white/70">
                                        @foreach ($plan['specs'] as $spec)
                                            <li>{{ $spec }}</li>
                                        @endforeach
                                    </ul>
                                    <a class="mt-8 inline-flex w-full justify-center rounded-full {{ $plan['highlight'] ? 'bg-cyan-400 text-slate-900 hover:bg-cyan-300' : 'border border-white/20 text-white hover:border-white/40' }} px-4 py-3 text-sm font-semibold" href="{{ $plan['cta_url'] }}">
                                        {{ $plan['cta'] }}
                                    </a>
                                </div>
                            @endforeach
                        </div>
                        <div id="compare" class="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60">
                            <div class="border-b border-white/10 px-6 py-6 md:flex md:items-center md:justify-between">
                                <div>
                                    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Comparison</p>
                                    <h3 class="mt-3 text-2xl font-semibold">{{ $pricing['comparison']['headline'] }}</h3>
                                </div>
                                <p class="mt-4 text-sm text-white/70 md:mt-0">
                                    Quickly scan the differences and jump to the plan that fits your build.
                                </p>
                            </div>
                            <div class="grid gap-6 px-6 py-8 lg:grid-cols-4">
                                <div class="text-sm text-white/60">Specs</div>
                                @foreach ($pricing['plans'] as $plan)
                                    <div class="text-sm font-semibold {{ $plan['highlight'] ? 'text-cyan-200' : 'text-white' }}">
                                        {{ $plan['name'] }}
                                        @if ($plan['highlight'])
                                            <span class="ml-2 rounded-full bg-cyan-400/20 px-2 py-0.5 text-xs text-cyan-200">Most popular</span>
                                        @endif
                                    </div>
                                @endforeach
                                @foreach ($pricing['comparison']['rows'] as $row)
                                    <div class="border-t border-white/10 pt-4 text-sm text-white/70 lg:pt-6">{{ $row['label'] }}</div>
                                    @foreach ($row['values'] as $value)
                                        <div class="border-t border-white/10 pt-4 text-sm text-white lg:pt-6">{{ $value }}</div>
                                    @endforeach
                                @endforeach
                            </div>
                        </div>
                    </div>
                </section>

                <section id="promo-banner" class="border-t border-white/10">
                    <div class="mx-auto w-full max-w-6xl px-6 py-12">
                        <div class="rounded-3xl border border-cyan-400/40 bg-gradient-to-r from-cyan-500/10 via-slate-900/80 to-slate-900/90 p-8 md:flex md:items-center md:justify-between">
                            <div>
                                <p class="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">{{ $pricing['banner']['eyebrow'] }}</p>
                                <h3 class="mt-4 text-2xl font-semibold md:text-3xl">{{ $pricing['banner']['title'] }}</h3>
                                <p class="mt-3 text-sm text-white/70">{{ $pricing['banner']['description'] }}</p>
                            </div>
                            <a class="mt-6 inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-cyan-300 md:mt-0" href="{{ $pricing['banner']['cta_url'] }}">
                                {{ $pricing['banner']['cta'] }}
                            </a>
                        </div>
                    </div>
                </section>

                <section id="promos" class="border-t border-white/10">
                    <div class="mx-auto w-full max-w-6xl px-6 py-16">
                        <div class="grid gap-6 lg:grid-cols-3">
                            @foreach ($pricing['promos'] as $promo)
                                <div class="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
                                    <p class="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">{{ $promo['eyebrow'] }}</p>
                                    <h3 class="mt-3 text-xl font-semibold">{{ $promo['title'] }}</h3>
                                    <p class="mt-3 text-sm text-white/70">{{ $promo['description'] }}</p>
                                </div>
                            @endforeach
                        </div>
                    </div>
                </section>

                <section id="features" class="border-t border-white/10 bg-slate-900/40">
                    <div class="mx-auto w-full max-w-6xl px-6 py-16">
                        <div class="flex flex-col gap-4">
                            <p class="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Features</p>
                            <h2 class="text-3xl font-semibold">Everything your team needs to scale.</h2>
                        </div>
                        <div class="mt-10 grid gap-6 md:grid-cols-2">
                            <div class="rounded-2xl border border-white/10 bg-slate-950/50 p-6">
                                <h3 class="text-lg font-semibold">Global edge locations</h3>
                                <p class="mt-3 text-sm text-white/70">Deploy closer to your customers with zero configuration.</p>
                            </div>
                            <div class="rounded-2xl border border-white/10 bg-slate-950/50 p-6">
                                <h3 class="text-lg font-semibold">Built-in security</h3>
                                <p class="mt-3 text-sm text-white/70">SOC2-ready controls and automated patching.</p>
                            </div>
                            <div class="rounded-2xl border border-white/10 bg-slate-950/50 p-6">
                                <h3 class="text-lg font-semibold">Team collaboration</h3>
                                <p class="mt-3 text-sm text-white/70">Invite teammates, manage access, and audit activity.</p>
                            </div>
                            <div class="rounded-2xl border border-white/10 bg-slate-950/50 p-6">
                                <h3 class="text-lg font-semibold">Automated scaling</h3>
                                <p class="mt-3 text-sm text-white/70">Handle spikes without manual interventions.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="border-t border-white/10">
                    <div class="mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-16 text-center">
                        <p class="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Get started</p>
                        <h2 class="mt-4 text-3xl font-semibold">Launch your next project today.</h2>
                        <p class="mt-4 max-w-2xl text-sm text-white/70">
                            Create an account in minutes and experience the fastest way to deploy and manage your infrastructure.
                        </p>
                        <div class="mt-8 flex flex-wrap justify-center gap-4">
                            <a class="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-cyan-300" href="/auth/register">
                                Create account
                            </a>
                            <a class="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-white/40" href="/auth/login">
                                Log in
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <footer class="border-t border-white/10">
                <div class="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-xs text-white/50 md:flex-row">
                    <p>© {{ date('Y') }} {{ config('app.name', 'Everest') }}. All rights reserved.</p>
                    <div class="flex gap-4">
                        <a class="hover:text-white" href="/auth/login">Sign in</a>
                        <a class="hover:text-white" href="/auth/register">Register</a>
                    </div>
                </div>
            </footer>
        </div>
    </body>
</html>
