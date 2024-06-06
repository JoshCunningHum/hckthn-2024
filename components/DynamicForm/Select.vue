<script lang="ts" setup>
import { type Maybe } from "yup";
import { type FieldOption } from "./index.vue";

const model = defineModel<any>();

const props = defineProps<{
    data?: Extract<FieldOption, { type: "select" }>;
    labeled?: boolean;
}>();

const disabled = inject<Maybe<string>>("form-disabled", undefined);

const { data } = toRefs(props);
</script>

<template>
    <PrimeDropdown
        v-model="model"
        :options="data?.options"
        :option-label="
            typeof data?.options[0] === 'string' ? undefined : 'label'
        "
        :option-value="
            typeof data?.options[0] === 'string' ? undefined : 'value'
        "
        :disabled="!!disabled"
        :placeholder="labeled ? undefined : data?.label"
    />
</template>

<style lang="scss" scoped></style>
