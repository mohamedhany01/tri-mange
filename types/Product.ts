export default interface Product {
  type: "Product";
  id: string;
  name: string;
  totalPrice: string;
  isFullyPaid: boolean;
  created?: string;
  note?: string;
  clientId: string;
}
