import classNames from 'classnames';
import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
    faArchive,
    faDatabase,
    faEthernet,
    faExclamationTriangle,
    faHdd,
    faMemory,
    faMicrochip,
    faShoppingBag,
} from '@fortawesome/free-solid-svg-icons';

import ContentBox from '@elements/ContentBox';
import PageContentBlock from '@elements/PageContentBlock';
import Spinner from '@elements/Spinner';
import { Button } from '@elements/button';
import { Alert } from '@elements/alert';
import { useStoreState } from '@/state/hooks';
import getCategories, { Category } from '@/api/billing/getCategories';
import { getProducts, Product } from '@/api/billing/products';

interface LimitProps {
    icon: IconDefinition;
    limit: ReactElement;
}

const LimitBox = ({ icon, limit }: LimitProps) => (
    <div className={'text-gray-400 mt-1 flex items-center'}>
        <FontAwesomeIcon icon={icon} className={'w-4 h-4 mr-2'} />
        {limit}
    </div>
);

const buildLoginUrl = (returnTo: string) => `/auth/login?return=${encodeURIComponent(returnTo)}`;

const formatGiB = (value: number) => {
    const gib = value / 1024;
    return Number.isInteger(gib) ? `${gib} GiB` : `${gib.toFixed(1)} GiB`;
};

export default function Storefront() {
    const [category, setCategory] = useState<number>();
    const [products, setProducts] = useState<Product[] | undefined>();
    const [categories, setCategories] = useState<Category[] | undefined>();

    const appName = useStoreState(state => state.settings.data!.name);
    const { colors } = useStoreState(state => state.theme.data!);
    const billing = useStoreState(state => state.everest.data!.billing);
    const registrationEnabled = useStoreState(state => state.everest.data!.auth.registration.enabled);
    const isAuthenticated = useStoreState(state => Boolean(state.user.data?.uuid));

    const headerCtas = useMemo(() => {
        if (isAuthenticated) {
            return (
                <Link to={'/'}>
                    <Button size={Button.Sizes.Small}>Go to dashboard</Button>
                </Link>
            );
        }

        return (
            <div className={'flex flex-wrap items-center gap-3'}>
                <Link to={buildLoginUrl('/store')}>
                    <Button size={Button.Sizes.Small} variant={Button.Variants.Secondary}>
                        Log in
                    </Button>
                </Link>
                {registrationEnabled && (
                    <Link to={'/auth/register'}>
                        <Button size={Button.Sizes.Small}>Create account</Button>
                    </Link>
                )}
            </div>
        );
    }, [isAuthenticated, registrationEnabled]);

    useEffect(() => {
        if (!billing.enabled) {
            return;
        }

        let active = true;

        (async () => {
            const data = await getCategories();
            if (!active) {
                return;
            }
            setCategories(data);
            setCategory(Number(data[0]?.id));
        })();

        return () => {
            active = false;
        };
    }, [billing.enabled]);

    useEffect(() => {
        if (!billing.enabled || !category) {
            return;
        }

        setProducts(undefined);
        let active = true;

        getProducts(category).then(data => {
            if (active) {
                setProducts(data);
            }
        });

        return () => {
            active = false;
        };
    }, [billing.enabled, category]);

    if (!billing.enabled) {
        return (
            <PageContentBlock title={'Storefront'}>
                <div className={'mx-auto max-w-3xl'}>
                    <ContentBox>
                        <div className={'p-6 text-center'}>
                            <div className={'mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10'}>
                                <FontAwesomeIcon icon={faExclamationTriangle} className={'text-red-400'} />
                            </div>
                            <p className={'mt-4 text-2xl font-semibold text-white'}>Billing is currently disabled.</p>
                            <p className={'mt-2 text-sm text-gray-400'}>
                                Our team can help with custom plans, onboarding, and enterprise pricing.
                            </p>
                            <div className={'mt-6 flex justify-center'}>
                                <Button onClick={() => (window.location.href = 'mailto:sales@turinhosting.com')}>
                                    Contact sales
                                </Button>
                            </div>
                        </div>
                    </ContentBox>
                </div>
            </PageContentBlock>
        );
    }

    if (!billing.keys.publishable) {
        return (
            <Alert type={'danger'}>
                Due to a configuration error, the store is currently unavailable. Please try again later, or refresh the
                page.
            </Alert>
        );
    }

    return (
        <PageContentBlock title={'Storefront'}>
            <div className={'mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'}>
                <div>
                    <p className={'text-3xl font-bold text-white lg:text-5xl'}>Build your VPS in minutes.</p>
                    <p className={'mt-2 text-sm text-gray-400'}>
                        Browse categories, compare plans, and log in when you&apos;re ready to check out.
                    </p>
                    <p className={'mt-4 text-xs uppercase tracking-[0.3em] text-gray-500'}>{appName} Store</p>
                </div>
                {headerCtas}
            </div>

            <div className={'grid gap-6 lg:grid-cols-[260px,1fr]'}>
                <div className={'rounded-2xl border border-slate-800/60 bg-slate-900/40 p-5'}>
                    <p className={'text-lg font-semibold text-white'}>Categories</p>
                    <p className={'mt-1 text-xs text-gray-400'}>Pick the plan family that fits your workload.</p>
                    <div className={'mt-6 space-y-4'}>
                        {(!categories || categories.length < 1) && (
                            <div className={'rounded-lg border border-dashed border-slate-700 p-4 text-sm text-gray-400'}>
                                <FontAwesomeIcon icon={faExclamationTriangle} className={'mr-2 text-yellow-400'} />
                                No categories found.
                            </div>
                        )}
                        {categories?.map(cat => (
                            <button
                                className={classNames(
                                    'group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-left text-sm font-semibold text-gray-300 transition hover:border-slate-700 hover:bg-slate-800/60',
                                    Number(cat.id) === category && 'border-slate-700 bg-slate-800/80 text-white',
                                )}
                                disabled={category === Number(cat.id)}
                                style={{ color: Number(cat.id) === category ? colors.primary : undefined }}
                                onClick={() => {
                                    setCategory(Number(cat.id));
                                    setProducts(undefined);
                                }}
                                key={cat.id}
                            >
                                {cat.icon ? (
                                    <img src={cat.icon} className={'h-9 w-9 rounded-full'} />
                                ) : (
                                    <div className={'flex h-9 w-9 items-center justify-center rounded-full bg-slate-800'}>
                                        <FontAwesomeIcon icon={faShoppingBag} className={'text-gray-400'} />
                                    </div>
                                )}
                                <div>
                                    <p className={'line-clamp-1'}>{cat.name}</p>
                                    <p className={'text-xs text-gray-500'}>Explore plans</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    {!products ? (
                        <Spinner centered />
                    ) : (
                        <>
                            {products.length < 1 && (
                                <div className={'rounded-lg border border-dashed border-slate-700 p-6 text-gray-400'}>
                                    <FontAwesomeIcon
                                        icon={faExclamationTriangle}
                                        className={'mr-2 text-yellow-400'}
                                    />
                                    No products could be found in this category.
                                </div>
                            )}
                            <div className={'grid gap-4 md:grid-cols-2 xl:grid-cols-3'}>
                                {products.map(product => {
                                    const orderPath = `/account/billing/order/${product.id}`;
                                    const buyLink = isAuthenticated ? orderPath : buildLoginUrl(orderPath);
                                    return (
                                        <ContentBox key={product.id} className={'border border-slate-800/60 bg-slate-900'}>
                                            <div className={'p-5'}>
                                                <div className={'flex items-center justify-between'}>
                                                    <div className={'flex items-center gap-3'}>
                                                        {product.icon ? (
                                                            <img src={product.icon} className={'h-11 w-11'} />
                                                        ) : (
                                                            <div
                                                                className={
                                                                    'flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800'
                                                                }
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faShoppingBag}
                                                                    className={'text-lg'}
                                                                    style={{ color: colors.primary }}
                                                                />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className={'text-lg font-semibold text-white'}>{product.name}</p>
                                                            <p className={'text-xs text-gray-500'}>Monthly plan</p>
                                                        </div>
                                                    </div>
                                                    <div className={'text-right'}>
                                                        <p className={'text-2xl font-semibold text-white'}>
                                                            {billing.currency.symbol}
                                                            {product.price.toFixed(2)}
                                                        </p>
                                                        <p className={'text-xs text-gray-500'}>
                                                            {billing.currency.code.toUpperCase()} / month
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={'mt-5 space-y-2'}>
                                                    <LimitBox icon={faMicrochip} limit={<>{product.limits.cpu}% CPU</>} />
                                                    <LimitBox
                                                        icon={faMemory}
                                                        limit={<>{formatGiB(product.limits.memory)} RAM</>}
                                                    />
                                                    <LimitBox
                                                        icon={faHdd}
                                                        limit={<>{formatGiB(product.limits.disk)} Storage</>}
                                                    />
                                                    <LimitBox
                                                        icon={faEthernet}
                                                        limit={
                                                            <>
                                                                {product.limits.allocation} network port
                                                                {product.limits.allocation > 1 && 's'}
                                                            </>
                                                        }
                                                    />
                                                    {product.limits.backup ? (
                                                        <LimitBox
                                                            icon={faArchive}
                                                            limit={<>{product.limits.backup} backup slots</>}
                                                        />
                                                    ) : null}
                                                    {product.limits.database ? (
                                                        <LimitBox
                                                            icon={faDatabase}
                                                            limit={<>{product.limits.database} database slots</>}
                                                        />
                                                    ) : null}
                                                </div>
                                                <div className={'mt-6 flex items-center justify-between'}>
                                                    <p className={'text-xs text-gray-500'}>Ready to deploy?</p>
                                                    <Link to={buyLink}>
                                                        <Button size={Button.Sizes.Small}>Buy</Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </ContentBox>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </PageContentBlock>
    );
}
