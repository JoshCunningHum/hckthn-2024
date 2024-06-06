<script setup lang="ts">
import { set } from "@vueuse/core";
import IconField from "primevue/iconfield";
import FloatLabel from "primevue/floatlabel";
import InputIcon from "primevue/inputicon";
import type { Maybe } from "yup";

const modelValue = defineModel<string | number>({ default: "" });
const modelValueNum = computed({
    get: () => {
        try {
            return parseFloat(`${modelValue.value}` || "0");
        } catch (e) {
            return 0;
        }
    },
    set: (value: number) => {
        modelValue.value = String(value);
    },
});

interface NumberProps {
    type: "number";
    min?: number;
    max?: number;
}

const {
    label,
    hint,
    name: _name,
    disabled: _disabled,
    loading: _loading,
    type = "text",
} = defineProps<
    {
        label?: string;
        hint?: string;
        disabled?: boolean;
        icon?: string;
        name?: string;
        size?: "large" | "small";
        loading?: boolean;
        float?: boolean;
        grouping?: boolean;
    } & (
        | {
              type?: "text";
          }
        | NumberProps
    )
>();

const provided_name = inject<Maybe<string>>("form-name", undefined);
const name = computed(() => provided_name || _name);

const provided_loading = inject<Maybe<globalThis.Ref<boolean>>>(
    "form-loading",
    undefined
);
const provided_disabled = inject<Maybe<ComputedRef<boolean>>>("form-disabled");
const disabled = computed(
    () => provided_disabled?.value || provided_loading?.value || _disabled
);

const componentid = ref(provided_name);
onMounted(() => set(componentid, provided_name));
</script>

<template>
    <div class="flex flex-col">
        <template v-if="!!icon">
            <IconField
                icon-position="left"
                class="w-full"
            >
                <InputIcon :class="`pi ${icon}`" />
                <PrimeInputText
                    v-if="typeof modelValue === 'string' && type !== 'number'"
                    v-model="modelValue"
                    class="w-full"
                    :name="name"
                    :size="size"
                    :id="componentid + 'input'"
                    :aria-describedby="componentid + 'hint'"
                    :disabled="disabled"
                    :placeholder="label"
                />
                <PrimeInputNumber
                    v-else
                    v-model="modelValueNum"
                    class="w-full"
                    :name="name"
                    :size="size"
                    :id="componentid + 'input'"
                    :aria-describedby="componentid + 'hint'"
                    :disabled="disabled"
                    :placeholder="label"
                />
            </IconField>
        </template>
        <template v-else-if="!float">
            <PrimeInputText
                v-if="typeof modelValue === 'string' && type !== 'number'"
                v-model="modelValue"
                :name="name"
                :size="size"
                :id="componentid + 'input'"
                :aria-describedby="componentid + 'hint'"
                :disabled="disabled"
                :placeholder="label"
            />
            <PrimeInputNumber
                v-else
                v-model="modelValueNum"
                class="w-full"
                :name="name"
                :size="size"
                :id="componentid + 'input'"
                :aria-describedby="componentid + 'hint'"
                :disabled="disabled"
                :placeholder="label"
            />
        </template>
        <template v-else>
            <FloatLabel class="w-full">
                <PrimeInputText
                    v-if="typeof modelValue === 'string' && type !== 'number'"
                    class="w-full"
                    :size="size"
                    :name="name"
                    :id="componentid + 'input'"
                    :aria-describedby="componentid + 'hint'"
                    :disabled="disabled"
                    :placeholder="label"
                />
                <PrimeInputNumber
                    v-else
                    v-model="modelValueNum"
                    class="w-full"
                    :name="name"
                    :size="size"
                    :id="componentid + 'input'"
                    :aria-describedby="componentid + 'hint'"
                    :disabled="disabled"
                    :placeholder="label"
                    :use-grouping="grouping"
                />
                <label
                    v-if="label"
                    :for="componentid + 'input'"
                    >{{ label }}</label
                >
            </FloatLabel>
        </template>

        <small
            v-if="!!hint"
            :id="componentid + 'hint'"
            >{{ hint }}</small
        >
    </div>
</template>

<style lang="scss" scoped></style>
