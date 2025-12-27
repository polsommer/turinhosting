import { useState } from 'react';
import useFlash from '@/plugins/useFlash';
import { Button } from '@elements/button';
import { Dialog } from '@elements/dialog';
import resetTheme from '@/api/admin/theme/resetTheme';
import Preview from '@admin/modules/theme/Preview';
import AdminContentBlock from '@elements/AdminContentBlock';
import ColorSelect from '@admin/modules/theme/ColorSelect';
import { useStoreState } from '@/state/hooks';

export default () => {
    const [reload, setReload] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const theme = useStoreState(state => state.theme.data!);

    const submit = () => {
        clearFlashes('theme:colors');

        resetTheme()
            .then(() => {
                // @ts-expect-error this is fine
                window.location = '/admin/theme';
            })
            .catch(error => {
                clearAndAddHttpError({ key: 'theme:colors', error });
            });
    };

    return (
        <AdminContentBlock showFlashKey={'theme:colors'}>
            <Dialog.Confirm
                title={'Are you sure?'}
                open={visible}
                onClose={() => setVisible(false)}
                onConfirmed={submit}
            >
                Performing this action will immediately wipe all of your custom theming settings. Only do this if you
                wish to return to the stock appearance of Jexactyl. This action cannot be reversed.
            </Dialog.Confirm>
            <div
                className={'w-full mb-8 rounded-2xl border border-neutral-800/60 p-6'}
                style={{
                    background:
                        'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(2,6,23,0.95) 60%, rgba(8,12,24,0.9) 100%)',
                    borderTopColor: theme.colors.primary,
                    borderTopWidth: '2px',
                }}
            >
                <div className={'flex flex-col gap-6 lg:flex-row lg:items-center'}>
                    <div className={'flex-1'} style={{ minWidth: '0' }}>
                        <p className={'text-xs uppercase tracking-[0.3em] text-neutral-400'}>VPS Control Layer</p>
                        <h2 className={'text-3xl text-neutral-50 font-header font-semibold mt-3'}>System Theme</h2>
                        <p className={'text-neutral-300 mt-2 max-w-2xl'}>
                            Shape the experience like a premium VPS hosting portal — crisp typography, bold accents,
                            and clear system signals for uptime, regions, and performance.
                        </p>
                        <div className={'mt-4 flex flex-wrap gap-3 text-xs font-semibold'}>
                            {['99.99% Uptime SLA', 'NVMe-First Storage', 'DDoS Mitigation', 'Instant Provisioning'].map(
                                label => (
                                    <span
                                        key={label}
                                        className={
                                            'rounded-full border border-neutral-700/70 px-3 py-1 text-neutral-200'
                                        }
                                    >
                                        {label}
                                    </span>
                                )
                            )}
                        </div>
                    </div>
                    <div className={'flex flex-col gap-4 lg:items-end'}>
                        <div className={'grid grid-cols-2 gap-3 text-sm'}>
                            {[
                                { label: 'Regions', value: '12' },
                                { label: 'Network', value: '10 Gbps' },
                                { label: 'Compute', value: 'Ryzen 9' },
                                { label: 'Storage', value: 'NVMe RAID' },
                            ].map(item => (
                                <div
                                    key={item.label}
                                    className={'rounded-xl border border-neutral-800/70 bg-neutral-900/60 p-3'}
                                >
                                    <p className={'text-neutral-400 text-xs uppercase tracking-widest'}>
                                        {item.label}
                                    </p>
                                    <p className={'text-neutral-100 font-semibold mt-1'}>{item.value}</p>
                                </div>
                            ))}
                        </div>
                        <Button
                            type={'button'}
                            size={Button.Sizes.Large}
                            onClick={() => setVisible(true)}
                            className={'h-10 px-5 py-0 whitespace-nowrap'}
                        >
                            Reset to Defaults
                        </Button>
                    </div>
                </div>
            </div>
            <div className={'grid md:grid-cols-2 xl:grid-cols-3 gap-4'}>
                <ColorSelect setReload={setReload} />
                <Preview reload={reload} />
            </div>
        </AdminContentBlock>
    );
};
