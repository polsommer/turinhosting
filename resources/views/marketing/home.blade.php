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
                            </div>
                            <p class="max-w-md text-sm text-white/70">
                                Choose a plan that scales with you. Upgrade instantly as your team grows.
                            </p>
                        </div>
                        <div class="mt-10 grid gap-6 lg:grid-cols-3">
                            <div class="rounded-3xl border border-white/10 bg-slate-950/60 p-8">
                                <p class="text-sm font-semibold uppercase tracking-[0.3em] text-white/50">Starter</p>
                                <p class="mt-4 text-3xl font-semibold">$19<span class="text-base font-normal text-white/60">/mo</span></p>
                                <ul class="mt-6 space-y-3 text-sm text-white/70">
                                    <li>1 workspace</li>
                                    <li>Community support</li>
                                    <li>5 projects</li>
                                </ul>
                                <a class="mt-8 inline-flex w-full justify-center rounded-full border border-white/20 px-4 py-3 text-sm font-semibold text-white hover:border-white/40" href="/auth/register">Start free</a>
                            </div>
                            <div class="rounded-3xl border border-cyan-400/40 bg-gradient-to-br from-cyan-400/10 via-slate-900/70 to-slate-900/80 p-8 shadow-xl">
                                <p class="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">Growth</p>
                                <p class="mt-4 text-3xl font-semibold">$59<span class="text-base font-normal text-white/60">/mo</span></p>
                                <ul class="mt-6 space-y-3 text-sm text-white/70">
                                    <li>10 workspaces</li>
                                    <li>Priority support</li>
                                    <li>Unlimited projects</li>
                                </ul>
                                <a class="mt-8 inline-flex w-full justify-center rounded-full bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-cyan-300" href="/auth/register">Choose Growth</a>
                            </div>
                            <div class="rounded-3xl border border-white/10 bg-slate-950/60 p-8">
                                <p class="text-sm font-semibold uppercase tracking-[0.3em] text-white/50">Enterprise</p>
                                <p class="mt-4 text-3xl font-semibold">Custom</p>
                                <ul class="mt-6 space-y-3 text-sm text-white/70">
                                    <li>Dedicated infrastructure</li>
                                    <li>24/7 phone support</li>
                                    <li>Compliance reporting</li>
                                </ul>
                                <a class="mt-8 inline-flex w-full justify-center rounded-full border border-white/20 px-4 py-3 text-sm font-semibold text-white hover:border-white/40" href="/auth/register">Talk to sales</a>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="promos" class="border-t border-white/10">
                    <div class="mx-auto w-full max-w-6xl px-6 py-16">
                        <div class="grid gap-6 lg:grid-cols-3">
                            <div class="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
                                <p class="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Promo</p>
                                <h3 class="mt-3 text-xl font-semibold">Launch credits</h3>
                                <p class="mt-3 text-sm text-white/70">Get $200 in credits when you sign up today.</p>
                            </div>
                            <div class="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
                                <p class="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Promo</p>
                                <h3 class="mt-3 text-xl font-semibold">Migration assistance</h3>
                                <p class="mt-3 text-sm text-white/70">We help you move workloads in a single afternoon.</p>
                            </div>
                            <div class="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
                                <p class="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Promo</p>
                                <h3 class="mt-3 text-xl font-semibold">Annual savings</h3>
                                <p class="mt-3 text-sm text-white/70">Save 15% when you commit to a yearly plan.</p>
                            </div>
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
