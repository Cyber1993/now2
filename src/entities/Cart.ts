import { IProductPreview } from "./Product.ts";

export interface ICartItem {
  id: number;
  cartId: number;
  quantity: number;
  product: IProductPreview;
}
