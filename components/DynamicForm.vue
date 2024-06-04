<script
    lang="ts"
    setup
    generic="T extends yup.AnyObject, F extends Extract<keyof T, string>"
>
import * as yup from "yup";
//#region Form Copied Properties

type FieldOption = {
    icon?: string;
    type?: "text" | "password" | "textarea";
    label?: string;
};

type FieldData = {
    [Property in keyof T]?: FieldOption;
};

const props = withDefaults(
    defineProps<{
        schema: yup.ObjectSchema<T>;
        disabled?: boolean;
        loading?: boolean;

        // Actions
        submit?: boolean;
        reset?: boolean;
        submitLabel?: string;
        resetLabel?: string;

        // Form
        fieldData?: FieldData;
        labeled?: boolean;
    }>(),
    {
        submit: true,
        submitLabel: "Submit",
        resetLabel: "Reset",
    }
);

// Since state is not necessarily passed as all state is handled in this component
const state = reactive<T>({} as T);

const { disabled } = toRefs(props);

type State = yup.InferType<typeof props.schema>;

const emits = defineEmits<{
    (e: "submit", event: State): void;
}>();

//#endregion

//#region Slots

interface ActionProps {}

interface FieldProps<Type, Property extends keyof Type> {
    field: Property;
    state: Type[Property];
    error?: string;
    set: (v: Type[Property]) => void;
}

type FieldMapped<Type> = {
    [Property in keyof Type as `${string & Property}-field`]: (
        params: FieldProps<Type, Property>
    ) => any;
};

type GeneralFieldProp = {
    field: F;
    state: T[F];
    error?: string;
    set: (v: T[F]) => void;
};

type SlotType = {
    actions(params: ActionProps): any;
    override(): any;
    field(params: GeneralFieldProp): any;
} & FieldMapped<T>;
const slots = defineSlots<SlotType>();

//#endregion

//#region Fields
const fields = computed(() => Object.keys(props.schema.fields) as F[]);

const setField = (field: F, value: any) => {
    state[field as keyof typeof state] = value;
};
</script>

<template>
    <Form
        :schema="schema"
        :state="state"
        :disabled="disabled || loading"
        class="flex flex-col gap-1"
        @submit="(v) => emits('submit', v)"
        v-slot="{ errors }"
    >
        <!-- Auto Generate Forms using the schema -->
        <slot name="override">
            <template
                v-for="field in fields"
                :key="field"
            >
                <slot
                    :name="`${field}-field`"
                    :field="field"
                    :state="state[field]"
                    :set="(v: any) => setField(field, v)"
                    :error="errors[field]"
                >
                    <slot
                        name="field"
                        :field="field"
                        :state="state[field]"
                        :set="
                            (v: (typeof state)[typeof field]) =>
                                setField(field, v)
                        "
                        :error="errors[field]"
                    >
                        <Field
                            :name="field"
                            :label="
                                props.labeled
                                    ? (props.fieldData &&
                                          props.fieldData[field] &&
                                          props.fieldData[field]?.label) ||
                                      capitalize(field)
                                    : undefined
                            "
                        >
                            <PasswordInput
                                v-if="
                                    props.fieldData &&
                                    props.fieldData[field] &&
                                    props.fieldData[field]?.type === 'password'
                                "
                                :label="
                                    props.labeled
                                        ? ''
                                        : (props.fieldData &&
                                              props.fieldData[field] &&
                                              props.fieldData[field]?.label) ||
                                          capitalize(field)
                                "
                                :icon="
                                    (props.fieldData &&
                                        props.fieldData[field] &&
                                        props.fieldData[field]?.icon) ||
                                    ''
                                "
                                v-model="state[field]"
                            />
                            <TextArea
                                v-else-if="
                                    props.fieldData &&
                                    props.fieldData[field] &&
                                    props.fieldData[field]?.type === 'textarea'
                                "
                                :label="
                                    props.labeled
                                        ? ''
                                        : (props.fieldData &&
                                              props.fieldData[field] &&
                                              props.fieldData[field]?.label) ||
                                          capitalize(field)
                                "
                                v-model="state[field]"
                                auto-resize
                                no-float
                            />
                            <Input
                                v-else
                                :label="
                                    props.labeled
                                        ? ''
                                        : (props.fieldData &&
                                              props.fieldData[field] &&
                                              props.fieldData[field]?.label) ||
                                          capitalize(field)
                                "
                                v-model="state[field]"
                                :icon="
                                    (props.fieldData &&
                                        props.fieldData[field] &&
                                        props.fieldData[field]?.icon) ||
                                    ''
                                "
                            />
                        </Field>
                    </slot>
                </slot>
            </template>
        </slot>

        <!-- Slot Actions -->
        <slot name="actions">
            <PrimeButton
                :label="submitLabel"
                color="green"
                severity="success"
                type="submit"
                :loading="loading"
            />
        </slot>
    </Form>
</template>

<style lang="scss" scoped></style>
