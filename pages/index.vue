<script lang="ts" setup>
import { useRoute } from "../.nuxt/typed-router/__useTypedRoute";
import { definePageMeta } from "../.nuxt/typed-router/__definePageMeta";
import { promiseTimeout } from "@vueuse/core";

definePageMeta({});

const route = useRoute();
const ischilderoute = computed(() => route.fullPath !== "/");

const { state, error, isLoading, isReady } = useAsyncStateTimeout(
    async () => {
        await promiseTimeout(500);
        return true;
    },
    false,
    { timeout: 1000 }
);
</script>

<template>
    <Fill
        class="bg-stone-900 dmsans"
        center
    >
        <Loader
            :finished="!isLoading"
            no-fill
            v-if="!ischilderoute"
        >
            <div
                class="text-green-500"
                v-if="error !== 'Timeout'"
            >
                Ready
            </div>
            <div
                v-else
                class="text-red-500"
            >
                Timeout
            </div>
        </Loader>

        <template v-if="!ischilderoute && false">
            <PrimePanel>
                <div class="flex flex-col gap-2">
                    <Anchor to="/login">Login</Anchor>
                    <Anchor to="/register">Register</Anchor>
                </div>
            </PrimePanel>
        </template>
        <NuxtPage v-else />
    </Fill>
</template>

<style lang="scss" scoped></style>
