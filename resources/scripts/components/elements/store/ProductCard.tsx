import React from 'react';
import classNames from 'classnames';
import formatCurrency from '@/util/formatCurrency';
import { useHistory } from 'react-router-dom';
import { StorefrontProduct } from '@/state/storefront';
import { Button } from '@/components/elements/button';

interface Props {
    product: StorefrontProduct;
    currency?: string;
}

const ProductCard = ({ product, currency }: Props) => {
    const history = useHistory();
    const billingPeriod = product.billing || 'mo';
    const badges = [
        product.tag,
        product.region,
        product.highlight ? 'Recommended' : undefined,
    ].filter(Boolean) as string[];

    return (
        <div
            className={classNames(
                'rounded-2xl border bg-gray-800 p-6 shadow-lg transition',
                product.highlight
                    ? 'border-indigo-500 shadow-indigo-500/20 ring-1 ring-indigo-400/40'
                    : 'border-gray-700'
            )}
            style={{
                backgroundColor: 'var(--jex-color-surface, #111827)',
                borderRadius: 'var(--jex-component-card-radius, 18px)',
            }}
        >
            <div className={'flex flex-col gap-4'}>
                <div className={'flex flex-wrap items-start justify-between gap-4'}>
                    <div>
                        {badges.length > 0 && (
                            <div className={'mb-3 flex flex-wrap gap-2'}>
                                {badges.map((badge) => (
                                    <span
                                        key={badge}
                                        className={classNames(
                                            'rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide',
                                            badge === 'Recommended' || badge === product.tag
                                                ? 'border-indigo-400/60 bg-indigo-500/20 text-indigo-100'
                                                : 'border-gray-600 text-neutral-300'
                                        )}
                                    >
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        )}
                        <h4 className={'text-2xl font-semibold text-white'}>{product.name}</h4>
                        <p className={'text-sm text-neutral-400 mt-1'}>
                            Built for fast deployment with adjustable resources.
                        </p>
                    </div>
                    <div className={'text-right'}>
                        <p className={'text-xs uppercase tracking-[0.2em] text-neutral-400'}>Starting at</p>
                        <div className={'text-3xl font-semibold text-white'}>
                            {formatCurrency(product.price, currency)}
                        </div>
                        <div className={'text-xs text-neutral-400'}>per {billingPeriod}</div>
                    </div>
                </div>
                <div className={'rounded-xl border border-gray-700/80 bg-gray-900/60 p-4'}>
                    <p className={'text-xs uppercase tracking-[0.25em] text-neutral-500'}>Plan includes</p>
                    <div className={'mt-3 grid grid-cols-2 gap-4 text-sm text-neutral-300'}>
                        <div>
                            <p className={'text-neutral-500'}>CPU</p>
                            <p className={'font-medium'}>{product.specs.cpu}</p>
                        </div>
                        <div>
                            <p className={'text-neutral-500'}>RAM</p>
                            <p className={'font-medium'}>{product.specs.memory}</p>
                        </div>
                        <div>
                            <p className={'text-neutral-500'}>Disk</p>
                            <p className={'font-medium'}>{product.specs.disk}</p>
                        </div>
                        <div>
                            <p className={'text-neutral-500'}>Bandwidth</p>
                            <p className={'font-medium'}>{product.specs.bandwidth}</p>
                        </div>
                    </div>
                </div>
                {product.features && product.features.length > 0 && (
                    <ul className={'space-y-2 text-sm text-neutral-300'}>
                        {product.features.map((feature) => (
                            <li key={feature} className={'flex items-start gap-2'}>
                                <span className={'mt-1 h-2 w-2 rounded-full bg-emerald-400'} />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                )}
                <div className={'flex flex-wrap items-center justify-between gap-3'}>
                    <div className={'text-xs uppercase tracking-[0.2em] text-neutral-500'}>
                        {product.region ? `Region: ${product.region}` : 'Multi-region ready'}
                    </div>
                    <Button
                        onClick={() => history.push(`/store/create?product=${product.id}`)}
                        size={Button.Sizes.Small}
                    >
                        {product.cta ?? 'Choose plan'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
