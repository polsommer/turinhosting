import http, { FractalResponseData } from '@/api/http';
import { rawDataToCategory, Category } from '@/api/billing/getCategories';
import { rawDataToProduct, Product } from '@/api/billing/products';

export interface PublicPricingPayload {
    enabled: boolean;
    currency: {
        symbol: string;
        code: string;
    };
    categories: Category[];
    products: Product[];
}

interface PublicPricingResponse {
    enabled: boolean;
    currency: {
        symbol: string;
        code: string;
    };
    categories: FractalResponseData[];
    products: FractalResponseData[];
}

export const getPublicPricing = async (): Promise<PublicPricingPayload> => {
    const { data } = await http.get<PublicPricingResponse>('/api/public/pricing');

    return {
        enabled: data.enabled,
        currency: data.currency,
        categories: (data.categories || []).map(rawDataToCategory),
        products: (data.products || []).map(rawDataToProduct),
    };
};
