<script setup lang="ts" generic="T extends RoutesNamesList, P extends string">
import { useAsyncStateTimeout } from "@/composables/AsyncStateTimeout";
import { register, type RegisterHandler } from "@/controllers/auth.sqlite";
import { register_schema as schema, type InsertUser } from "@/schemas/user";
import type { NuxtRoute, RoutesNamesList } from "@typed-router";
import { set } from "@vueuse/core";
import { useToast } from "primevue/usetoast";
import * as yup from "yup";

const { handler = register } = defineProps<{
    login?: NuxtRoute<T, P>;
    handler?: RegisterHandler;
}>();

// State
const state = reactive<Partial<InsertUser>>({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    is_diabetic: "status unknown",
    is_hypertensive: "status unknown",
    is_smoker: "status unknown",
});

// Emits
const emits = defineEmits<{
    (event: "success"): void;
    (event: "failed"): void;
}>();

// #region Toast
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

// #region Handler
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
        } catch (error) {
            onError((error as Error).message);
        }
    },
    null,
    {
        immediate: false,
    }
);

// Stylig Stuff for divider
const breakpoints = useBreakpointTailwind();
const md = breakpoints.greaterOrEqual("md");

const loaded = ref(false);
onMounted(() => set(loaded, true));

// #region Steps
enum RegisterSteps {
    Credientials,
    Optionals,
    History,
    More,
}

const step = ref<RegisterSteps>(RegisterSteps.Credientials);

// Proceeding to next step
const next = async (
    errors: Partial<Record<string, string | undefined>>,
    validate: (field: string, value: any) => void
) => {
    switch (step.value) {
        case RegisterSteps.Credientials:
            validate("first_name", state.first_name);
            validate("last_name", state.last_name);
            validate("email", state.email);
            validate("password", state.password);
            validate("confirmPassword", state.confirmPassword);
            validate("first_name", state.first_name);
            validate("last_name", state.last_name);
            validate("email", state.email);
            validate("password", state.password);
            validate("confirmPassword", state.confirmPassword);

            // Validate first the email, first name, last name, password and confirm password
            if (
                !errors.first_name &&
                !errors.last_name &&
                !errors.email &&
                !errors.password &&
                !errors.confirmPassword &&
                [
                    state.first_name,
                    state.last_name,
                    state.email,
                    state.password,
                    state.confirmPassword,
                ].every((str) => str !== "")
            )
                step.value = RegisterSteps.Optionals;

            break;
        case RegisterSteps.Optionals:
            // Validate age, nationality, province, city, zipcode, height, width, number
            const req_opt = [
                "age",
                "nationality",
                "province",
                "city",
                "zipcode",
                "height",
                "weight",
                "phone",
            ] as (keyof InsertUser)[];

            req_opt.forEach((f: keyof InsertUser) => {
                validate(f, state[f]);
                validate(f, state[f]);
            });

            if (
                req_opt.every(
                    (f) => state[f] !== "" && state[f] !== 0 && !errors[f]
                )
            ) {
                step.value = RegisterSteps.History;
            }
            break;
        case RegisterSteps.History:
            step.value = RegisterSteps.More;
            break;
    }
};
</script>

<template>
    <PrimePanel
        class="dmsans bg-opacity-70 m-2 pb-8 md:pb-0 bg-section w-screen md:max-w-fit md:max-h-max"
    >
        <template #header>
            <div class="text-3xl font-semibold text-center w-full">
                Register
            </div>
        </template>

        <Loader :finished="loaded">
            <Form
                :state="state"
                :schema="schema"
                :loading="isLoading"
                @submit="submit"
                submit-label="Register"
                :field-data="{}"
                v-slot="{ errors, validateField }"
            >
                <RegisterStep
                    v-model="step"
                    class="py-3"
                />
                <div class="flex flex-col max-h-min md:min-w-[502px]">
                    <!-- #region Left Half-->

                    <RegisterCredentials
                        :state="state"
                        v-show="step === RegisterSteps.Credientials"
                    />
                    <RegisterOptionals
                        :state="state"
                        v-show="step === RegisterSteps.Optionals"
                    />
                    <RegisterHistory
                        :state="state"
                        v-show="step === RegisterSteps.History"
                    />
                    <RegisterMore
                        :state="state"
                        v-show="step === RegisterSteps.More"
                    />

                    <!-- #region Right Half-->

                    <div class="w-full">
                        <div class="flex gap-1">
                            <PrimeButton
                                v-if="step > RegisterSteps.Credientials"
                                class="w-full block mt-4"
                                @click="step--"
                                label="Back"
                                severity="secondary"
                            />
                            <PrimeButton
                                v-if="step < RegisterSteps.More"
                                label="Next"
                                class="w-full block mt-4"
                                @click="next(errors, validateField)"
                            />
                            <PrimeButton
                                v-else
                                class="w-full block mt-4"
                                type="submit"
                            >
                                Register
                            </PrimeButton>
                        </div>

                        <div class="w-full flex justify-end">
                            <Anchor
                                v-if="!!login"
                                :to="login"
                                class="ml-auto"
                            >
                                or login here
                            </Anchor>
                        </div>
                    </div>
                </div>
            </Form>
            <template #loader>
                <Fill
                    class="w-full h-full p-4 min-w-[200px] min-h-[200px] md:h-56"
                    center
                >
                    <PrimeProgressSpinner />
                </Fill>
            </template>
        </Loader>
    </PrimePanel>
</template>

<style lang="scss" scoped></style>
