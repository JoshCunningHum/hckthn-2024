<script lang="ts" setup generic="T extends RoutesNamesList, P extends string">
import { login_schema as schema, type User } from "@/schemas/user";
import type { NuxtRoute } from "@typed-router/__router";
import type { RoutesNamesList } from "@typed-router/__routes";
import { useToast } from "primevue/usetoast";
import * as yup from "yup";
import { useAsyncStateTimeout } from "../composables/AsyncStateTimeout";
import {
    login,
    type LoginHandler,
    type LoginParams,
} from "../controllers/auth.sqlite";

const { redirect = "/", handler = login } = defineProps<{
    register?: NuxtRoute<T, P>;
    redirect?: NuxtRoute<T, P>;
    handler?: LoginHandler;
    timeout?: number;
}>();

const { login: loginsession } = useUserSession();

// Routes
const router = useRouter();

// Emits
const emits = defineEmits<{
    (event: "success", args: LoginParams): void;
    (event: "failed"): void;
}>();

// Toast
const toast = useToast();
const onError = (error: string) => {
    toast.add({
        severity: "error",
        summary: "Login Error",
        detail: error,
        life: 3000,
    });
    emits("failed");
};
const onSuccess = (u: User) => {
    toast.add({
        severity: "success",
        summary: "Login Success",
        life: 3000,
    });
    emits("success", {
        password: u.password,
        email: u.email,
    });
    loginsession(u);
    router.push(redirect);
};

const {
    isLoading,
    isReady,
    error,
    execute: submit,
    state: response,
    then,
} = useAsyncStateTimeout(
    async (value: yup.InferType<typeof schema>) => {
        try {
            const result = await handler(value);

            if ("error" in result) onError(result.error);
            else onSuccess(result);

            return result;
        } catch (error) {
            onError((error as Error).message);
        }
    },
    null,
    {
        immediate: false,
        timeout: 15000,
    }
);

// Provide Loading States for Inputs
provide("form-loading", isLoading);
</script>

<template>
    <PrimePanel
        header="Login"
        class="dmsans bg-opacity-70 bg-section max-w-fit"
    >
        <template #header>
            <div class="text-3xl font-semibold text-center w-full">Login</div>
        </template>
        <DynamicForm
            :schema="schema"
            :isLoading="isLoading"
            @submit="submit"
            submit-label="Login"
            :field-data="{
                email: {
                    icon: 'pi-envelope',
                },
                password: {
                    type: 'password',
                },
            }"
        >
        </DynamicForm>
        <Anchor
            v-if="!!register"
            :to="register"
            class="ml-auto"
        >
            or register here
        </Anchor>
    </PrimePanel>
</template>

<style lang="scss" scoped></style>
