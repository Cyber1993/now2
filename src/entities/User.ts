import { IComment } from "./Comment";

export interface  IUser {
  id: string;
  email: string;
  image: string;
  userName: string;
  lastName: string;
  firstName: string;
  dateCreated: Date;
  phoneNumber: string;
  sex: string;
  position: string;
  roles: string[];
  comments: IComment[];
  addressId: number;
}

export interface IUserEdit {
  email: string;
  userName: string;
  lastName: string;
  sex: string;
  position: string;
  firstName: string;
  phoneNumber: string;
  image: File | null;
  roles: string[];
}
