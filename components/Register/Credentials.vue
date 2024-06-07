<script lang="ts" setup>
import { type InsertUser } from "../../schemas/user";

const props = defineProps<{
    state: Partial<InsertUser>;
}>();
</script>

<template>
    <div class="p-1 flex flex-col gap-2 w-full">
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
                label="Password"
            />
        </Field>
        <Field name="confirmPassword">
            <PasswordInput
                v-model="state.confirmPassword"
                label="Confirm Password"
            />
        </Field>

        <!-- <div
            class="w-full mt-auto"
            v-if="md"
        >
            <PrimeButton
                label="Register"
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
        </div> -->
    </div>
</template>

<style lang="scss" scoped></style>
