import { IUser } from "./User";

export interface IComment {
  id: number;
  text:string;
  date:Date;
  ProductId:number;
  UserId:string;
  user:IUser;
  rating:number;
}
export interface ICommentCreate {
  text:string;
  rating:number;
  images?: File[];

}