import tw from 'twin.macro';
import { breakpoint } from '@/theme';
import styled from 'styled-components/macro';
import { useStoreState } from '@/state/hooks';
import React, { useEffect, useState } from 'react';
import Spinner from '@/components/elements/Spinner';
import ContentBox from '@/components/elements/ContentBox';
import formatCurrency from '@/util/formatCurrency';
import { getResources, Resources } from '@/api/store/getResources';
import PageContentBlock from '@/components/elements/PageContentBlock';
import StripePurchaseForm from '@/components/store/forms/StripePurchaseForm';
import PaypalPurchaseForm from '@/components/store/forms/PaypalPurchaseForm';

const Container = styled.div`
    ${tw`flex flex-wrap`};

    & > div {
        ${tw`w-full`};

        ${breakpoint('sm')`
      width: calc(50% - 1rem);
    `}

        ${breakpoint('md')`
      ${tw`w-auto flex-1`};
    `}
    }
`;

export default () => {
    const [resources, setResources] = useState<Resources>();
    const earn = useStoreState((state) => state.storefront.data!.earn);
    const paypal = useStoreState((state) => state.storefront.data!.gateways?.paypal);
    const stripe = useStoreState((state) => state.storefront.data!.gateways?.stripe);
    const currency = useStoreState((state) => state.storefront.data?.currency);

    useEffect(() => {
        getResources().then((resources) => setResources(resources));
    }, []);

    if (!resources) return <Spinner size={'large'} centered />;

    return (
        <PageContentBlock title={'Account Balance'} description={'Add funds easily via Stripe or PayPal.'}>
            <Container className={'lg:grid lg:grid-cols-2 my-10'}>
                <ContentBox title={'Account Balance'} showFlashes={'account:balance'} css={tw`sm:mt-0`}>
                    <h1 css={tw`text-7xl flex justify-center items-center`}>
                        {formatCurrency(resources.balance, currency)}
                    </h1>
                </ContentBox>
                <ContentBox title={'Add Funds'} showFlashes={'account:balance'} css={tw`mt-8 sm:mt-0 sm:ml-8`}>
                    {!paypal && !stripe ? (
                        <p className={'text-gray-400 text-sm text-center'}>
                            Payment gateways are unavailable at this time.
                        </p>
                    ) : (
                        <>
                            {paypal && <PaypalPurchaseForm />}
                            {stripe && <StripePurchaseForm />}
                        </>
                    )}
                </ContentBox>
            </Container>
            {earn.enabled && (
                <>
                    <h1 className={'text-5xl'}>Idle Balance Earnings</h1>
                    <h3 className={'text-2xl text-neutral-500'}>
                        See how much you will earn per minute while AFK.
                    </h3>
                    <Container className={'lg:grid lg:grid-cols-2 my-10'}>
                        <ContentBox title={'Earn Rate'} showFlashes={'earn:rate'} css={tw`sm:mt-0`}>
                            <h1 css={tw`text-7xl flex justify-center items-center`}>
                                {formatCurrency(earn.amount, currency)}{' '}
                                <span className={'text-base ml-4'}>/ min</span>
                            </h1>
                        </ContentBox>
                        <ContentBox
                            title={'How to earn'}
                            showFlashes={'earn:how'}
                            css={tw`mt-8 sm:mt-0 sm:ml-8 text-gray-300`}
                        >
                            <p>You can earn balance by keeping any page of this panel open.</p>
                            <p css={tw`mt-1`}>
                                <span css={tw`text-green-500`}>{formatCurrency(earn.amount, currency)}&nbsp;</span>
                                per minute will automatically be added to your balance, as long as this site is open in
                                a browser tab.
                            </p>
                        </ContentBox>
                    </Container>
                </>
            )}
        </PageContentBlock>
    );
};
