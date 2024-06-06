import * as yup from "yup";

// !: Change for actual user schema
export type User = {
    username: string;
    password: string;
    email: string;
};

export const login_schema = yup.object({
    username: yup.string().required("Username is required"),
    password: yup
        .string()
        .required("Password is required")
        .min(4, "Password minimum of 4 characters"),
});

export const register_schema = yup.object({
    username: yup.string().required("Username is required"),
    email: yup
        .string()
        .required("Email is required")
        .email("Not a valid email"),
    password: yup
        .string()
        .required("Password is required")
        .min(4, "Password minimum of 4 characters"),
    confirmpassword: yup
        .string()
        .oneOf([yup.ref("password"), ""], "Passwords must match"),
});
