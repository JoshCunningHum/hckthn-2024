<script lang="ts" setup>
const router = useRouter();

const register = () => {
    router.push(`/register`);
};

const login = () => {
    router.push(`/login`);
};

const route = useRoute();
const ischildroute = computed(() => route.fullPath === "/");
</script>

<template>
    <Screen>
        <Fill
            center
            v-if="ischildroute"
        >
            <Hero
                image="/hero2.jpg"
                class="w-full"
            >
                <template #default>
                    <div
                        class="flex flex-col gap-2 justify-center text-center md:text-left overflow-hidden"
                    >
                        <div
                            class="text-3xl md:text-5xl font-bold dmsans w-full md:w-fit"
                        >
                            Unlock
                            <span class="text-[#b92f2f]">Expert Guidance</span>
                            at
                            <br />
                            Your Fingertips
                        </div>
                        <div class="text-sm md:text-base">
                            Experience personalized, AI-powered consultations
                            tailored to your unique needs
                        </div>
                        <div
                            class="flex gap-2 items-center justify-center md:justify-start"
                        >
                            <PrimeButton
                                severity="success"
                                @click="register"
                                >Register Now</PrimeButton
                            >
                            <PrimeDivider layout="vertical" />
                            <PrimeButton
                                severity="primary"
                                @click="login"
                                >Login</PrimeButton
                            >
                        </div>
                    </div>
                </template>
            </Hero>
        </Fill>
        <NuxtPage v-else />
    </Screen>
</template>

<style lang="scss" scoped></style>
