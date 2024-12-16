export default interface Payment {
  type: "Payment";
  id: string;
  amount: string;
  created?: string;
  note?: string;
  productId: string;
  clientId: string;
}
