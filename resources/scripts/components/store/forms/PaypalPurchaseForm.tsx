import tw from 'twin.macro';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import useFlash from '@/plugins/useFlash';
import paypal from '@/api/store/gateways/paypal';
import Select from '@/components/elements/Select';
import { Dialog } from '@/components/elements/dialog';
import { Button } from '@/components/elements/button/index';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import FlashMessageRender from '@/components/FlashMessageRender';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { useStoreState } from '@/state/hooks';
import formatCurrency from '@/util/formatCurrency';

export default () => {
    const { clearAndAddHttpError } = useFlash();
    const [amount, setAmount] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const currency = useStoreState((state) => state.storefront.data?.currency);

    const submit = () => {
        setSubmitting(true);

        paypal(amount)
            .then((url) => {
                setSubmitting(false);

                // @ts-expect-error this is valid
                window.location.href = url;
            })
            .catch((error) => {
                setSubmitting(false);

                clearAndAddHttpError({ key: 'store:paypal', error });
            });
    };

    return (
        <TitledGreyBox title={'Add Funds via PayPal'}>
            <Dialog open={submitting} hideCloseIcon onClose={() => undefined}>
                You are now being taken to the PayPal gateway to complete this transaction.
            </Dialog>
            <FlashMessageRender byKey={'store:paypal'} css={tw`mb-2`} />
            <Formik
                onSubmit={submit}
                initialValues={{
                    amount: 100,
                }}
            >
                <Form>
                    <SpinnerOverlay size={'large'} visible={submitting} />
                    <Select name={'amount'} disabled={submitting} onChange={(e) => setAmount(parseInt(e.target.value))}>
                        <option key={'paypal:placeholder'} hidden>
                            Choose an amount...
                        </option>
                        <option key={'paypal:buy:100'} value={100}>
                            Add {formatCurrency(100, currency)} to balance
                        </option>
                        <option key={'paypal:buy:200'} value={200}>
                            Add {formatCurrency(200, currency)} to balance
                        </option>
                        <option key={'paypal:buy:500'} value={500}>
                            Add {formatCurrency(500, currency)} to balance
                        </option>
                        <option key={'paypal:buy:1000'} value={1000}>
                            Add {formatCurrency(1000, currency)} to balance
                        </option>
                    </Select>
                    <div css={tw`mt-6`}>
                        <Button type={'submit'} disabled={submitting}>
                            Add Funds via PayPal
                        </Button>
                    </div>
                </Form>
            </Formik>
        </TitledGreyBox>
    );
};
