import React, { useEffect } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import useWindowDimensions from '@/plugins/useWindowDimensions';
import ResourceBar from '@/components/elements/store/ResourceBar';
import StoreBanner from '@/components/elements/store/StoreBanner';
import PageContentBlock from '@/components/elements/PageContentBlock';
import { getStoreProducts } from '@/api/store/getProducts';
import Spinner from '@/components/elements/Spinner';
import { Button } from '@/components/elements/button';
import { useHistory } from 'react-router-dom';

export default () => {
    const { width } = useWindowDimensions();
    const username = useStoreState((state) => state.user.data!.username);
    const history = useHistory();
    const currency = useStoreState((state) => state.storefront.data?.currency || 'USD');
    const products = useStoreState((state) => state.storefront.products);
    const setProductCatalog = useStoreActions((actions) => actions.storefront.setProductCatalog);

    useEffect(() => {
        if (products) {
            return;
        }

        getStoreProducts()
            .then((response) => setProductCatalog(response))
            .catch(() => null);
    }, [products, setProductCatalog]);

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
                    title={'Run out of credits?'}
                    className={'bg-storethree'}
                    action={'Buy Credits'}
                    link={'credits'}
                />
            </div>
            <div className={'mt-16'}>
                <h1 className={'text-5xl'}>Shop</h1>
                <h3 className={'text-2xl mt-2 text-neutral-500'}>
                    Explore VPS hosting and game servers with preset resources.
                </h3>
                {!products ? (
                    <div className={'mt-10'}>
                        <Spinner size={'large'} centered />
                    </div>
                ) : (
                    <div className={'space-y-12 mt-10'}>
                        {products.categories.map((category) => (
                            <div key={category.id}>
                                <div className={'flex flex-col lg:flex-row lg:items-end lg:justify-between'}>
                                    <div>
                                        <h2 className={'text-3xl'}>{category.name}</h2>
                                        <p className={'text-neutral-500 mt-2'}>{category.description}</p>
                                    </div>
                                </div>
                                <div className={'mt-6 grid gap-6 lg:grid-cols-3'}>
                                    {category.products.map((product) => (
                                        <div
                                            key={product.id}
                                            className={'rounded-xl border border-neutral-700 bg-neutral-900/60 p-6'}
                                        >
                                            <div className={'flex items-center justify-between'}>
                                                <div>
                                                    <h3 className={'text-xl'}>{product.name}</h3>
                                                    <p className={'text-sm text-neutral-500'}>{product.description}</p>
                                                </div>
                                                <div className={'text-right'}>
                                                    <p className={'text-2xl font-semibold'}>
                                                        {product.price} {currency}
                                                    </p>
                                                    <p className={'text-xs text-neutral-500'}>per {product.billing}</p>
                                                </div>
                                            </div>
                                            <div className={'mt-4 grid grid-cols-2 gap-3 text-sm text-neutral-200'}>
                                                <div>
                                                    <p className={'text-xs uppercase text-neutral-500'}>CPU</p>
                                                    <p>{product.specs.cpu}</p>
                                                </div>
                                                <div>
                                                    <p className={'text-xs uppercase text-neutral-500'}>RAM</p>
                                                    <p>{product.specs.memory}</p>
                                                </div>
                                                <div>
                                                    <p className={'text-xs uppercase text-neutral-500'}>Disk</p>
                                                    <p>{product.specs.disk}</p>
                                                </div>
                                                <div>
                                                    <p className={'text-xs uppercase text-neutral-500'}>Bandwidth</p>
                                                    <p>{product.specs.bandwidth}</p>
                                                </div>
                                            </div>
                                            <Button
                                                className={'mt-6 w-full'}
                                                onClick={() => history.push(`/store/create?plan=${product.id}`)}
                                            >
                                                Buy now
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PageContentBlock>
    );
};
