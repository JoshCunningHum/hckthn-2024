<script setup lang="ts" generic="T extends RoutesNamesList, P extends string">
import { register, type RegisterHandler } from "@/controllers/auth.sqlite";
import { register_schema as schema } from "@/schemas/user";
import type { NuxtRoute, RoutesNamesList } from "@typed-router";
import { useToast } from "primevue/usetoast";
import * as yup from "yup";
import { useAsyncStateTimeout } from "../composables/AsyncStateTimeout";
import { type InsertUser } from "../schemas/user";
import { set } from "@vueuse/core";
import { usePsgcStore } from "../stores/psgc";

const { handler = register } = defineProps<{
    login?: NuxtRoute<T, P>;
    handler?: RegisterHandler;
}>();

// State
const state = reactive<InsertUser>({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
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

// #region Some Data
const nationalities = getNationalities();

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
        } catch (error: Error) {
            onError(error.message);
        }
    },
    null,
    {
        immediate: false,
    }
);

// #region Location API Call
const ph = usePsgcStore();

const { state: provinces, isLoading: isProvinceLoading } = useAsyncStateTimeout(
    async () => {
        return ph.getprovinces();
    },
    [],
    {
        timeout: 0,
    }
);

const province = useArrayFind(provinces, (p) => p.name === state.province);

const {
    state: cities,
    isLoading: isCitiesLoading,
    execute: fetchCities,
    then,
} = useAsyncStateTimeout(
    async () => {
        if (!province.value) return [];

        const cities = await ph.getcities();

        // filter cities according to its province code

        return cities.filter(
            (city) =>
                province.value && city.provinceCode === province.value.code
        );
    },
    [],
    {
        timeout: 0,
        immediate: false,
    }
);

// Watch any changes in the province to filte the cities
watch(province, (p) => {
    if (p) fetchCities();
});

const city = useArrayFind(cities, (c) => c.name === state.city);

// Stylig Stuff for divider
const breakpoints = useBreakpointTailwind();
const md = breakpoints.greaterOrEqual("md");

const loaded = ref(false);
onMounted(() => set(loaded, true));
</script>

<template>
    <PrimePanel
        header="Register"
        class="dmsans bg-opacity-70 m-1 bg-section w-screen md:max-w-fit md:max-h-min"
    >
        <Loader :finished="loaded">
            <Form
                :state="state"
                :schema="schema"
                :loading="isLoading"
                @submit="submit"
                submit-label="Register"
                :field-data="{}"
            >
                <div class="flex flex-col md:flex-row max-h-min">
                    <!-- #region Left Half-->
                    <div class="p-1 flex flex-col gap-2 md:max-w-lg">
                        <Field name="email">
                            <Input
                                v-model="state.email"
                                icon="pi-envelope"
                                label="Email"
                            />
                        </Field>

                        <div class="flex gap-2 flex-col lg:flex-row">
                            <Field name="first_name">
                                <Input
                                    v-model="state.first_name"
                                    label="First Name"
                                />
                            </Field>

                            <Field name="last_name">
                                <Input
                                    v-model="state.last_name"
                                    label="Last Name"
                                />
                            </Field>
                        </div>
                        <Field name="password">
                            <PasswordInput
                                v-model="state.password"
                                icon="pi-envelope"
                                label="Password"
                            />
                        </Field>
                        <Field name="confirmPassword">
                            <PasswordInput
                                v-model="state.confirmPassword"
                                icon="pi-envelope"
                                label="Confirm Password"
                            />
                        </Field>

                        <div
                            class="w-full mt-auto"
                            v-if="md"
                        >
                            <PrimeButton
                                label="Register"
                                severity="success"
                                class="w-full mt-auto hidden md:block"
                                type="submit"
                            />

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

                    <PrimeDivider
                        :layout="md ? 'vertical' : 'horizontal'"
                        class="md:block"
                    />

                    <!-- #region Right Half-->
                    <div class="p-1 flex flex-col gap-2">
                        <Field
                            name="age"
                            label="Age (Optional)"
                        >
                            <PrimeInputNumber
                                v-model="state.age"
                                label="Age"
                                show-buttons
                                :min="0"
                            />
                        </Field>
                        <Field
                            name="nationality"
                            label="Nationality (Optional)"
                        >
                            <PrimeDropdown
                                placeholder="Select a nationality"
                                :options="nationalities"
                                v-model="state.province"
                                filter
                            />
                        </Field>

                        <Field
                            name="province"
                            label="Province (Optional)"
                        >
                            <PrimeDropdown
                                :loading="isProvinceLoading"
                                :placeholder="
                                    isProvinceLoading
                                        ? 'Loading...'
                                        : 'Select a province'
                                "
                                :options="provinces"
                                optionLabel="name"
                                optionValue="name"
                                v-model="state.province"
                                filter
                            />
                        </Field>

                        <Field
                            name="city"
                            label="City (Optional)"
                        >
                            <PrimeDropdown
                                :disabled="!province"
                                :loading="isCitiesLoading"
                                :placeholder="
                                    isCitiesLoading
                                        ? 'Loading...'
                                        : 'Select a city'
                                "
                                :options="cities"
                                optionLabel="name"
                                optionValue="name"
                                v-model="state.city"
                                filter
                            />
                        </Field>

                        <Field
                            name="zipcode"
                            label="Zipcode (Optional)"
                        >
                            <Input
                                v-model="state.zipcode"
                                label="Zipcode"
                            />
                        </Field>
                    </div>

                    <div
                        class="w-full"
                        v-if="!md"
                    >
                        <PrimeButton
                            label="Register"
                            severity="success"
                            class="w-full block md:hidden mt-4"
                            type="submit"
                        />

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
