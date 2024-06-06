<script setup lang="ts">
import { set } from "@vueuse/core";
import FloatLabel from "primevue/floatlabel";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import type { Maybe } from "yup";

const modelValue = defineModel<string>();

const {
    label,
    hint,
    name: _name,
    disabled: _disabled,
} = defineProps<{
    label?: string;
    hint?: string;
    feedback?: boolean;
    disabled?: boolean;
    name?: string;
    icon?: string;
    size?: "large" | "small";
}>();

const provided_name = inject<Maybe<string>>("form-name", undefined);
const name = computed(() => provided_name || _name);

const provided_loading = inject<Maybe<globalThis.Ref<boolean>>>(
    "form-loading",
    undefined
);
const provided_disabled = inject<Maybe<ComputedRef<boolean>>>(
    "form-disabled",
    undefined
);
const disabled = computed(
    () => provided_disabled?.value || provided_loading?.value || _disabled
);

const componentid = ref("");
onMounted(() => set(componentid, genid()));
</script>

<template>
    <div class="flex flex-col">
        <IconField
            v-if="!!icon"
            icon-position="left"
            class="w-full"
        >
            <InputIcon :class="`pi ${icon}`" />
            <PrimePassword
                v-model="modelValue"
                :name="name"
                :size="size"
                :id="componentid + 'input'"
                :aria-describedby="componentid + 'hint'"
                :disabled="disabled"
                :placeholder="label"
                toggle-mask
                :feedback="feedback"
                class="w-full"
                :pt="{
                    showIcon: () => ({ class: 'cursor-pointer' }),
                    hideIcon: () => ({ class: 'cursor-pointer' }),
                    root(options) {
                        return {
                            class: 'w-full flex-grow',
                        };
                    },
                    input: {
                        root: () => ({ class: 'w-full' }),
                    },
                }"
            />
        </IconField>
        <PrimePassword
            v-else
            v-model="modelValue"
            :name="name"
            :size="size"
            :id="componentid + 'input'"
            :aria-describedby="componentid + 'hint'"
            :disabled="disabled"
            :placeholder="label"
            toggle-mask
            :feedback="feedback"
            class="w-full"
            :pt="{
                showIcon: () => ({ class: 'cursor-pointer' }),
                hideIcon: () => ({ class: 'cursor-pointer' }),
                root(options) {
                    return {
                        class: 'w-full flex-grow',
                    };
                },
                input: {
                    root: () => ({ class: 'w-full' }),
                },
            }"
        />
        <small
            v-if="!!hint"
            :id="componentid + 'hint'"
            >{{ hint }}</small
        >
    </div>
</template>

<style lang="scss" scoped></style>
