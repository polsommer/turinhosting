import tw from 'twin.macro';
import { breakpoint } from '@/theme';
import * as Icon from 'react-feather';
import { Link } from 'react-router-dom';
import useFlash from '@/plugins/useFlash';
import styled from 'styled-components/macro';
import React, { useState, useEffect } from 'react';
import Spinner from '@/components/elements/Spinner';
import { useStoreState } from '@/state/hooks';
import { Button } from '@/components/elements/button';
import { Dialog } from '@/components/elements/dialog';
import { getCosts, Costs } from '@/api/store/getCosts';
import purchaseResource from '@/api/store/purchaseResource';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import PurchaseBox from '@/components/elements/store/PurchaseBox';
import PageContentBlock from '@/components/elements/PageContentBlock';
import { defaultStoreLayout } from '@/state/storefront';

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
    const [open, setOpen] = useState(false);
    const [costs, setCosts] = useState<Costs>();
    const [resource, setResource] = useState('');
    const layout = useStoreState((state) => state.storefront.data?.layout) ?? defaultStoreLayout;
    const { addFlash, clearFlashes, clearAndAddHttpError } = useFlash();

    useEffect(() => {
        getCosts().then((costs) => setCosts(costs));
    }, []);

    const purchase = (resource: string) => {
        clearFlashes('store:resources');

        purchaseResource(resource)
            .then(() => {
                setOpen(false);
                addFlash({
                    type: 'success',
                    key: 'store:resources',
                    message: 'Resource has been added to your account.',
                });
            })
            .catch((error) => clearAndAddHttpError({ key: 'store:resources', error }));
    };

    if (!costs) return <Spinner size={'large'} centered />;

    const resourceDefinitions = {
        cpu: {
            type: 'CPU',
            amount: 50,
            suffix: '%',
            cost: costs.cpu,
            icon: <Icon.Cpu />,
            description: 'Buy CPU to improve server load times and performance.',
        },
        memory: {
            type: 'Memory',
            amount: 1,
            suffix: 'GB',
            cost: costs.memory,
            icon: <Icon.PieChart />,
            description: 'Buy RAM to improve overall server performance.',
        },
        disk: {
            type: 'Disk',
            amount: 1,
            suffix: 'GB',
            cost: costs.disk,
            icon: <Icon.HardDrive />,
            description: 'Buy disk to store more files.',
        },
        slot: {
            type: 'Slots',
            amount: 1,
            cost: costs.slots,
            icon: <Icon.Server />,
            description: 'Buy a server slot so you can deploy a new server.',
        },
        port: {
            type: 'Ports',
            amount: 1,
            cost: costs.ports,
            icon: <Icon.Share2 />,
            description: 'Buy a network port to add to a server.',
        },
        backup: {
            type: 'Backups',
            amount: 1,
            cost: costs.backups,
            icon: <Icon.Archive />,
            description: 'Buy a backup to keep your data secure.',
        },
        database: {
            type: 'Databases',
            amount: 1,
            cost: costs.databases,
            icon: <Icon.Database />,
            description: 'Buy a database to get and set data.',
        },
    };

    const resourceBlocks = layout.resources ?? defaultStoreLayout.resources;

    return (
        <PageContentBlock
            title={'Buy Resources'}
            description={'Buy more resources to add to your server.'}
            showFlashKey={'store:resources'}
        >
            <SpinnerOverlay size={'large'} visible={open} />
            <Dialog.Confirm
                open={open}
                onClose={() => setOpen(false)}
                title={'Confirm resource seletion'}
                confirm={'Continue'}
                onConfirmed={() => purchase(resource)}
            >
                Are you sure you want to purchase this resource ({resource})? This will deduct the cost from your
                balance and add the resource. This is not a reversible transaction.
            </Dialog.Confirm>
            {resourceBlocks.map((block, index) => {
                switch (block.type) {
                    case 'resource-grid': {
                        const resources = Array.isArray(block.resources) && block.resources.length
                            ? block.resources
                            : ['cpu', 'memory', 'disk', 'slot', 'port', 'backup', 'database'];
                        return (
                            <Container key={`resource-grid-${index}`} className={'lg:grid lg:grid-cols-4 my-10 gap-8'}>
                                {resources.map((resourceKey) => {
                                    const resourceDefinition = resourceDefinitions[resourceKey as keyof typeof resourceDefinitions];
                                    if (!resourceDefinition) {
                                        return null;
                                    }

                                    return (
                                        <PurchaseBox
                                            key={resourceKey}
                                            type={resourceDefinition.type}
                                            amount={resourceDefinition.amount}
                                            suffix={resourceDefinition.suffix}
                                            cost={resourceDefinition.cost}
                                            setOpen={setOpen}
                                            icon={resourceDefinition.icon}
                                            setResource={setResource}
                                            description={resourceDefinition.description}
                                        />
                                    );
                                })}
                            </Container>
                        );
                    }
                    case 'resource-tips':
                        return (
                            <Container key={`resource-tips-${index}`} className={'lg:grid lg:grid-cols-4 my-10 gap-8'}>
                                <TitledGreyBox title={block.title ?? 'How to use resources'}>
                                    <p className={'font-semibold'}>Adding to an existing server</p>
                                    <p className={'text-xs text-gray-500'}>
                                        If you have a server that is already deployed, you can add resources to it by going to the
                                        &apos;edit&apos; tab.
                                    </p>
                                    <p className={'font-semibold mt-1'}>Adding to a new server</p>
                                    <p className={'text-xs text-gray-500'}>
                                        You can buy resources and add them to a new server in the server creation page, which you can
                                        access via the store.
                                    </p>
                                </TitledGreyBox>
                            </Container>
                        );
                    case 'resource-cta':
                        return (
                            <div key={`resource-cta-${index}`} className={'flex justify-center items-center'}>
                                <div className={'bg-auto bg-center bg-storeone p-4 m-4 rounded-lg'}>
                                    <div className={'text-center bg-gray-900 bg-opacity-75 p-4'}>
                                        <h1 className={'text-4xl'}>{block.title ?? 'Ready to get started?'}</h1>
                                        {block.description && (
                                            <p className={'text-sm text-gray-300 mt-2'}>{block.description}</p>
                                        )}
                                        <Link to={block.link ?? '/store/create'}>
                                            <Button.Text className={'w-full mt-4'}>
                                                {block.linkLabel ?? 'Create a server'}
                                            </Button.Text>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    default:
                        return null;
                }
            })}
        </PageContentBlock>
    );
};
