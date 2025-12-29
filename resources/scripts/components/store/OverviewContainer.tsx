import React, { useEffect, useMemo, useState } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import useWindowDimensions from '@/plugins/useWindowDimensions';
import ResourceBar from '@/components/elements/store/ResourceBar';
import StoreBanner from '@/components/elements/store/StoreBanner';
import PageContentBlock from '@/components/elements/PageContentBlock';
import { getProducts } from '@/api/store/getProducts';
import ProductCard from '@/components/elements/store/ProductCard';
import formatCurrency from '@/util/formatCurrency';
import { defaultStoreLayout, StorefrontLayoutBlock, StorefrontProduct } from '@/state/storefront';

export default () => {
    const { width } = useWindowDimensions();
    const username = useStoreState((state) => state.user.data!.username);
    const currency = useStoreState((state) => state.storefront.data?.currency);
    const catalog = useStoreState((state) => state.storefront.data?.products);
    const layout = useStoreState((state) => state.storefront.data?.layout) ?? defaultStoreLayout;
    const setStorefrontProducts = useStoreActions((actions) => actions.storefront.setStorefrontProducts);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedTier, setSelectedTier] = useState('all');
    const [billingCycle, setBillingCycle] = useState<'mo' | 'yr'>('mo');
    const [comparePlans, setComparePlans] = useState(false);

    useEffect(() => {
        getProducts()
            .then((products) => setStorefrontProducts(products))
            .catch((error) => console.error('Failed to load storefront products', error));
    }, [setStorefrontProducts]);

    useEffect(() => {
        if (!selectedCategory && catalog?.categories?.length) {
            setSelectedCategory(catalog.categories[0].id);
        }
    }, [catalog?.categories, selectedCategory]);

    const activeCategory = useMemo(
        () => catalog?.categories?.find((category) => category.id === selectedCategory),
        [catalog?.categories, selectedCategory]
    );

    const parseSpecValue = (value?: string) => {
        if (!value) {
            return 0;
        }

        const parsed = Number.parseFloat(value.replace(/[^0-9.]/g, ''));
        return Number.isNaN(parsed) ? 0 : parsed;
    };

    const tierOptions: { id: string; label: string; matches: (product: StorefrontProduct) => boolean }[] = [
        {
            id: 'all',
            label: 'All tiers',
            matches: () => true,
        },
        {
            id: 'starter',
            label: 'Starter (2 vCPU / 4 GB)',
            matches: (product) => {
                const cpu = parseSpecValue(product.specs.cpu);
                const memory = parseSpecValue(product.specs.memory);
                return cpu <= 2 && memory <= 4;
            },
        },
        {
            id: 'balanced',
            label: 'Balanced (4 vCPU / 8 GB)',
            matches: (product) => {
                const cpu = parseSpecValue(product.specs.cpu);
                const memory = parseSpecValue(product.specs.memory);
                return cpu > 2 && cpu <= 4 && memory > 4 && memory <= 8;
            },
        },
        {
            id: 'performance',
            label: 'Performance (8+ vCPU / 16+ GB)',
            matches: (product) => {
                const cpu = parseSpecValue(product.specs.cpu);
                const memory = parseSpecValue(product.specs.memory);
                return cpu > 4 || memory > 8;
            },
        },
    ];

    const categoryProducts = useMemo(() => {
        return catalog?.products?.filter((product) => product.category === selectedCategory) ?? [];
    }, [catalog?.products, selectedCategory]);

    const hasAnnual = useMemo(
        () => categoryProducts.some((product) => product.billing === 'yr' || product.billing === 'year'),
        [categoryProducts]
    );

    useEffect(() => {
        if (!hasAnnual && billingCycle === 'yr') {
            setBillingCycle('mo');
        }
    }, [billingCycle, hasAnnual]);

    const filteredProducts = useMemo(() => {
        return categoryProducts.filter((product) => {
            const tierMatch =
                tierOptions.find((tier) => tier.id === selectedTier)?.matches?.(product) ?? true;
            const billingMatch =
                billingCycle === 'mo' ? product.billing === 'mo' || product.billing === 'month' : product.billing === 'yr' || product.billing === 'year';
            return tierMatch && billingMatch;
        });
    }, [billingCycle, categoryProducts, selectedTier, tierOptions]);

    const comparisonRows: { label: string; value: (product: StorefrontProduct) => string }[] = useMemo(
        () => [
            { label: 'Price', value: (product) => `${formatCurrency(product.price, currency)} / ${product.billing}` },
            { label: 'CPU', value: (product) => product.specs.cpu },
            { label: 'Memory', value: (product) => product.specs.memory },
            { label: 'Storage', value: (product) => product.specs.disk },
            { label: 'Bandwidth', value: (product) => product.specs.bandwidth },
            { label: 'Region', value: (product) => product.region ?? '—' },
            {
                label: 'Highlights',
                value: (product) => (product.features?.length ? product.features.join(', ') : '—'),
            },
        ],
        [currency]
    );

    const overviewBlocks = layout.overview?.length ? layout.overview : defaultStoreLayout.overview;

    const getFeaturedProducts = (
        block: Extract<StorefrontLayoutBlock, { type: 'featured' }>
    ): StorefrontProduct[] => {
        const products = catalog?.products ?? [];
        if (!products.length) {
            return [];
        }

        const productIds = Array.isArray(block.productIds) ? block.productIds : [];
        const categoryIds = Array.isArray(block.categoryIds) ? block.categoryIds : [];
        const limit = block.limit && Number.isFinite(block.limit) ? Math.max(1, block.limit) : 3;

        let featured: StorefrontProduct[] = [];

        if (productIds.length) {
            featured = productIds
                .map((id) => products.find((product) => product.id === id))
                .filter(Boolean) as StorefrontProduct[];
        } else if (categoryIds.length) {
            featured = products.filter((product) => categoryIds.includes(product.category));
        } else {
            featured = products.filter((product) => product.highlight);
        }

        if (!featured.length) {
            featured = products.slice(0, limit);
        }

        return featured.slice(0, limit);
    };

    return (
        <PageContentBlock title={'Storefront Overview'}>
            {overviewBlocks.map((block, index) => {
                switch (block.type) {
                    case 'hero':
                        return (
                            <div key={`overview-hero-${index}`} className={'flex flex-row items-center justify-between mt-10'}>
                                {width >= 1280 && (
                                    <div>
                                        <h1 className={'text-6xl'}>Hey, {username}!</h1>
                                        <h3 className={'text-2xl mt-2 text-neutral-500'}>👋 Welcome to the store.</h3>
                                    </div>
                                )}
                                <ResourceBar className={'w-full lg:w-3/4'} />
                            </div>
                        );
                    case 'banners':
                        return (
                            <div key={`overview-banners-${index}`} className={'lg:grid lg:grid-cols-3 gap-8 my-10'}>
                                <StoreBanner
                                    title={'Want to create a server?'}
                                    className={'bg-storeone'}
                                    action={'Create'}
                                    link={'create'}
                                />
                                <StoreBanner
                                    title={'Need more resources?'}
                                    className={'bg-storetwo'}
                                    action={'Buy Resources'}
                                    link={'resources'}
                                />
                                <StoreBanner
                                    title={'Need more balance?'}
                                    className={'bg-storethree'}
                                    action={'Add Funds'}
                                    link={'credits'}
                                />
                            </div>
                        );
                    case 'featured': {
                        const featuredProducts = getFeaturedProducts(block);
                        if (!featuredProducts.length) {
                            return null;
                        }

                        return (
                            <div key={`overview-featured-${index}`} className={'mt-16'}>
                                <div className={'flex flex-col gap-2'}>
                                    <h2 className={'text-4xl font-semibold'}>{block.title ?? 'Featured plans'}</h2>
                                    {block.description && <p className={'text-neutral-400'}>{block.description}</p>}
                                </div>
                                <div className={'mt-8 grid gap-6 lg:grid-cols-3'}>
                                    {featuredProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} currency={currency} />
                                    ))}
                                </div>
                            </div>
                        );
                    }
                    case 'catalog':
                        return (
                            <div key={`overview-catalog-${index}`} className={'mt-16'}>
                                <div className={'flex flex-col gap-2'}>
                                    <h2 className={'text-4xl font-semibold'}>{block.title ?? 'Shop'}</h2>
                                    {block.description && (
                                        <p className={'text-neutral-400'}>
                                            {block.description}
                                        </p>
                                    )}
                                </div>
                                {activeCategory && (
                                    <div className={'mt-8 rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8'}>
                                        <div className={'flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'}>
                                            <div className={'flex items-center gap-4'}>
                                                {activeCategory.icon && (
                                                    <div
                                                        className={'flex h-12 w-12 items-center justify-center rounded-full bg-gray-700 text-2xl'}
                                                    >
                                                        {activeCategory.icon}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className={'text-sm uppercase tracking-[0.2em] text-indigo-300'}>Category</p>
                                                    <h3 className={'text-3xl font-semibold'}>{activeCategory.name}</h3>
                                                    {activeCategory.description && (
                                                        <p className={'mt-1 text-sm text-neutral-300'}>
                                                            {activeCategory.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={'flex flex-wrap items-center gap-3 text-xs text-neutral-300'}>
                                                <span className={'rounded-full border border-gray-700 px-3 py-1'}>
                                                    {categoryProducts.length} plans
                                                </span>
                                                <span className={'rounded-full border border-gray-700 px-3 py-1'}>
                                                    {billingCycle === 'mo' ? 'Monthly billing' : 'Annual billing'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className={'mt-8 flex flex-col gap-4 rounded-2xl border border-gray-700 bg-gray-800/60 p-4'}>
                                    <div className={'flex flex-wrap items-center gap-3'}>
                                        {catalog?.categories?.map((category) => (
                                            <button
                                                key={category.id}
                                                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                                    selectedCategory === category.id
                                                        ? 'border-indigo-500 bg-indigo-500/20 text-white'
                                                        : 'border-gray-700 text-neutral-300 hover:border-indigo-400 hover:text-white'
                                                }`}
                                                onClick={() => setSelectedCategory(category.id)}
                                                type={'button'}
                                            >
                                                {category.name}
                                            </button>
                                        ))}
                                    </div>
                                    <div className={'flex flex-wrap items-center gap-3'}>
                                        {tierOptions.map((tier) => (
                                            <button
                                                key={tier.id}
                                                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                                                    selectedTier === tier.id
                                                        ? 'border-emerald-400 bg-emerald-400/20 text-white'
                                                        : 'border-gray-700 text-neutral-300 hover:border-emerald-400 hover:text-white'
                                                }`}
                                                onClick={() => setSelectedTier(tier.id)}
                                                type={'button'}
                                            >
                                                {tier.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className={'flex flex-wrap items-center justify-between gap-3'}>
                                        <div className={'flex items-center gap-2 rounded-full border border-gray-700 p-1'}>
                                            <button
                                                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                                                    billingCycle === 'mo'
                                                        ? 'bg-indigo-500/20 text-white'
                                                        : 'text-neutral-300 hover:text-white'
                                                }`}
                                                onClick={() => setBillingCycle('mo')}
                                                type={'button'}
                                            >
                                                Monthly
                                            </button>
                                            <button
                                                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                                                    billingCycle === 'yr'
                                                        ? 'bg-indigo-500/20 text-white'
                                                        : 'text-neutral-300 hover:text-white'
                                                } ${hasAnnual ? '' : 'cursor-not-allowed opacity-40'}`}
                                                onClick={() => hasAnnual && setBillingCycle('yr')}
                                                type={'button'}
                                            >
                                                Annual
                                            </button>
                                        </div>
                                        <button
                                            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                                                comparePlans
                                                    ? 'border-indigo-500 bg-indigo-500/20 text-white'
                                                    : 'border-gray-700 text-neutral-300 hover:border-indigo-400 hover:text-white'
                                            }`}
                                            onClick={() => setComparePlans((state) => !state)}
                                            type={'button'}
                                        >
                                            {comparePlans ? 'Close compare' : 'Compare plans'}
                                        </button>
                                    </div>
                                </div>
                                <div className={'mt-10 space-y-12'}>
                                    {comparePlans ? (
                                        <div className={'overflow-x-auto rounded-2xl border border-gray-700 bg-gray-800/50'}>
                                            <table className={'min-w-full text-left text-sm text-neutral-200'}>
                                                <thead className={'border-b border-gray-700 text-xs uppercase tracking-wider text-neutral-400'}>
                                                    <tr>
                                                        <th className={'px-4 py-3'}>Plan</th>
                                                        {filteredProducts.map((product) => (
                                                            <th key={product.id} className={'px-4 py-3'}>
                                                                <div className={'flex flex-col gap-1'}>
                                                                    <span className={'font-semibold text-white'}>{product.name}</span>
                                                                    <span className={'text-xs text-neutral-400'}>
                                                                        {product.tag ?? product.region ?? 'Plan details'}
                                                                    </span>
                                                                </div>
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {comparisonRows.map((row) => (
                                                        <tr key={row.label} className={'border-b border-gray-700 last:border-none'}>
                                                            <td className={'px-4 py-3 font-medium text-neutral-300'}>{row.label}</td>
                                                            {filteredProducts.map((product) => (
                                                                <td key={`${product.id}-${row.label}`} className={'px-4 py-3'}>
                                                                    {row.value(product)}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className={'grid gap-6 lg:grid-cols-2'}>
                                            {filteredProducts.map((product) => (
                                                <ProductCard key={product.id} product={product} currency={currency} />
                                            ))}
                                        </div>
                                    )}
                                    {!filteredProducts.length && (
                                        <div className={'rounded-xl border border-dashed border-gray-700 bg-gray-900/40 p-6 text-sm text-neutral-400'}>
                                            No plans match the selected filters. Try another tier or billing cycle.
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    default:
                        return null;
                }
            })}
        </PageContentBlock>
    );
};
