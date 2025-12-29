import http from '@/api/http';
import { StoreProductCatalog } from '@/state/storefront';

export const getStoreProducts = async (): Promise<StoreProductCatalog> => {
    return new Promise((resolve, reject) => {
        http.get('/api/client/store/products')
            .then(({ data }) => resolve(data))
            .catch(reject);
    });
};
