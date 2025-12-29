const DEFAULT_CURRENCY = 'USD';

const formatCurrency = (amount: number, currency?: string, locales?: string | string[]) => {
    const resolvedCurrency = currency ?? DEFAULT_CURRENCY;

    return new Intl.NumberFormat(locales, {
        style: 'currency',
        currency: resolvedCurrency,
    }).format(amount);
};

export default formatCurrency;
