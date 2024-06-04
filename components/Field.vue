<script lang="ts" setup>
const { name } = defineProps<{
    name: string;
    label?: string;
}>();

const errors = inject<Record<string, string>>("form-errors");

// provide the name
provide("form-name", name);
</script>

<template>
    <div class="flex flex-col gap-1">
        <small v-if="!!label">{{ label }}</small>
        <slot></slot>
        <small
            class="text-red-400 text-sm"
            v-if="errors && errors[name]"
            >{{ errors[name] }}</small
        >
    </div>
</template>

<style lang="scss" scoped></style>
