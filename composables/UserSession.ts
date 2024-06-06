import type { Maybe } from "yup";
import type { User } from "~/schemas/user";

export const useUserSession = () => {
    const state = useCookie<Maybe<User>>("session-user");

    const isloggedin = computed(() => !!state.value);

    const login = (user: User) => {
        state.value = user;
    };

    const logout = () => {
        state.value = undefined;
    };

    return {
        state,
        isloggedin,
        login,
        logout,
    };
};
