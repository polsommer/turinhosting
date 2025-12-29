import { action, Action } from 'easy-peasy';

export interface StorefrontSettings {
    enabled: boolean;
    currency: string;
    products?: StorefrontCatalog;
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

export interface StorefrontProductSpecs {
    cpu: string;
    memory: string;
    disk: string;
    bandwidth: string;
}

export interface StorefrontProductProvisioning {
    cpu: number;
    memory: number;
    disk: number;
    ports: number;
    backups: number;
    databases: number;
}

export interface StorefrontProduct {
    id: string;
    name: string;
    category: string;
    price: number;
    billing: string;
    specs: StorefrontProductSpecs;
    provisioning?: StorefrontProductProvisioning;
}

export interface StorefrontCategory {
    id: string;
    name: string;
    description?: string;
}

export interface StorefrontCatalog {
    categories: StorefrontCategory[];
    products: StorefrontProduct[];
}

export interface StorefrontStore {
    data?: StorefrontSettings;
    setStorefront: Action<StorefrontStore, StorefrontSettings>;
    setStorefrontProducts: Action<StorefrontStore, StorefrontCatalog>;
}

const storefront: StorefrontStore = {
    data: undefined,

    setStorefront: action((state, payload) => {
        state.data = payload;
    }),

    setStorefrontProducts: action((state, payload) => {
        if (!state.data) {
            state.data = {
                enabled: false,
                currency: 'USD',
                renewals: { cost: 0, days: 0 },
                editing: { enabled: false },
                deletion: { enabled: false },
                referrals: { enabled: false, reward: 0, days: 0 },
                cost: { cpu: 0, memory: 0, disk: 0, slot: 0, port: 0, backup: 0, database: 0 },
                gateways: { paypal: false, stripe: false },
                earn: { enabled: false, amount: 0 },
            };
        }

        state.data.products = payload;
    }),
};

export default storefront;
