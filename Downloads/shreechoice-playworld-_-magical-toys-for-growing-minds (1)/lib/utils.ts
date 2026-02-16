
/**
 * Formats a number as Indian Rupees (INR).
 * @param amount The number to format.
 * @returns A formatted currency string, e.g., "₹1,299.00".
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amount);
};
