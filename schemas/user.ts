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
type AilmentHistory = "status unknown" | "yes" | "no";

export type InsertUser = {
    email: string;
    password: string;
    confirmPassword: string;
    first_name: string;
    last_name: string;

    age: number;
    nationality: string;
    province: string;
    city: string;
    zipcode: string;
    phone: string;
    height: number;
    weight: number;

    // History
    is_diabetic: AilmentHistory;
    is_hypertensive: AilmentHistory;
    is_smoker: AilmentHistory;
    last_checkup: string;
    medications: string;
    history: string;
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

    age: yup
        .number()
        .min(0, "Please input a valid age")
        .required("Age is required"),
    nationality: yup.string().required("Nationality is required"),
    province: yup.string().required("Province is required"),
    city: yup.string().required("City is required"),
    zipcode: yup.string().required("Zipcode is required"),

    phone: yup.string().required("Phone No. is required"),
    height: yup
        .number()
        .min(1, "Please input a valid height")
        .required("Height is required"),
    weight: yup
        .number()
        .min(1, "Please input a valid width")
        .required("Weight is required"),

    is_diabetic: yup
        .string()
        .required()
        .oneOf(["status unknown", "yes", "no"])
        .default("status unknown"),
    is_hypertensive: yup
        .string()
        .required()
        .oneOf(["status unknown", "yes", "no"])
        .default("status unknown"),
    is_smoker: yup
        .string()
        .required()
        .oneOf(["status unknown", "yes", "no"])
        .default("status unknown"),
    last_checkup: yup.string().required("Last checkup is required"),
    medications: yup
        .string()
        .required("Medications are required")
        .default(`None`),
    history: yup.string().required(`Additional details are required`),
});
