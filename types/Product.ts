export default interface Product {
  type: "Product";
  id: string;
  name: string;
  totalPrice: string;
  created?: string;
  note?: string;
  clientId: string;
}
