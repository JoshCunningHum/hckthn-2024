<script setup lang="ts" generic="T extends RoutesNamesList, P extends string">
import { register, type RegisterHandler } from "@/controllers/auth.sqlite";
import { register_schema as schema } from "@/schemas/user";
import type { NuxtRoute, RoutesNamesList } from "@typed-router";
import { useToast } from "primevue/usetoast";
import * as yup from "yup";
import { useAsyncStateTimeout } from "../composables/AsyncStateTimeout";

const { handler = register } = defineProps<{
    login?: NuxtRoute<T, P>;
    handler?: RegisterHandler;
}>();

const state = reactive({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
});

// Emits
const emits = defineEmits<{
    (event: "success"): void;
    (event: "failed"): void;
}>();

const toast = useToast();
const onError = (error: string) => {
    toast.add({
        severity: "error",
        summary: "Register Error",
        detail: error,
        life: 3000,
    });
    emits("failed");
};
const onSuccess = () => {
    toast.add({
        severity: "success",
        summary: "Register Success",
        life: 3000,
    });
    emits("success");
};

const {
    isLoading,
    isReady,
    error,
    execute: submit,
    state: response,
} = useAsyncStateTimeout(
    async (value: yup.InferType<typeof schema>) => {
        try {
            const result = await handler(value);

            if ("error" in result) onError(result.error);
            else onSuccess();

            return result;
        } catch (error: Error) {
            onError(error.message);
        }
    },
    null,
    {
        immediate: false,
    }
);
</script>

<template>
    <PrimePanel
        header="Register"
        class="dmsans bg-opacity-70 bg-stone-900 max-w-fit"
    >
        <DynamicForm
            :schema="schema"
            :loading="isLoading"
            @submit="submit"
            submit-label="Register"
            :field-data="{
                username: {
                    icon: 'pi-user',
                },
                password: {
                    type: 'password',
                },
                confirmpassword: {
                    type: 'password',
                    label: 'Confirm Password',
                },
            }"
        >
        </DynamicForm>
        <Anchor
            v-if="!!login"
            :to="login"
            class="ml-auto"
        >
            or login here
        </Anchor>
    </PrimePanel>
</template>

<style lang="scss" scoped></style>
