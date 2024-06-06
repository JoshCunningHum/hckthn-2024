<script lang="ts" setup>
import { definePageMeta } from "../.nuxt/typed-router/__definePageMeta";
import { set, promiseTimeout } from "@vueuse/core";
import * as yup from "yup";
import { useAsyncStateTimeout } from "../composables/AsyncStateTimeout";
import ToggleButton from "primevue/togglebutton";

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
    subscribe: yup.bool().oneOf([true], "Subscription should be true!"),
    age: yup.number().required("Age is required"),
    gender: yup.string().required("Gender is required").default(`Male`),
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
                    email: {
                        icon: 'pi-user',
                    },
                    subscribe: {
                        label: 'Subscribe to email service',
                        type: 'checkbox',
                    },
                    gender: {
                        type: 'select',
                        options: ['Male', 'Female', 'Other'],
                    },
                    age: {
                        type: 'number',
                    },
                }"
                class="gap-2"
            >
                <template #subscribe-field="{ state, set, validate, error }">
                    <div>
                        <ToggleButton
                            :model-value="state"
                            @update:model-value="
                                (v: boolean) => {
                                    set(!!v);
                                    validate();
                                }
                            "
                            onLabel="Subscribed"
                            offLabel="Subscribe"
                        />
                        <div class="text-red-500 text-sm">{{ error }}</div>
                    </div>
                </template>
            </DynamicForm>
        </Fill>
    </Screen>
</template>

<style lang="scss" scoped></style>
