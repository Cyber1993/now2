export interface IOrderCreate {
  userId: string;
  addressId?: number | null;
  creditCardId?: number | null;
  postalAddress?: string | null;
  purchasePrice: number;
  deliveryPrice: number;
  totalPrice: number;
  orderStatus: string;
  recipient: string;
}
