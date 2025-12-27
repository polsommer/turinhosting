import { z } from 'zod';
import http from '@/api/http';

const checkoutSchema = z.object({
    successUrl: z.string().url(),
    cancelUrl: z.string().url(),
});

const portalSchema = z.object({
    returnUrl: z.string().url().optional(),
});

export interface CheckoutSessionResponse {
    id: string;
    url: string | null;
}

export interface PortalSessionResponse {
    url: string;
}

export interface InvoiceStub {
    id: string;
    status: string;
    amount: number;
    hostedInvoiceUrl?: string;
}

export interface InvoiceListResponse {
    data: InvoiceStub[];
    generated_at: string;
}

export const createSubscriptionCheckout = (payload: z.infer<typeof checkoutSchema>): Promise<CheckoutSessionResponse> => {
    const data = checkoutSchema.parse(payload);

    return new Promise((resolve, reject) => {
        http.post('/api/client/billing/checkout/subscription', {
            success_url: data.successUrl,
            cancel_url: data.cancelUrl,
        })
            .then(({ data: response }) => resolve(response))
            .catch(reject);
    });
};

export const createOneOffCheckout = (payload: z.infer<typeof checkoutSchema>): Promise<CheckoutSessionResponse> => {
    const data = checkoutSchema.parse(payload);

    return new Promise((resolve, reject) => {
        http.post('/api/client/billing/checkout/one-off', {
            success_url: data.successUrl,
            cancel_url: data.cancelUrl,
        })
            .then(({ data: response }) => resolve(response))
            .catch(reject);
    });
};

export const createBillingPortal = (payload: z.infer<typeof portalSchema> = {}): Promise<PortalSessionResponse> => {
    const data = portalSchema.parse(payload);

    return new Promise((resolve, reject) => {
        http.post('/api/client/billing/portal', {
            return_url: data.returnUrl,
        })
            .then(({ data: response }) => resolve(response))
            .catch(reject);
    });
};

export const getInvoices = (): Promise<InvoiceListResponse> => {
    return new Promise((resolve, reject) => {
        http.get('/api/client/billing/invoices')
            .then(({ data }) => resolve(data))
            .catch(reject);
    });
};
