import { action, Action } from 'easy-peasy';

export interface StorefrontSettings {
    enabled: boolean;
    currency: string;
    products?: StorefrontCatalog;
    layout?: StorefrontLayout;
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

export type StorefrontLayoutBlock =
    | { type: 'hero' }
    | { type: 'banners' }
    | {
          type: 'featured';
          title?: string;
          description?: string;
          productIds?: string[];
          categoryIds?: string[];
          limit?: number;
      }
    | { type: 'catalog'; title?: string; description?: string }
    | { type: 'resource-grid'; resources?: string[] }
    | { type: 'resource-tips'; title?: string }
    | { type: 'resource-cta'; title?: string; description?: string; link?: string; linkLabel?: string }
    | { type: 'balance-summary'; balanceTitle?: string; gatewaysTitle?: string }
    | { type: 'earnings'; title?: string; description?: string }
    | { type: string; [key: string]: unknown };

export interface StorefrontLayout {
    overview: StorefrontLayoutBlock[];
    resources: StorefrontLayoutBlock[];
    purchase: StorefrontLayoutBlock[];
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
    tag?: string;
    features?: string[];
    highlight?: boolean;
    region?: string;
    cta?: string;
}

export interface StorefrontCategory {
    id: string;
    name: string;
    description?: string;
    icon?: string;
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

export const defaultStoreLayout: StorefrontLayout = {
    overview: [{ type: 'hero' }, { type: 'banners' }, { type: 'featured' }, { type: 'catalog' }],
    resources: [{ type: 'resource-grid' }, { type: 'resource-tips' }, { type: 'resource-cta' }],
    purchase: [{ type: 'balance-summary' }, { type: 'earnings' }],
};

const storefront: StorefrontStore = {
    data: undefined,

    setStorefront: action((state, payload) => {
        state.data = {
            ...payload,
            layout: payload.layout ?? defaultStoreLayout,
        };
    }),

    setStorefrontProducts: action((state, payload) => {
        if (!state.data) {
            state.data = {
                enabled: false,
                currency: 'USD',
                layout: defaultStoreLayout,
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
