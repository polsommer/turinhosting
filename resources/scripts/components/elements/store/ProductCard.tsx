import React from 'react';
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

    return (
        <div className={'bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700'}>
            <div className={'flex items-start justify-between'}>
                <div>
                    <h4 className={'text-2xl font-semibold text-white'}>{product.name}</h4>
                    <p className={'text-sm text-neutral-400 mt-1'}>
                        Provisioned with preset resources. Adjust before checkout.
                    </p>
                </div>
                <div className={'text-right'}>
                    <div className={'text-2xl font-semibold text-white'}>
                        {formatCurrency(product.price, currency)}
                    </div>
                    <div className={'text-xs text-neutral-400'}>per {billingPeriod}</div>
                </div>
            </div>
            <div className={'grid grid-cols-2 gap-4 text-sm text-neutral-300 mt-4'}>
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
            <div className={'mt-6 flex justify-end'}>
                <Button
                    onClick={() => history.push(`/store/create?product=${product.id}`)}
                    size={Button.Sizes.Small}
                >
                    Buy now
                </Button>
            </div>
        </div>
    );
};

export default ProductCard;
