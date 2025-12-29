import React, { useEffect } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import useWindowDimensions from '@/plugins/useWindowDimensions';
import ResourceBar from '@/components/elements/store/ResourceBar';
import StoreBanner from '@/components/elements/store/StoreBanner';
import PageContentBlock from '@/components/elements/PageContentBlock';
import { getProducts } from '@/api/store/getProducts';
import ProductCard from '@/components/elements/store/ProductCard';

export default () => {
    const { width } = useWindowDimensions();
    const username = useStoreState((state) => state.user.data!.username);
    const currency = useStoreState((state) => state.storefront.data?.currency);
    const catalog = useStoreState((state) => state.storefront.data?.products);
    const setStorefrontProducts = useStoreActions((actions) => actions.storefront.setStorefrontProducts);

    useEffect(() => {
        getProducts()
            .then((products) => setStorefrontProducts(products))
            .catch((error) => console.error('Failed to load storefront products', error));
    }, [setStorefrontProducts]);

    return (
        <PageContentBlock title={'Storefront Overview'}>
            <div className={'flex flex-row items-center justify-between mt-10'}>
                {width >= 1280 && (
                    <div>
                        <h1 className={'text-6xl'}>Hey, {username}!</h1>
                        <h3 className={'text-2xl mt-2 text-neutral-500'}>👋 Welcome to the store.</h3>
                    </div>
                )}
                <ResourceBar className={'w-full lg:w-3/4'} />
            </div>
            <div className={'lg:grid lg:grid-cols-3 gap-8 my-10'}>
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
            <div className={'mt-16'}>
                <div className={'flex flex-col gap-2'}>
                    <h2 className={'text-4xl font-semibold'}>Shop</h2>
                    <p className={'text-neutral-400'}>
                        Choose a VPS hosting plan or a game server bundle. Buy now to prefill resources and launch
                        faster.
                    </p>
                </div>
                <div className={'mt-10 space-y-12'}>
                    {catalog?.categories?.map((category) => {
                        const products =
                            catalog?.products?.filter((product) => product.category === category.id) ?? [];

                        if (!products.length) {
                            return null;
                        }

                        return (
                            <div key={category.id}>
                                <div className={'flex flex-col gap-1 mb-6'}>
                                    <h3 className={'text-3xl font-semibold'}>{category.name}</h3>
                                    {category.description && (
                                        <p className={'text-sm text-neutral-400'}>{category.description}</p>
                                    )}
                                </div>
                                <div className={'grid gap-6 lg:grid-cols-2'}>
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} currency={currency} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </PageContentBlock>
    );
};
