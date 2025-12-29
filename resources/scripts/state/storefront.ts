import { action, Action } from 'easy-peasy';

export interface StorefrontSettings {
    enabled: boolean;
    currency: string;
    renewals: {
        cost: number;
        days: number;
    };
    editing: {
        enabled: boolean;
    };
    deletion: {
        enabled: boolean;
    };
    referrals: {
        enabled: boolean;
        reward: number;
        days: number;
    };
    cost: {
        cpu: number;
        memory: number;
        disk: number;
        slot: number;
        port: number;
        backup: number;
        database: number;
    };
    gateways: {
        paypal: boolean;
        stripe: boolean;
    };
    earn: {
        enabled: boolean;
        amount: number;
    };
}

export interface StoreProductSpecs {
    cpu: string;
    memory: string;
    disk: string;
    bandwidth: string;
}

export interface StoreProductResources {
    cpu: number;
    memory: number;
    disk: number;
    ports: number;
    backups: number;
    databases: number;
}

export interface StoreProduct {
    id: string;
    name: string;
    description: string;
    type: 'vps' | 'game';
    price: number;
    billing: string;
    specs: StoreProductSpecs;
    resources: StoreProductResources;
}

export interface StoreProductCategory {
    id: string;
    name: string;
    description: string;
    products: StoreProduct[];
}

export interface StoreProductCatalog {
    categories: StoreProductCategory[];
}

export interface StorefrontStore {
    data?: StorefrontSettings;
    products?: StoreProductCatalog;
    setStorefront: Action<StorefrontStore, StorefrontSettings>;
    setProductCatalog: Action<StorefrontStore, StoreProductCatalog>;
}

const storefront: StorefrontStore = {
    data: undefined,
    products: undefined,

    setStorefront: action((state, payload) => {
        state.data = payload;
    }),

    setProductCatalog: action((state, payload) => {
        state.products = payload;
    }),
};

export default storefront;
