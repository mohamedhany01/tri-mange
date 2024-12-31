import Payment from "@/types/Payment";
import Product from "@/types/Product";

export function getTotalPayments(
  payments: Payment[],
  initWith: number = 0,
): number {
  return payments.reduce((prev, curr) => prev + +curr.amount, initWith);
}

export async function resolveConcurrency(
  promises: (Promise<Product> | Promise<Payment> | Promise<string>)[],
): Promise<(Product | Payment | string)[]> {
  return await Promise.all(promises);
}
