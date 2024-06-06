import * as yup from "yup";

// !: Change for actual user schema
export type User = {
    email: string;
    password: string;
};

export const login_schema = yup.object({
    email: yup
        .string()
        .required("Username is required")
        .email(`Not a valid email`),
    password: yup
        .string()
        .required("Password is required")
        .min(4, "Password minimum of 4 characters"),
});

// For registration
export type InsertUser = {
    email: string;
    password: string;
    confirmPassword: string;
    first_name: string;
    last_name: string;

    age?: number;
    nationality?: string;
    province?: string;
    city?: string;
    zipcode?: string;
    phone?: string;
    height?: number;
    weight?: number;
};

export const register_schema = yup.object({
    email: yup.string().required("Email is required"),
    password: yup
        .string()
        .required("Password is required")
        .min(4, "Password minimum of 4 characters"),
    confirmPassword: yup
        .string()
        .required(`Please confirm password`)
        .oneOf([yup.ref("password")], "Password does not match"),
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),

    age: yup.number().min(0, "Please input a valid age"),
    nationality: yup.string(),
    province: yup.string(),
    city: yup.string(),
    zipcode: yup.string(),

    phone: yup.string(),
    height: yup.number().min(0, "Please input a valid height"),
    weight: yup.number().min(0, "Please input a valid width"),
});
