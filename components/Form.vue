<script lang="ts" setup generic="T extends yup.Maybe<yup.AnyObject>">
import * as yup from "yup";
import { Form, Field, useForm } from "vee-validate";

const props = defineProps<{
    schema: yup.ObjectSchema<T>;
    state: T;
    disabled?: boolean;
}>();

const { state, schema, disabled } = toRefs(props);

interface ScopeProps {
    reset: () => void;
    errors: Partial<Record<string, string | undefined>>;
}

const slots = defineSlots<{
    default(params: ScopeProps): any;
}>();

type State = yup.InferType<typeof schema.value>;

const emits = defineEmits<{
    (e: "submit", event: State): void;
}>();

const { defineField, handleSubmit, resetForm, errors, setValues } = useForm({
    validationSchema: schema,
    validateOnMount: false,
});

const disabledforms = computed(() => disabled.value);

provide("form-errors", errors);
provide("form-disabled", disabledforms);

const _fields = computed(() => Object.keys(schema.value.fields));
const fields = useArrayMap(_fields, (f) => defineField(f));

const onSubmit = handleSubmit((values) => {
    emits("submit", values as State);
});

const onSubmitNoValidation = (event: Event) => {
    // set first the fields
    setValues(state.value);
    // then submit
    onSubmit(event);
};

onMounted(() => resetForm(undefined, { force: true }));
</script>

<template>
    <form @submit.prevent="onSubmitNoValidation">
        <slot
            :reset="resetForm"
            :errors="errors"
        ></slot>
    </form>
</template>

<style lang="scss" scoped></style>
