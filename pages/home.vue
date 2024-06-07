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
    <!--
    
    Consult Now
    Doctors Near You
    Dashboard
    

    -->
    <Screen>
        <Fill
            center
            flex-col
        >
            <PrimeButton
                label="Logout"
                severity="secondary"
                @click="logout"
                class="absolute top-5 right-5"
            />
            <Logo class="mix-blend-multiply" />
            <div class="flex gap-2 font-semibold dmsans">
                <PrimeButton
                    class="py-16 font-semibold"
                    severity="danger"
                    @click="router.push('/consult')"
                    >Consult Now</PrimeButton
                >
                <div class="flex flex-col gap-2">
                    <div class="flex gap-2">
                        <PrimeButton
                            class="py-6 font-semibold"
                            severity="help"
                            >Doctors Near You</PrimeButton
                        >
                        <PrimeButton
                            class="py-6 font-semibold"
                            severity="info"
                            >Dashboard</PrimeButton
                        >
                    </div>
                    <div class="flex gap-2">
                        <PrimeButton
                            class="py-6 w-full text-center font-semibold flex justify-center"
                            severity="warning"
                            >Consultation History</PrimeButton
                        >
                    </div>
                </div>
            </div>
        </Fill>
    </Screen>
</template>

<style lang="scss" scoped></style>
