import { IUser } from "./User.ts";

export interface ILogin {
  password: string;
  email: string;
}

export interface IRegister {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  image: File | null;
}

export interface IProfile {
  userName?: string,
  firstName?: string;
  lastName?: string;
  email?: string;
  sex?: string;
  position?: string;
  phoneNumber?: string;
  image?: File | null;
}

export interface IPassword {
  userName?: string,
  oldPassword?: string;
  newPassword?: string;
  newPasswordConfirmation?: string;
}

export interface IProfile {
  userName?: string,
  firstName?: string;
}

export enum AuthUserActionType {
  LOGIN_USER = "AUTH_LOGIN_USER",
  LOGIN_GOOGLE_USER = "AUTH_LOGIN_GOOGLE_USER",
  LOGOUT_USER = "AUTH_LOGOUT_USER",
}

export interface IAuthUser {
  isAuth: boolean;
  isGoogle: boolean;
  user?: IUser;
  userId?: string;
}

export interface LoginSuccessAction {
  type: AuthUserActionType.LOGIN_USER;
  payload: IUser;
}

export interface LoginGoogleSuccessAction {
  type: AuthUserActionType.LOGIN_GOOGLE_USER;
  payload: IUser;
}

export interface LogoutUserAction {
  type: AuthUserActionType.LOGOUT_USER;
}

export type AuthUserActions =
  | LoginSuccessAction
  | LoginGoogleSuccessAction
  | LogoutUserAction;
