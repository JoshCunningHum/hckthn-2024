<script setup lang="ts">
import VueMarkdown from "vue-markdown-render";

const session = useUserSession();

const { state } = session;

const { isown = true } = defineProps<{
    text: string;
    isown: boolean;
}>();
</script>

<template>
    <PrimePanel
        :class="isown ? 'ml-auto' : 'mr-auto'"
        class="rounded"
    >
        <template #header>
            <div
                v-if="isown"
                class="text-blue-500"
            >
                You
            </div>
            <div
                v-else
                class="text-blue-500"
            >
                FlowerAI
            </div>
        </template>
        <vue-markdown :source="text" />
    </PrimePanel>
</template>

<style lang="scss" scoped></style>
