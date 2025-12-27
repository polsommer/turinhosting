import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockGet = vi.fn();
const mockDelete = vi.fn();
const mockPut = vi.fn();

vi.mock('@/api/http', () => ({
    default: {
        get: mockGet,
        delete: mockDelete,
        put: mockPut,
    },
}));

import { deleteStripeKeys, getBillingAnalytics, updateSettings } from '@/api/admin/billing';

describe('billing integration API', () => {
    beforeEach(() => {
        mockGet.mockReset();
        mockDelete.mockReset();
        mockPut.mockReset();
    });

    it('fetches billing analytics', async () => {
        mockGet.mockResolvedValue({ data: { revenue: 1200 } });

        await expect(getBillingAnalytics()).resolves.toEqual({ revenue: 1200 });
        expect(mockGet).toHaveBeenCalledWith('/api/application/billing/analytics');
    });

    it('deletes Stripe keys', async () => {
        mockDelete.mockResolvedValue({});

        await expect(deleteStripeKeys()).resolves.toBeUndefined();
        expect(mockDelete).toHaveBeenCalledWith('/api/application/billing/keys');
    });

    it('updates billing settings', async () => {
        mockPut.mockResolvedValue({});

        await expect(updateSettings('currency:code', 'USD')).resolves.toBeUndefined();
        expect(mockPut).toHaveBeenCalledWith('/api/application/billing/settings', {
            key: 'currency:code',
            value: 'USD',
        });
    });
});
