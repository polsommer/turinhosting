import { useMemo } from 'react';
import { useStoreState } from '@/state/hooks';

const LandingPage = () => {
    const { name } = useStoreState(state => state.settings.data!);
    const theme = useStoreState(state => state.theme.data!);

    const highlights = useMemo(
        () => [
            { label: 'Global datacenters', value: '12+' },
            { label: 'Uptime guarantee', value: '99.99%' },
            { label: 'Avg. deploy time', value: '45s' },
            { label: 'Support response', value: '< 15 min' },
        ],
        [],
    );

    const features = useMemo(
        () => [
            {
                title: 'JexPanel control, refined',
                description:
                    'Launch, scale, and monitor your VPS from a polished control panel designed for clarity and speed.',
            },
            {
                title: 'Instant provisioning',
                description: 'Spin up production-ready VPS instances in minutes with automated images and backups.',
            },
            {
                title: 'Performance-first hardware',
                description: 'NVMe storage, next-gen CPUs, and optimized network routing for consistent throughput.',
            },
            {
                title: 'Security baked in',
                description: 'DDoS protection, isolated networks, and scheduled snapshots keep your data protected.',
            },
            {
                title: 'Easy navigation',
                description: 'A clean, intuitive layout helps teams find the tools they need without hunting for them.',
            },
            {
                title: '24/7 expert support',
                description: 'Real people, fast answers, and proactive monitoring whenever you need help.',
            },
        ],
        [],
    );

    const plans = useMemo(
        () => [
            {
                name: 'Starter VPS',
                price: '$9',
                cadence: '/mo',
                description: 'Launch personal projects with reliable, fast storage.',
                specs: ['2 vCPU', '4 GB RAM', '80 GB NVMe', '2 TB transfer', '1 snapshot'],
            },
            {
                name: 'Developer VPS',
                price: '$16',
                cadence: '/mo',
                description: 'Ideal for staging, CI runners, and feature branches.',
                specs: ['3 vCPU', '6 GB RAM', '120 GB NVMe', '3 TB transfer', '3 snapshots'],
            },
            {
                name: 'Growth VPS',
                price: '$24',
                cadence: '/mo',
                description: 'Balanced performance for teams and SaaS workloads.',
                specs: ['4 vCPU', '8 GB RAM', '160 GB NVMe', '4 TB transfer', 'Weekly backups'],
                featured: true,
            },
            {
                name: 'Business VPS',
                price: '$36',
                cadence: '/mo',
                description: 'Scale revenue workloads with dedicated resources.',
                specs: ['6 vCPU', '12 GB RAM', '240 GB NVMe', '6 TB transfer', 'Daily backups'],
            },
            {
                name: 'Scale VPS',
                price: '$48',
                cadence: '/mo',
                description: 'High-throughput infrastructure for demanding workloads.',
                specs: ['8 vCPU', '16 GB RAM', '320 GB NVMe', '8 TB transfer', 'Advanced monitoring'],
            },
            {
                name: 'Enterprise VPS',
                price: '$96',
                cadence: '/mo',
                description: 'Mission-critical performance with priority routing.',
                specs: ['16 vCPU', '32 GB RAM', '640 GB NVMe', '12 TB transfer', 'Priority support'],
            },
        ],
        [],
    );

    const addOns = useMemo(
        () => [
            { title: 'Managed backups', description: 'Automated daily backups with 30-day retention.' },
            { title: 'Private networking', description: 'Isolated VLANs for secure internal traffic.' },
            { title: 'Load balancers', description: 'Route traffic across VPS clusters with zero downtime.' },
            { title: 'GPU nodes', description: 'Accelerate AI, rendering, and compute-heavy workloads.' },
        ],
        [],
    );

    const testimonials = useMemo(
        () => [
            {
                quote: 'The JexPanel UI makes it effortless to scale and keeps our team moving fast.',
                name: 'Nora West',
                title: 'CTO, CloudBridge',
            },
            {
                quote: 'We migrated 40 VPS in a weekend thanks to the onboarding team and automated tooling.',
                name: 'Hector Ruiz',
                title: 'Ops Lead, Relay Labs',
            },
            {
                quote: 'The performance is consistently strong and the support team is always on it.',
                name: 'Priya Patel',
                title: 'Founder, FluxHQ',
            },
        ],
        [],
    );

    const faqs = useMemo(
        () => [
            {
                question: 'Can I upgrade or downgrade plans any time?',
                answer: 'Yes. You can resize your VPS instantly without migrating data or changing IPs.',
            },
            {
                question: 'Do you support custom images?',
                answer: 'Upload your own image or select from optimized Ubuntu, Debian, and AlmaLinux builds.',
            },
            {
                question: 'How fast is onboarding?',
                answer: 'Most customers are live within an hour, with dedicated migration assistance as needed.',
            },
            {
                question: 'Is DDoS protection included?',
                answer: 'Every plan includes always-on L3/L4 protection with optional advanced filtering.',
            },
        ],
        [],
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <header className="sticky top-0 z-30 border-b border-slate-900/80 bg-slate-950/80 backdrop-blur">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500"
                            style={{ backgroundColor: theme.colors.primary }}
                        />
                        <div>
                            <p className="text-lg font-semibold">{name}</p>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Premium VPS Hosting</p>
                        </div>
                    </div>
                    <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
                        <a className="hover:text-white" href="#features">
                            Features
                        </a>
                        <a className="hover:text-white" href="#platform">
                            Platform
                        </a>
                        <a className="hover:text-white" href="#pricing">
                            Pricing
                        </a>
                        <a className="hover:text-white" href="#promotions">
                            Promotions
                        </a>
                        <a className="hover:text-white" href="#faq">
                            FAQ
                        </a>
                        <a className="hover:text-white" href="#support">
                            Support
                        </a>
                    </nav>
                    <div className="flex items-center gap-3">
                        <a
                            href="/auth/login"
                            className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500"
                        >
                            Log in
                        </a>
                        <a
                            href="/auth/login"
                            className="rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg"
                            style={{ backgroundColor: theme.colors.primary }}
                        >
                            Launch JexPanel
                        </a>
                    </div>
                </div>
            </header>

            <main>
                <section className="relative overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-40"
                        style={{
                            background:
                                'radial-gradient(circle at top, rgba(56, 189, 248, 0.25), transparent 55%)',
                        }}
                    />
                    <div className="mx-auto w-full max-w-6xl px-6 pb-16 pt-14 relative">
                    <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                                Sleek. Secure. Scalable.
                            </p>
                            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl">
                                Deliver standout VPS hosting with a professional front door and the power of JexPanel.
                            </h1>
                            <p className="mt-6 text-lg text-slate-300">
                                Create a premium experience for your customers with lightning-fast provisioning, clear
                                pricing, and a control panel that feels effortless to navigate.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-4">
                                <a
                                    href="#pricing"
                                    className="rounded-full px-6 py-3 text-sm font-semibold text-white"
                                    style={{ backgroundColor: theme.colors.primary }}
                                >
                                    View pricing
                                </a>
                                <a
                                    href="#promotions"
                                    className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200"
                                >
                                    See promotions
                                </a>
                            </div>
                            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {highlights.map(item => (
                                    <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                                        <p className="text-2xl font-semibold text-white">{item.value}</p>
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                            {item.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-slate-200">JexPanel overview</p>
                                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300">
                                        Live status
                                    </span>
                                </div>
                                <div className="mt-6 space-y-4">
                                    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Active VPS</p>
                                        <p className="mt-2 text-2xl font-semibold text-white">128 online</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Monthly savings</p>
                                        <p className="mt-2 text-2xl font-semibold text-white">30% with annual plans</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Support SLA</p>
                                        <p className="mt-2 text-2xl font-semibold text-white">15 min response</p>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full blur-3xl"
                                style={{ backgroundColor: theme.colors.primary }}
                            />
                        </div>
                    </div>
                    <div className="mt-12 flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-[0.3em] text-slate-500">
                        <span>Trusted by product teams</span>
                        <div className="flex flex-wrap gap-6 text-slate-400">
                            <span>Relay Labs</span>
                            <span>FluxHQ</span>
                            <span>Brightedge</span>
                            <span>Northwind</span>
                        </div>
                    </div>
                    </div>
                </section>

                <section id="features" className="border-t border-slate-900/80 bg-slate-950/80">
                    <div className="mx-auto w-full max-w-6xl px-6 py-16">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Why choose us</p>
                                <h2 className="mt-3 text-3xl font-semibold text-white">A modern hosting experience.</h2>
                            </div>
                            <p className="max-w-xl text-sm text-slate-300">
                                Give your clients a frictionless experience from their first click to their first deploy.
                                Everything is optimized for speed, clarity, and uptime.
                            </p>
                        </div>
                        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {features.map(feature => (
                                <div
                                    key={feature.title}
                                    className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
                                >
                                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                                    <p className="mt-3 text-sm text-slate-300">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="platform" className="mx-auto w-full max-w-6xl px-6 py-16">
                    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
                        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8">
                            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Platform</p>
                            <h2 className="mt-3 text-3xl font-semibold text-white">Built to impress at every touchpoint.</h2>
                            <p className="mt-4 text-sm text-slate-300">
                                JexPanel delivers clear navigation, instant diagnostics, and the automation you need
                                to keep customers happy and infrastructure reliable.
                            </p>
                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Provisioning</p>
                                    <p className="mt-2 text-lg font-semibold text-white">One-click templates</p>
                                </div>
                                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Monitoring</p>
                                    <p className="mt-2 text-lg font-semibold text-white">Real-time health checks</p>
                                </div>
                                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Automation</p>
                                    <p className="mt-2 text-lg font-semibold text-white">API &amp; webhooks</p>
                                </div>
                                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Security</p>
                                    <p className="mt-2 text-lg font-semibold text-white">Zero-trust access</p>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8">
                            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Built-in extras</p>
                            <h3 className="mt-3 text-2xl font-semibold text-white">Add-ons that scale with you.</h3>
                            <div className="mt-6 grid gap-4">
                                {addOns.map(addOn => (
                                    <div key={addOn.title} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                        <p className="text-sm font-semibold text-white">{addOn.title}</p>
                                        <p className="mt-2 text-xs text-slate-400">{addOn.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="pricing" className="mx-auto w-full max-w-6xl px-6 py-16">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Simple pricing</p>
                            <h2 className="mt-3 text-3xl font-semibold text-white">Plans built for every stage.</h2>
                        </div>
                        <p className="max-w-xl text-sm text-slate-300">
                            Transparent monthly pricing with predictable resources and no hidden fees.
                        </p>
                    </div>
                    <div className="mt-10 grid gap-6 lg:grid-cols-3">
                        {plans.map(plan => (
                            <div
                                key={plan.name}
                                className={`relative rounded-3xl border bg-slate-900/60 p-6 ${
                                    plan.featured
                                        ? 'border-slate-600 shadow-xl shadow-slate-900/60'
                                        : 'border-slate-800'
                                }`}
                            >
                                {plan.featured && (
                                    <span className="absolute -top-4 left-6 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-900">
                                        Best value
                                    </span>
                                )}
                                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{plan.name}</p>
                                <div className="mt-4 flex items-end gap-2">
                                    <span className="text-4xl font-semibold text-white">{plan.price}</span>
                                    <span className="text-sm text-slate-400">{plan.cadence}</span>
                                </div>
                                <p className="mt-3 text-sm text-slate-300">{plan.description}</p>
                                <ul className="mt-6 space-y-2 text-sm text-slate-300">
                                    {plan.specs.map(spec => (
                                        <li key={spec} className="flex items-center gap-2">
                                            <span
                                                className="h-2 w-2 rounded-full"
                                                style={{ backgroundColor: theme.colors.primary }}
                                            />
                                            {spec}
                                        </li>
                                    ))}
                                </ul>
                                <a
                                    href="/auth/login"
                                    className="mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white"
                                    style={{ backgroundColor: theme.colors.primary }}
                                >
                                    Deploy now
                                </a>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 md:flex-row md:items-center">
                        <div>
                            <p className="text-sm font-semibold text-white">Need custom resources?</p>
                            <p className="text-xs text-slate-400">Build bespoke plans with dedicated IPs and compliance.</p>
                        </div>
                        <a
                            href="mailto:sales@turinhosting.com"
                            className="rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-200"
                        >
                            Talk to sales
                        </a>
                    </div>
                </section>

                <section id="promotions" className="border-t border-slate-900/80 bg-slate-950/80">
                    <div className="mx-auto w-full max-w-6xl px-6 py-16">
                        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                            <div>
                                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Limited offers</p>
                                <h2 className="mt-3 text-3xl font-semibold text-white">Promotions that keep you ahead.</h2>
                                <p className="mt-4 text-sm text-slate-300">
                                    Lock in seasonal savings or bundle multiple VPS deployments to reduce your monthly
                                    spend while scaling faster.
                                </p>
                                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                                        <p className="text-sm font-semibold text-white">Launch bundle</p>
                                        <p className="mt-2 text-xs text-slate-400">Save 20% on your first 3 VPS.</p>
                                    </div>
                                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                                        <p className="text-sm font-semibold text-white">Annual commitment</p>
                                        <p className="mt-2 text-xs text-slate-400">Get 2 months free on annual plans.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
                                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Promo code</p>
                                <h3 className="mt-4 text-3xl font-semibold text-white">VPS30</h3>
                                <p className="mt-3 text-sm text-slate-300">
                                    Apply at checkout for 30% off your first month and priority onboarding.
                                </p>
                                <a
                                    href="/auth/login"
                                    className="mt-6 inline-flex rounded-full px-6 py-3 text-sm font-semibold text-white"
                                    style={{ backgroundColor: theme.colors.primary }}
                                >
                                    Claim offer
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-6xl px-6 py-16">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Customer love</p>
                            <h2 className="mt-3 text-3xl font-semibold text-white">Teams trust Turin Hosting.</h2>
                        </div>
                        <p className="max-w-xl text-sm text-slate-300">
                            From startups to growing platforms, our customers rely on fast infrastructure and a clean
                            control experience.
                        </p>
                    </div>
                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        {testimonials.map(item => (
                            <div key={item.name} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                                <p className="text-sm text-slate-200">“{item.quote}”</p>
                                <div className="mt-4">
                                    <p className="text-sm font-semibold text-white">{item.name}</p>
                                    <p className="text-xs text-slate-400">{item.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="faq" className="border-t border-slate-900/80 bg-slate-950/80">
                    <div className="mx-auto w-full max-w-6xl px-6 py-16">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">FAQ</p>
                                <h2 className="mt-3 text-3xl font-semibold text-white">Answers to common questions.</h2>
                            </div>
                            <p className="max-w-xl text-sm text-slate-300">
                                Everything you need to know before launching your first VPS.
                            </p>
                        </div>
                        <div className="mt-10 grid gap-6 md:grid-cols-2">
                            {faqs.map(item => (
                                <div key={item.question} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                                    <p className="text-sm font-semibold text-white">{item.question}</p>
                                    <p className="mt-2 text-sm text-slate-300">{item.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="support" className="mx-auto w-full max-w-6xl px-6 py-16">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-10">
                        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                            <div>
                                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Need help?</p>
                                <h2 className="mt-3 text-3xl font-semibold text-white">
                                    White-glove onboarding and migration support.
                                </h2>
                                <p className="mt-4 text-sm text-slate-300">
                                    Our team will help migrate workloads, tune performance, and keep your infrastructure
                                    running smoothly.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <a
                                    href="/auth/login"
                                    className="rounded-full px-6 py-3 text-sm font-semibold text-white"
                                    style={{ backgroundColor: theme.colors.primary }}
                                >
                                    Start with JexPanel
                                </a>
                                <a
                                    href="mailto:support@turinhosting.com"
                                    className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200"
                                >
                                    Contact sales
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-900/80 bg-slate-950/90">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-white">{name}</p>
                        <p className="mt-2">Reliable VPS hosting with a refined JexPanel experience.</p>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        <a className="hover:text-white" href="#features">
                            Features
                        </a>
                        <a className="hover:text-white" href="#pricing">
                            Pricing
                        </a>
                        <a className="hover:text-white" href="#promotions">
                            Promotions
                        </a>
                        <a className="hover:text-white" href="/auth/login">
                            Client login
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
