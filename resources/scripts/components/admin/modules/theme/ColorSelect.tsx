import { Dispatch, SetStateAction, useState } from 'react';
import useFlash from '@/plugins/useFlash';
import Label from '@elements/Label';
import Input from '@elements/Input';
import AdminBox from '@elements/AdminBox';
import Spinner from '@elements/Spinner';
import updateColors from '@/api/admin/theme/updateColors';
import { CheckCircleIcon } from '@heroicons/react/outline';
import { useStoreActions, useStoreState } from '@/state/hooks';
import FlashMessageRender from '@/components/FlashMessageRender';
import { faPaintbrush } from '@fortawesome/free-solid-svg-icons';

interface Props {
    setReload: Dispatch<SetStateAction<boolean>>;
}

interface ThemePreset {
    name: string;
    description: string;
    colors: {
        primary: string;
        secondary: string;
        background: string;
        headers: string;
        sidebar: string;
    };
}

const themePresets: ThemePreset[] = [
    {
        name: 'VPS Midnight',
        description: 'Deep slate tones with neon blue accents.',
        colors: {
            primary: '#38bdf8',
            secondary: '#0f172a',
            background: '#020617',
            headers: '#0b1220',
            sidebar: '#0a0f1d',
        },
    },
    {
        name: 'Nebula Violet',
        description: 'Purple glow with galaxy-inspired depth.',
        colors: {
            primary: '#a855f7',
            secondary: '#1b102d',
            background: '#08040f',
            headers: '#140a22',
            sidebar: '#0f091a',
        },
    },
    {
        name: 'Oceanic Core',
        description: 'Teal navigation with crisp navy surfaces.',
        colors: {
            primary: '#22d3ee',
            secondary: '#0b1b2e',
            background: '#050b16',
            headers: '#0d2036',
            sidebar: '#071728',
        },
    },
    {
        name: 'Solar Gold',
        description: 'Warm amber highlights over graphite panels.',
        colors: {
            primary: '#fbbf24',
            secondary: '#1f1b16',
            background: '#0f0d0b',
            headers: '#211b14',
            sidebar: '#19130c',
        },
    },
    {
        name: 'Arctic Cloud',
        description: 'Cool cyan accents on frosted charcoal.',
        colors: {
            primary: '#38bdf8',
            secondary: '#1b2631',
            background: '#10161d',
            headers: '#222f3b',
            sidebar: '#17212c',
        },
    },
    {
        name: 'Crimson Edge',
        description: 'High-contrast reds with carbon panels.',
        colors: {
            primary: '#ef4444',
            secondary: '#1a1212',
            background: '#0d0707',
            headers: '#201010',
            sidebar: '#170c0c',
        },
    },
    {
        name: 'Emerald Ops',
        description: 'Emerald signals with hardened graphite.',
        colors: {
            primary: '#22c55e',
            secondary: '#0f1a14',
            background: '#050b08',
            headers: '#12231a',
            sidebar: '#0c1812',
        },
    },
    {
        name: 'Copper Forge',
        description: 'Industrial copper highlights over steel.',
        colors: {
            primary: '#f97316',
            secondary: '#1a1410',
            background: '#0d0a08',
            headers: '#231a14',
            sidebar: '#1a120d',
        },
    },
    {
        name: 'Rose Circuit',
        description: 'Soft rose accent with night circuitry.',
        colors: {
            primary: '#f472b6',
            secondary: '#1d131a',
            background: '#100a0e',
            headers: '#24121d',
            sidebar: '#1a0e16',
        },
    },
    {
        name: 'Cyber Lime',
        description: 'Lime signals on midnight hardware.',
        colors: {
            primary: '#84cc16',
            secondary: '#13170f',
            background: '#0a0c08',
            headers: '#1b2214',
            sidebar: '#11150d',
        },
    },
    {
        name: 'Slate Pro',
        description: 'Muted professional slate with icy accents.',
        colors: {
            primary: '#60a5fa',
            secondary: '#1f2937',
            background: '#111827',
            headers: '#243043',
            sidebar: '#161f2f',
        },
    },
    {
        name: 'Aurora Mint',
        description: 'Mint glow with deep navy panels.',
        colors: {
            primary: '#34d399',
            secondary: '#0f1a1d',
            background: '#070d10',
            headers: '#132126',
            sidebar: '#0c161a',
        },
    },
    {
        name: 'Royal Indigo',
        description: 'Indigo accents with midnight slate.',
        colors: {
            primary: '#6366f1',
            secondary: '#15162a',
            background: '#0b0c18',
            headers: '#1a1b33',
            sidebar: '#121324',
        },
    },
    {
        name: 'Titanium Blue',
        description: 'Electric blue with metallic surfaces.',
        colors: {
            primary: '#3b82f6',
            secondary: '#131a24',
            background: '#0b0f16',
            headers: '#182131',
            sidebar: '#111825',
        },
    },
];

export default ({ setReload }: Props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const colors = useStoreState(state => state.theme.data!.colors);
    const setTheme = useStoreActions(actions => actions.theme.setTheme);

    const update = async (key: string, value: string) => {
        clearFlashes();
        setReload(true);
        setLoading(true);
        setSuccess(false);

        setTheme({
            colors: {
                primary: key === 'primary' ? value : colors.primary,
                secondary: key === 'secondary' ? value : colors.secondary,

                background: key === 'background' ? value : colors.background,
                headers: key === 'headers' ? value : colors.headers,
                sidebar: key === 'sidebar' ? value : colors.sidebar,
            },
        });

        updateColors(key, value)
            .then(() => {
                setReload(false);
                setSuccess(true);
                setLoading(false);

                setTimeout(() => setSuccess(false), 2000);
            })
            .catch(error => {
                clearAndAddHttpError({ key: 'auth:modules:discord', error });

                setLoading(false);
            });
    };

    const applyPreset = async (preset: ThemePreset) => {
        clearFlashes();
        setReload(true);
        setLoading(true);
        setSuccess(false);

        setTheme({
            colors: { ...preset.colors },
        });

        Promise.all(
            Object.entries(preset.colors).map(([key, value]) => updateColors(key, value))
        )
            .then(() => {
                setReload(false);
                setSuccess(true);
                setLoading(false);

                setTimeout(() => setSuccess(false), 2000);
            })
            .catch(error => {
                clearAndAddHttpError({ key: 'theme:colors', error });
                setLoading(false);
            });
    };

    return (
        <AdminBox title={'Color Selection'} icon={faPaintbrush}>
            <FlashMessageRender byKey={'theme:colors'} className={'my-2'} />
            {loading && <Spinner className={'absolute top-0 right-0 m-3.5'} size={'small'} />}
            {success && <CheckCircleIcon className={'w-5 h-5 absolute top-0 right-0 m-3.5 text-green-500'} />}
            <div className={'mb-8'}>
                <Label>Theme Presets</Label>
                <p className={'text-xs text-gray-400 mb-4'}>
                    Jumpstart the panel with curated palettes built for hosting dashboards.
                </p>
                <div className={'grid gap-3 md:grid-cols-2'}>
                    {themePresets.map(preset => (
                        <button
                            key={preset.name}
                            type={'button'}
                            onClick={() => applyPreset(preset)}
                            className={
                                'flex items-center justify-between rounded-xl border border-neutral-800/70 bg-neutral-900/50 px-4 py-3 text-left transition hover:border-neutral-600 hover:bg-neutral-900'
                            }
                        >
                            <div>
                                <p className={'text-sm font-semibold text-neutral-100'}>{preset.name}</p>
                                <p className={'text-xs text-neutral-400 mt-1'}>{preset.description}</p>
                            </div>
                            <div className={'flex items-center gap-2'}>
                                {Object.values(preset.colors).map(color => (
                                    <span
                                        key={color}
                                        className={'h-4 w-4 rounded-full border border-black/40'}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <Label>Primary Content (Accent Color)</Label>
                <Input
                    id={'primary'}
                    type={'color'}
                    name={'primary'}
                    value={colors.primary}
                    onChange={e => update('primary', e.target.value)}
                />
                <p className={'text-xs text-gray-400 mt-1'}>
                    This color is used as the main text color on the application and is also used for the buttons and
                    other components.
                </p>
            </div>
            <div className={'mt-6'}>
                <Label>Secondary Content (Components)</Label>
                <Input
                    id={'secondary'}
                    type={'color'}
                    name={'secondary'}
                    value={colors.secondary}
                    onChange={e => update('secondary', e.target.value)}
                />
                <p className={'text-xs text-gray-400 mt-1'}>
                    Secondary content is elements of pages like this box, tables and other components. This should
                    usually be a dark, muted colour which doesn&apos;t blend in with the background easily.
                </p>
            </div>
            <div className={'h-0.5 my-6 rounded-full border-b border-gray-500 border-dashed'} />
            <div className={'mt-6'}>
                <Label>Background Color</Label>
                <Input
                    id={'background'}
                    type={'color'}
                    name={'background'}
                    value={colors.background}
                    onChange={e => update('background', e.target.value)}
                />
                <p className={'text-xs text-gray-400 mt-1'}>
                    This color is used for the background of this application.
                </p>
            </div>
            <div className={'my-6'}>
                <Label>Component Headers</Label>
                <Input
                    id={'headers'}
                    type={'color'}
                    name={'headers'}
                    value={colors.headers}
                    onChange={e => update('headers', e.target.value)}
                />
                <p className={'text-xs text-gray-400 mt-1'}>
                    This color is used for headers of forms, boxes and tables. We usually advise that this colour is
                    slightly darker than &apos;Secondary Content&apos;.
                </p>
            </div>
            <div className={'my-6'}>
                <Label>Sidebar & Navigation</Label>
                <Input
                    id={'sidebar'}
                    type={'color'}
                    name={'sidebar'}
                    value={colors.sidebar}
                    onChange={e => update('sidebar', e.target.value)}
                />
                <p className={'text-xs text-gray-400 mt-1'}>
                    This is the color of the sidebar to the left-hand side of your screen.
                </p>
            </div>
        </AdminBox>
    );
};
