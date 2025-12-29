import * as Icon from 'react-feather';
import { Form, Formik } from 'formik';
import useFlash from '@/plugins/useFlash';
import { useStoreState } from 'easy-peasy';
import { number, object, string } from 'yup';
import Field from '@/components/elements/Field';
import Select from '@/components/elements/Select';
import { Egg, getEggs } from '@/api/store/getEggs';
import createServer from '@/api/store/createServer';
import Spinner from '@/components/elements/Spinner';
import { getNodes, Node } from '@/api/store/getNodes';
import { getNests, Nest } from '@/api/store/getNests';
import { Button } from '@/components/elements/button';
import InputSpinner from '@/components/elements/InputSpinner';
import StoreError from '@/components/elements/store/StoreError';
import React, { ChangeEvent, useEffect, useState } from 'react';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import FlashMessageRender from '@/components/FlashMessageRender';
import StoreContainer from '@/components/elements/StoreContainer';
import { getResources, Resources } from '@/api/store/getResources';
import PageContentBlock from '@/components/elements/PageContentBlock';
import formatCurrency from '@/util/formatCurrency';
import { useLocation } from 'react-router-dom';
import { StorefrontProduct } from '@/state/storefront';
import { Costs, getCosts } from '@/api/store/getCosts';
import {
    faArchive,
    faCube,
    faDatabase,
    faEgg,
    faHdd,
    faLayerGroup,
    faList,
    faMemory,
    faMicrochip,
    faNetworkWired,
    faStickyNote,
} from '@fortawesome/free-solid-svg-icons';

interface CreateValues {
    name: string;
    description: string | null;
    cpu: number;
    memory: number;
    disk: number;
    ports: number;
    backups: number | null;
    databases: number | null;

    egg: number;
    nest: number;
    node: number;
}

export default () => {
    const [loading, setLoading] = useState(false);
    const [resources, setResources] = useState<Resources>();
    const [costs, setCosts] = useState<Costs>();

    const user = useStoreState((state) => state.user.data!);
    const currency = useStoreState((state) => state.storefront.data?.currency);
    const catalog = useStoreState((state) => state.storefront.data?.products);
    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const location = useLocation();

    const [egg, setEgg] = useState<number>(0);
    const [eggs, setEggs] = useState<Egg[]>();
    const [nest, setNest] = useState<number>(0);
    const [nests, setNests] = useState<Nest[]>();
    const [node, setNode] = useState<number>(0);
    const [nodes, setNodes] = useState<Node[]>();

    useEffect(() => {
        clearFlashes();

        getResources().then((resources) => setResources(resources));
        getCosts().then((costs) => setCosts(costs));

        getEggs().then((eggs) => setEggs(eggs));
        getNests().then((nests) => setNests(nests));
        getNodes().then((nodes) => setNodes(nodes));
    }, []);

    const productId = new URLSearchParams(location.search).get('product');
    const selectedProduct: StorefrontProduct | undefined = catalog?.products?.find(
        (product) => product.id === productId
    );

    const getPresetValue = (value: number | undefined, fallback: number, minimum: number) => {
        if (!value) return Math.max(minimum, fallback);

        return Math.max(minimum, Math.min(value, fallback));
    };

    const changeNest = (e: ChangeEvent<HTMLSelectElement>) => {
        setNest(parseInt(e.target.value));

        getEggs(parseInt(e.target.value)).then((eggs) => {
            setEggs(eggs);
            setEgg(eggs[0].id);
        });
    };

    const submit = (values: CreateValues) => {
        setLoading(true);
        clearFlashes('store:create');

        createServer(values, egg, nest, node)
            .then((data) => {
                if (!data.id) return;

                setLoading(false);
                clearFlashes('store:create');
                // @ts-expect-error this is valid
                window.location = `/server/${data.id}`;
            })
            .catch((error) => {
                setLoading(false);
                clearAndAddHttpError({ key: 'store:create', error });
            });
    };

    if (!resources) return <Spinner size={'large'} centered />;

    if (!nodes) {
        return (
            <StoreError
                message={'No nodes are available for deployment. Try again later.'}
                admin={'Ensure you have at least one node that can be deployed to.'}
            />
        );
    }

    if (!nests || !eggs) {
        return (
            <StoreError
                message={'No server types are available for deployment. Try again later.'}
                admin={'Ensure you have at least one egg which is in a public nest.'}
            />
        );
    }

        return (
            <PageContentBlock title={'Create Server'} showFlashKey={'store:create'}>
                <Formik
                    onSubmit={submit}
                    enableReinitialize
                    initialValues={{
                        name: `${user.username}'s server`,
                        description: selectedProduct
                            ? `${selectedProduct.name} plan from the storefront.`
                            : 'Write a server description here.',
                        cpu: getPresetValue(selectedProduct?.provisioning?.cpu, resources.cpu, 25),
                        memory: getPresetValue(selectedProduct?.provisioning?.memory, resources.memory, 256),
                        disk: getPresetValue(selectedProduct?.provisioning?.disk, resources.disk, 256),
                        ports: getPresetValue(selectedProduct?.provisioning?.ports, resources.ports, 1),
                        backups: selectedProduct?.provisioning?.backups ?? resources.backups,
                        databases: selectedProduct?.provisioning?.databases ?? resources.databases,
                        nest: 1,
                        egg: 1,
                        node: 1,
                    }}
                    validationSchema={object().shape({
                        name: string().required().min(3),
                        description: string().optional().min(3).max(191),

                        cpu: number().required().min(25).max(resources.cpu),
                        memory: number().required().min(256).max(resources.memory),
                        disk: number().required().min(256).max(resources.disk),

                        ports: number().required().min(1).max(resources.ports),
                        backups: number().optional().max(resources.backups),
                        databases: number().optional().max(resources.databases),

                        node: number().required().default(node),
                        nest: number().required().default(nest),
                        egg: number().required().default(egg),
                    })}
                >
                    {({ values }) => {
                        const resourceLineItems = [
                            {
                                label: 'CPU',
                                value: `${values.cpu}%`,
                                cost: costs ? (values.cpu / 50) * costs.cpu : undefined,
                            },
                            {
                                label: 'Memory',
                                value: `${values.memory} MB`,
                                cost: costs ? (values.memory / 1024) * costs.memory : undefined,
                            },
                            {
                                label: 'Disk',
                                value: `${values.disk} MB`,
                                cost: costs ? (values.disk / 1024) * costs.disk : undefined,
                            },
                            {
                                label: 'Ports',
                                value: `${values.ports}`,
                                cost: costs ? values.ports * costs.ports : undefined,
                            },
                            {
                                label: 'Backups',
                                value: `${values.backups ?? 0}`,
                                cost: costs ? (values.backups ?? 0) * costs.backups : undefined,
                            },
                            {
                                label: 'Databases',
                                value: `${values.databases ?? 0}`,
                                cost: costs ? (values.databases ?? 0) * costs.databases : undefined,
                            },
                        ];

                        const estimatedMonthlyCost = costs
                            ? resourceLineItems.reduce((total, item) => total + (item.cost ?? 0), 0)
                            : selectedProduct?.price;

                        return (
                            <Form>
                                <div className={'lg:grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start'}>
                                    <div>
                                        {selectedProduct && (
                                            <div className={'bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6'}>
                                                <h2 className={'text-xl font-semibold'}>Checkout preset applied</h2>
                                                <p className={'text-sm text-neutral-400'}>
                                                    {selectedProduct.name} has prefilled resource limits. You can
                                                    still customize them below before provisioning.
                                                </p>
                                            </div>
                                        )}
                                        <h1 className={'text-5xl'}>Basic Details</h1>
                                        <h3 className={'text-2xl text-neutral-500'}>
                                            Set the basic fields for your new server.
                                        </h3>
                                        <StoreContainer className={'lg:grid lg:grid-cols-2 my-10 gap-4'}>
                                            <TitledGreyBox
                                                title={'Server name'}
                                                icon={faStickyNote}
                                                className={'mt-8 sm:mt-0'}
                                            >
                                                <Field name={'name'} />
                                                <p className={'mt-1 text-xs'}>
                                                    Assign a name to your server for use in the Panel.
                                                </p>
                                                <p className={'mt-1 text-xs text-gray-400'}>
                                                    Character limits: <code>a-z A-Z 0-9 _ - .</code> and{' '}
                                                    <code>[Space]</code>.
                                                </p>
                                            </TitledGreyBox>
                                            <TitledGreyBox
                                                title={'Server description'}
                                                icon={faList}
                                                className={'mt-8 sm:mt-0'}
                                            >
                                                <Field name={'description'} />
                                                <p className={'mt-1 text-xs'}>Set a description for your server.</p>
                                                <p className={'mt-1 text-xs text-yellow-400'}>* Optional</p>
                                            </TitledGreyBox>
                                        </StoreContainer>
                                        <h1 className={'text-5xl'}>Resource Limits</h1>
                                        <h3 className={'text-2xl text-neutral-500'}>
                                            Set specific limits for CPU, RAM and more.
                                        </h3>
                                        <StoreContainer className={'lg:grid lg:grid-cols-3 my-10 gap-4'}>
                                            <TitledGreyBox
                                                title={'Server CPU limit'}
                                                icon={faMicrochip}
                                                className={'mt-8 sm:mt-0'}
                                            >
                                                <Field name={'cpu'} />
                                                <p className={'mt-1 text-xs'}>Assign a limit for usable CPU.</p>
                                                <p className={'mt-1 text-xs text-gray-400'}>
                                                    {resources.cpu}% in account
                                                </p>
                                            </TitledGreyBox>
                                            <TitledGreyBox
                                                title={'Server RAM limit'}
                                                icon={faMemory}
                                                className={'mt-8 sm:mt-0'}
                                            >
                                                <div className={'relative'}>
                                                    <Field name={'memory'} />
                                                    <p
                                                        className={
                                                            'absolute text-sm top-1.5 right-2 bg-gray-700 p-2 rounded-lg'
                                                        }
                                                    >
                                                        MB
                                                    </p>
                                                </div>
                                                <p className={'mt-1 text-xs'}>Assign a limit for usable RAM.</p>
                                                <p className={'mt-1 text-xs text-gray-400'}>
                                                    {resources.memory}MB available
                                                </p>
                                            </TitledGreyBox>
                                            <TitledGreyBox
                                                title={'Server Storage limit'}
                                                icon={faHdd}
                                                className={'mt-8 sm:mt-0'}
                                            >
                                                <div className={'relative'}>
                                                    <Field name={'disk'} />
                                                    <p
                                                        className={
                                                            'absolute text-sm top-1.5 right-2 bg-gray-700 p-2 rounded-lg'
                                                        }
                                                    >
                                                        MB
                                                    </p>
                                                </div>
                                                <p className={'mt-1 text-xs'}>Assign a limit for usable storage.</p>
                                                <p className={'mt-1 text-xs text-gray-400'}>
                                                    {resources.disk}MB available
                                                </p>
                                            </TitledGreyBox>
                                        </StoreContainer>
                                        <h1 className={'text-5xl'}>Feature Limits</h1>
                                        <h3 className={'text-2xl text-neutral-500'}>
                                            Add databases, allocations and ports to your server.
                                        </h3>
                                        <StoreContainer className={'lg:grid lg:grid-cols-3 my-10 gap-4'}>
                                            <TitledGreyBox
                                                title={'Server allocations'}
                                                icon={faNetworkWired}
                                                className={'mt-8 sm:mt-0'}
                                            >
                                                <Field name={'ports'} />
                                                <p className={'mt-1 text-xs'}>
                                                    Assign a number of ports to your server.
                                                </p>
                                                <p className={'mt-1 text-xs text-gray-400'}>
                                                    {resources.ports} available
                                                </p>
                                            </TitledGreyBox>
                                            <TitledGreyBox
                                                title={'Server backups'}
                                                icon={faArchive}
                                                className={'mt-8 sm:mt-0'}
                                            >
                                                <Field name={'backups'} />
                                                <p className={'mt-1 text-xs'}>Assign a number of backups to your server.</p>
                                                <p className={'mt-1 text-xs text-gray-400'}>
                                                    {resources.backups} available
                                                </p>
                                            </TitledGreyBox>
                                            <TitledGreyBox
                                                title={'Server databases'}
                                                icon={faDatabase}
                                                className={'mt-8 sm:mt-0'}
                                            >
                                                <Field name={'databases'} />
                                                <p className={'mt-1 text-xs'}>
                                                    Assign a number of databases to your server.
                                                </p>
                                                <p className={'mt-1 text-xs text-gray-400'}>
                                                    {resources.databases} available
                                                </p>
                                            </TitledGreyBox>
                                        </StoreContainer>
                                        <h1 className={'text-5xl'}>Deployment</h1>
                                        <h3 className={'text-2xl text-neutral-500'}>Choose a node and server type.</h3>
                                        <StoreContainer className={'lg:grid lg:grid-cols-3 my-10 gap-4'}>
                                            <TitledGreyBox
                                                title={'Available Nodes'}
                                                icon={faLayerGroup}
                                                className={'mt-8 sm:mt-0'}
                                            >
                                                <Select name={'node'} onChange={(e) => setNode(parseInt(e.target.value))}>
                                                    {!node && <option>Select a node...</option>}
                                                    {nodes.map((n) => (
                                                        <option key={n.id} value={n.id}>
                                                            {n.name} ({n.location}) |{' '}
                                                            {100 - parseInt(((n?.used / n?.total) * 100).toFixed(0))}% free
                                                            | {formatCurrency(n.deployFee, currency)}
                                                        </option>
                                                    ))}
                                                </Select>
                                                <p className={'mt-1 text-xs text-gray-400'}>
                                                    Select a node to deploy your server to.
                                                </p>
                                            </TitledGreyBox>
                                            <TitledGreyBox
                                                title={'Server Nest'}
                                                icon={faCube}
                                                className={'mt-8 sm:mt-0'}
                                            >
                                                <Select name={'nest'} onChange={(nest) => changeNest(nest)}>
                                                    {!nest && <option>Select a nest...</option>}
                                                    {nests.map((n) => (
                                                        <option key={n.id} value={n.id}>
                                                            {n.name}
                                                        </option>
                                                    ))}
                                                </Select>
                                                <p className={'mt-1 text-xs text-gray-400'}>
                                                    Select a nest to use for your server.
                                                </p>
                                            </TitledGreyBox>
                                            <TitledGreyBox title={'Server Egg'} icon={faEgg} className={'mt-8 sm:mt-0'}>
                                                <Select name={'egg'} onChange={(e) => setEgg(parseInt(e.target.value))}>
                                                    {!egg && <option>Select an egg...</option>}
                                                    {eggs.map((e) => (
                                                        <option key={e.id} value={e.id}>
                                                            {e.name}
                                                        </option>
                                                    ))}
                                                </Select>
                                                <p className={'mt-1 text-xs text-gray-400'}>
                                                    Choose what game you want to run on your server.
                                                </p>
                                            </TitledGreyBox>
                                        </StoreContainer>
                                        <InputSpinner visible={loading}>
                                            <FlashMessageRender byKey={'store:create'} className={'my-2'} />
                                            <div className={'text-right'}>
                                                <Button
                                                    type={'submit'}
                                                    className={'w-1/6 mb-4'}
                                                    size={Button.Sizes.Large}
                                                    disabled={loading}
                                                >
                                                    <Icon.Server className={'mr-2'} /> Create
                                                </Button>
                                            </div>
                                        </InputSpinner>
                                    </div>
                                    <div className={'lg:sticky lg:top-6'}>
                                        <div className={'bg-gray-800 border border-gray-700 rounded-lg p-6'}>
                                            <div className={'flex items-center justify-between'}>
                                                <div>
                                                    <p className={'text-sm uppercase tracking-wide text-neutral-400'}>
                                                        Order summary
                                                    </p>
                                                    <h2 className={'text-xl font-semibold'}>
                                                        {selectedProduct?.name ?? 'Custom server'}
                                                    </h2>
                                                    {selectedProduct?.billing && (
                                                        <p className={'text-xs text-neutral-400'}>
                                                            Billing: {selectedProduct.billing}
                                                        </p>
                                                    )}
                                                </div>
                                                {selectedProduct?.price !== undefined && (
                                                    <span className={'text-lg font-semibold'}>
                                                        {formatCurrency(selectedProduct.price, currency)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className={'mt-4 border-t border-gray-700 pt-4'}>
                                                <h3 className={'text-sm font-semibold uppercase text-neutral-400'}>
                                                    Selected resources
                                                </h3>
                                                <div className={'mt-3 space-y-2 text-sm'}>
                                                    {resourceLineItems.map((item) => (
                                                        <div key={item.label} className={'flex items-center justify-between'}>
                                                            <span className={'text-neutral-300'}>
                                                                {item.label}: {item.value}
                                                            </span>
                                                            {item.cost !== undefined && (
                                                                <span className={'text-neutral-400'}>
                                                                    {formatCurrency(item.cost, currency)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className={'mt-4 flex items-center justify-between text-base font-semibold'}>
                                                    <span>Estimated monthly</span>
                                                    <span>
                                                        {estimatedMonthlyCost !== undefined
                                                            ? formatCurrency(estimatedMonthlyCost, currency)
                                                            : '—'}
                                                    </span>
                                                </div>
                                                {!costs && selectedProduct?.price !== undefined && (
                                                    <p className={'mt-2 text-xs text-neutral-500'}>
                                                        Showing plan price while resource pricing loads.
                                                    </p>
                                                )}
                                            </div>
                                            {selectedProduct && (
                                                <div className={'mt-6 border-t border-gray-700 pt-4'}>
                                                    <h3 className={'text-sm font-semibold uppercase text-neutral-400'}>
                                                        Plan details
                                                    </h3>
                                                    <div className={'mt-3 space-y-2 text-sm text-neutral-300'}>
                                                        <p>CPU: {selectedProduct.specs.cpu}</p>
                                                        <p>RAM: {selectedProduct.specs.memory}</p>
                                                        <p>Disk: {selectedProduct.specs.disk}</p>
                                                        <p>Bandwidth: {selectedProduct.specs.bandwidth}</p>
                                                    </div>
                                                    {selectedProduct.features && selectedProduct.features.length > 0 && (
                                                        <div className={'mt-4'}>
                                                            <p className={'text-sm font-semibold text-neutral-300'}>
                                                                Features
                                                            </p>
                                                            <ul className={'mt-2 list-disc list-inside text-sm text-neutral-400'}>
                                                                {selectedProduct.features.map((feature) => (
                                                                    <li key={feature}>{feature}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
        </PageContentBlock>
    );
};
