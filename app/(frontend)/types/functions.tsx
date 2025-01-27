import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export function formatDates(data: string): string {
    // Parse the input as UTC and keep it as UTC
    const utcDate = toZonedTime(data, 'UTC');
    return format(utcDate, 'yyyy-MM-dd HH:mm:ss');
}
export  const getFinalPrice = (product: any) => {
        if (product.discount) {
            return product.price - (product.price * product.discount / 100)
        }
        return product.price
    }