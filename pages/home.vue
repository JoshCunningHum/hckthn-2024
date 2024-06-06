<script lang="ts" setup>
import { definePageMeta } from "../.nuxt/typed-router/__definePageMeta";
import { set, promiseTimeout } from "@vueuse/core";
import * as yup from "yup";
import { useAsyncStateTimeout } from "../composables/AsyncStateTimeout";

definePageMeta({
    // middleware: ["auth"],
});

const router = useRouter();

const { logout: _logout } = useUserSession();

const isloggingout = ref(false);
const logout = () => {
    _logout();
    set(isloggingout, true);
    router.push("/");
};

const schema = yup.object({
    email: yup.string().required(`Email is required`).email(`Invalid email`),
    password: yup
        .string()
        .required(`Password is required`)
        .min(8, `Minimum length of 8`),
    confirmPassword: yup
        .string()
        .required(`Confirm pass is empty!!!!!`)
        .oneOf([yup.ref("password")], "Password does not match"),
    subscribe: yup.bool(),
});

const {
    state,
    error,
    isLoading,
    execute: onsubmit,
} = useAsyncStateTimeout(
    async (value: yup.InferType<typeof schema>) => {
        await promiseTimeout(2000);
    },
    undefined,
    {
        timeout: 0,
        immediate: false,
    }
);
</script>

<template>
    <Screen>
        <Fill center>
            <DynamicForm
                @submit="onsubmit"
                :loading="isLoading"
                :schema="schema"
                labeled
                submit-label="Login"
                :field-data="{
                    password: {
                        icon: 'pi-key',
                        type: 'password',
                    },
                    confirmPassword: {
                        type: 'select',
                        options: [
                            {
                                label: 'This password is correct',
                                value: 'This is not a password check',
                            },
                        ],
                        label: 'Confirm Password',
                    },
                    email: {
                        icon: 'pi-user',
                    },
                    subscribe: {
                        label: 'Subscribe to email service',
                        type: 'checkbox',
                    },
                }"
                class="gap-2"
            >
            </DynamicForm>
        </Fill>
    </Screen>
</template>

<style lang="scss" scoped></style>
