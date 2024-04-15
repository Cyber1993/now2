export interface IPromoCode {
  id: number;
  code: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  remainingUses?: number;
}
