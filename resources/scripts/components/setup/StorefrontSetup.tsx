import { Form, Formik } from 'formik';
import Field, { TextareaField } from '@elements/Field';
import { Button } from '@elements/button';
import { useStoreActions, useStoreState } from '@/state/hooks';
import { updateGeneralSettings } from '@/api/admin/settings';
import { useState } from 'react';

interface StorefrontFormValues {
    storefront_headline: string;
    storefront_subheading: string;
    storefront_cta: string;
    storefront_contact_email: string;
    storefront_show_pricing: boolean;
}

export default () => {
    const settings = useStoreState(state => state.settings.data!);
    const updateSettings = useStoreActions(actions => actions.settings.updateSettings);
    const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

    const submit = (values: StorefrontFormValues) => {
        setStatus('saving');

        updateGeneralSettings(values)
            .then(() => {
                updateSettings({
                    storefront: {
                        headline: values.storefront_headline,
                        subheading: values.storefront_subheading,
                        cta_label: values.storefront_cta,
                        contact_email: values.storefront_contact_email,
                        show_pricing: values.storefront_show_pricing,
                    },
                });
                setStatus('saved');
            })
            .catch(() => {
                setStatus('error');
            });
    };

    return (
        <div>
            <div className={'w-full flex flex-row items-center mb-8'}>
                <div className={'flex flex-col flex-shrink'} style={{ minWidth: '0' }}>
                    <h2 className={'text-2xl text-neutral-50 font-header font-medium'}>Storefront Copy</h2>
                    <p
                        className={
                            'hidden lg:block text-base text-neutral-400 whitespace-nowrap overflow-ellipsis overflow-hidden'
                        }
                    >
                        Configure your landing page copy and storefront preferences.
                    </p>
                </div>
            </div>
            <Formik
                onSubmit={submit}
                initialValues={{
                    storefront_headline: settings.storefront?.headline ?? '',
                    storefront_subheading: settings.storefront?.subheading ?? '',
                    storefront_cta: settings.storefront?.cta_label ?? '',
                    storefront_contact_email: settings.storefront?.contact_email ?? '',
                    storefront_show_pricing: settings.storefront?.show_pricing ?? true,
                }}
            >
                {({ resetForm }) => (
                    <Form className={'space-y-6'}>
                        <Field
                            id={'storefront_headline'}
                            name={'storefront_headline'}
                            label={'Hero headline'}
                            type={'text'}
                            description={'Primary headline for your landing page hero section.'}
                        />
                        <TextareaField
                            id={'storefront_subheading'}
                            name={'storefront_subheading'}
                            label={'Hero subheading'}
                            description={'Supporting copy shown beneath the headline.'}
                            rows={3}
                        />
                        <div className={'grid gap-6 lg:grid-cols-2'}>
                            <Field
                                id={'storefront_cta'}
                                name={'storefront_cta'}
                                label={'Primary CTA text'}
                                type={'text'}
                                description={'Label for the primary call-to-action button.'}
                            />
                            <Field
                                id={'storefront_contact_email'}
                                name={'storefront_contact_email'}
                                label={'Contact email'}
                                type={'email'}
                                description={'Used for sales and support contact links on the landing page.'}
                            />
                        </div>
                        <div>
                            <div className={'inline-flex items-center'}>
                                <label htmlFor={'storefront_show_pricing'} className={'text-xs text-gray-400 mr-2'}>
                                    Show pricing section?
                                </label>
                                <Field
                                    id={'storefront_show_pricing'}
                                    name={'storefront_show_pricing'}
                                    type={'checkbox'}
                                    defaultChecked={settings.storefront?.show_pricing ?? true}
                                />
                            </div>
                            <p className={'text-gray-400 text-xs mt-1.5'}>
                                Toggle whether the pricing grid and navigation link appear on the storefront.
                            </p>
                        </div>
                        <div className={'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'}>
                            <div className={'text-xs text-gray-400'}>
                                {status === 'saving' && 'Saving storefront settings...'}
                                {status === 'saved' && 'Storefront settings saved.'}
                                {status === 'error' && 'Unable to save storefront settings. Try again.'}
                            </div>
                            <div className={'flex flex-wrap gap-3'}>
                                <Button.Text
                                    type={'button'}
                                    onClick={() => {
                                        resetForm();
                                        setStatus('idle');
                                    }}
                                >
                                    Skip for now
                                </Button.Text>
                                <Button type={'submit'} disabled={status === 'saving'}>
                                    Save settings
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};
