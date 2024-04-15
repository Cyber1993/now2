export interface ICreditCardCreate {
  cardHolder: string;
  cardNumber: string;
  cvv: string;
  expiryDate: Date;
  userId?: string | null;
}
