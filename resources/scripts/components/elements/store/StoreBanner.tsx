import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Button } from '@/components/elements/button';

interface BannerProps {
    className: string;
    title: string;
    description?: string;
    action: string;
    link: string;
}

export default ({ className, title, description, action, link }: BannerProps) => {
    return (
        <div
            className={classNames(
                className,
                'group relative flex min-h-[260px] w-full overflow-hidden rounded-3xl border border-gray-700/60 bg-gray-900/70 p-6 shadow-lg'
            )}
        >
            <div className={'absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-transparent'} />
            <div className={'relative z-10 flex h-full flex-col justify-between gap-8'}>
                <div>
                    <p className={'text-xs uppercase tracking-[0.35em] text-indigo-200'}>VPS Store</p>
                    <p className={'mt-3 text-2xl font-semibold text-white md:text-3xl'}>{title}</p>
                    {description && <p className={'mt-2 text-sm text-neutral-200'}>{description}</p>}
                </div>
                <Link to={`/store/${link}`}>
                    <Button
                        className={
                            'w-full justify-center rounded-full border border-white/20 bg-white/10 text-white transition group-hover:border-indigo-400 group-hover:bg-indigo-500/20'
                        }
                        size={Button.Sizes.Large}
                        variant={Button.Variants.Secondary}
                    >
                        {action}
                    </Button>
                </Link>
            </div>
        </div>
    );
};
