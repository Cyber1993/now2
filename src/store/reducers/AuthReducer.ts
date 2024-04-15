import {
  AuthUserActions,
  AuthUserActionType,
  IAuthUser,
} from "../../entities/Auth.ts";
import { IUser } from "../../entities/User.ts";

const initState: IAuthUser = {
  isAuth: false,
  user: undefined,
  isGoogle: false
};

export const AuthReducer = (
  state = initState,
  action: AuthUserActions,
): IAuthUser => {
  switch (action.type) {
    case AuthUserActionType.LOGIN_GOOGLE_USER: {
      const user = action.payload as IUser;
      return {
        isAuth: true,
        isGoogle: true,
        user,
        userId: user.id,
      };
    }
    case AuthUserActionType.LOGIN_USER: {
      const user = action.payload as IUser;
      return {
        isAuth: true,
        isGoogle: false,
        user,
        userId: user.id,
      };
    }
    case AuthUserActionType.LOGOUT_USER: {
      return {
        user: undefined,
        isAuth: false,
        isGoogle: false,
        userId: undefined,
      };
    }
  }
  return state;
};
