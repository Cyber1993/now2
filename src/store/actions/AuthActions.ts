import http_common from "../../http_common.ts";
import { AuthUserActionType, LoginSuccessAction } from "../../entities/Auth.ts";
import { Dispatch } from "react";
import { IUser } from "../../entities/User.ts";
import { jwtDecode } from "jwt-decode";

export const LoginUserAction = async (
  dispatch: Dispatch<LoginSuccessAction>,
  token: string,
  authUserActionType: AuthUserActionType,
) => {
  http_common.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  localStorage.token = token;

  const user: IUser = jwtDecode(token) as IUser;

  dispatch(<LoginSuccessAction>{
    type: authUserActionType,
    payload: {
      id: user.id,
      userName: user.userName,
      lastName: user.lastName,
      firstName: user.firstName,
      dateCreated: user.dateCreated,
      image: user.image,
      sex: user.sex,
      position: user.position,
      phoneNumber: user.phoneNumber,
      email: user.email,
      roles: user.roles,
      comments: [],
      addressId: 0,
    },
  });
};

export const LogOut =  () => {
    localStorage.removeItem("token");
    localStorage.removeItem(localStorage.token);
    localStorage.clear;
};
