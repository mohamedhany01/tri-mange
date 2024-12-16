export default interface Client {
  type: "Client";
  id: string;
  name: string;
  phoneNumber?: string;
  note?: string;
}
