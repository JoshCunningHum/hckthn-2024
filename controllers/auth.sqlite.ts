import type { InsertUser, User } from "~/schemas/user";

//#region Login

export type LoginResponse =
    | {
          error: string;
      }
    | User;

export type LoginParams = User;

export type LoginHandler = (param: LoginParams) => Promise<LoginResponse>;

export const login: LoginHandler = async ({ password, email }) => {
    throw new Error(`Not implemented yet`);
};

//#region Register

export type RegisterResponse =
    | {
          error: string;
      }
    | User;

export type RegisterParams = InsertUser;

export type RegisterHandler = (
    param: RegisterParams
) => Promise<RegisterResponse>;

export const register: RegisterHandler = async (params) => {
    throw new Error(`Not implemented yet`);
};
