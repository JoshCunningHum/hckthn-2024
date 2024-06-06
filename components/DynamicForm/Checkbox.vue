<script lang="ts" setup>
import type { FieldOption } from "./index.vue";
import { type Maybe } from "yup";

const model = defineModel<any>();

const props = defineProps<{
    data?: Extract<FieldOption, { type: "checkbox" }>;
}>();

const disabled = inject<Maybe<string>>("form-disabled", undefined);
const { data } = toRefs(props);

const value = computed({
    get: () => !!model.value,
    set: (value: boolean) => (model.value = value),
});
</script>

<template>
    <div
        class="flex items-center"
        v-if="!!data"
    >
        <PrimeCheckbox
            v-model="value"
            :input-id="data.label + 'chckbx'"
            :name="data.label"
            :disabled="!!disabled"
            binary
        />
        <label
            :for="data.label + 'chckbx'"
            class="ml-2 cursor-pointer"
            >{{ data.label }}</label
        >
    </div>
</template>

<style lang="scss" scoped></style>
