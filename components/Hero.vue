<script lang="ts" setup>
const {
    image = "https://images.unsplash.com/photo-1493612276216-ee3925520721",
    title = "Create the screens",
    subtitle = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
} = defineProps<{
    image?: string;
    title?: string;
    subtitle?: string;
}>();
</script>

<template>
    <Screen class="flex">
        <div class="w-full absolute z-0">
            <img
                :src="image"
                alt="Image"
                class="absolute z-0 brightness-50 h-screen w-auto object-fit right-0"
            />
            <div class="z-10 absolute h-full w-full flex flex-col">
                <slot name="aside"> </slot>
            </div>
        </div>
        <div
            class="w-full md:w-1/2 md:min-w-[700px] z-10 h-screen bg-white flex items-center justify-center"
        >
            <slot name="default">
                <span class="block text-4xl md:text-6xl font-bold mb-1">{{
                    title
                }}</span>
                <p class="mt-0 mb-4 text-700 line-height-3">
                    {{ subtitle }}
                </p>
            </slot>
        </div>
    </Screen>
</template>

<style lang="scss" scoped></style>
