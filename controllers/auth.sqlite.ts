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
    const res = await fetch(useBackendUrl() + "/auth/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: jsonToUrlEncoded({ email, password }),
    });

    if (res.status !== 201) return { error: "Login Credentials Invalid" };

    const { email: em, user_id } = await res.json();

    return { email, password: "", id: user_id, first_name: "" };
};

//#region Register

export type RegisterResponse =
    | {
          error: string;
      }
    | InsertUser;

export type RegisterParams = InsertUser;

export type RegisterHandler = (
    param: RegisterParams
) => Promise<RegisterResponse>;

export const register: RegisterHandler = async (params) => {
    const res = await fetch(useBackendUrl() + "/auth/signup/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: jsonToUrlEncoded(params),
    });

    // @ts-expect-error trust me bro
    if (res.status !== 200) return { error: res.message };

    return params;
};
