const DEFAULT_FORMATTED = '$0.00';
const toNumber = (value) => {
    if (value === null || value === undefined) {
        return null;
    }
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
};
export const formatCurrency = (value, fallback = DEFAULT_FORMATTED) => {
    const num = toNumber(value);
    if (num === null) {
        return fallback;
    }
    return `$${num.toFixed(2)}`;
};
