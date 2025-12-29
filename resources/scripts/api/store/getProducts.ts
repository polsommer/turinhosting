import http from '@/api/http';
import { StorefrontCatalog } from '@/state/storefront';

export const getProducts = async (): Promise<StorefrontCatalog> => {
    const { data } = await http.get('/api/client/store/products');

    return data;
};
