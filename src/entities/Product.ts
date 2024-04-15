import { IComment } from "./Comment";
import { ICategory } from "./Category.ts";

export interface IProduct {
  id: string;
  title: string;
  price: number;
  rating: number;
  images: GetProductImageDto[];
  description: string;
  categoryId: number;
  discount?: number;
}

export interface GetProductImageDto {
  id: number;
  image: string;
  productId: number;
}

export interface IProductEdit {
  title: string;
  description: string;
  price: number;
  rating: number;
  images: File[];
  categoryId: number;
  discount?: number;
  deliveryKit: string;
  isStock: boolean;
}
export interface IProductCreate {
  title: string;
  description: string;
  price: number;
  rating: number;
  images: File[];
  categoryId: number;
  discount?: number;
  deliveryKit: string;
  isStock: boolean;
}

export interface IProductPreview {
  id: number;
  title: string;
  price: number;
  image: string;
  discount: number;
  isFavorite: boolean | null;
  category?: ICategory;
}

export interface IProductDetail {
  id: number;
  title: string;
  price: number;
  images: IProductImage[];
  description: string;
  rating: number;
  comments: IComment[];
  deliveryKit: string;
  discount: number;
  category?: ICategory;
  isStock: boolean;
  isFavorite:boolean | null;
}
export interface IProductList<T> {
  items: T[];
}

export interface IProductImage {
  id: number;
  image: string;
  productId: number;
}
