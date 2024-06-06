<script
    lang="ts"
    setup
    generic="T extends yup.AnyObject, F extends Extract<keyof T, string>"
>
import * as yup from "yup";
//#region Form Copied Properties
// MARK: This is imporant!

export type OptionFieldData =
    | string[]
    | {
          label: string;
          value: any;
      }[];

export type FieldOption = {
    icon?: string;
    label?: string;
    class?: string;
} & (
    | {
          type?: "text" | "password" | "textarea" | "number";
      }
    | {
          type: "select";
          options: OptionFieldData; // Make options a reuqired prop when type is select
      }
    | {
          type: "checkbox";
          label: string;
      }
);

export type FieldData<Type> = {
    [Property in keyof Type]?: FieldOption;
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
        fieldData?: FieldData<T>;
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
    validate: () => void;
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
    validate: () => void;
};

type OverrideParams = {
    state: T;
    set: typeof setField;
    errors: Partial<Record<string, string | undefined>>;
    validate: (field: F) => void;
};

type SlotType = {
    actions(params: ActionProps): any;
    override(params: OverrideParams): any;
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
        v-slot="{ errors, validateField }"
    >
        <!-- Auto Generate Forms using the schema -->
        <slot
            name="override"
            :state="state"
            :set="setField"
            :validate="(f: F) => validateField(f, state[f])"
            :errors="errors"
        >
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
                    :validate="() => validateField(field, state[field])"
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
                        :validate="() => validateField(field, state[field])"
                    >
                        <Field
                            :name="field"
                            :label="
                                props.labeled
                                    ? (props.fieldData &&
                                          props.fieldData[field] &&
                                          (
                                              props.fieldData[
                                                  field
                                              ] as FieldOption
                                          ).type !== 'checkbox' &&
                                          (
                                              props.fieldData[
                                                  field
                                              ] as FieldOption
                                          ).label) ||
                                      capitalize(field)
                                    : undefined
                            "
                            :class="
                                (props.fieldData &&
                                    props.fieldData[field] &&
                                    props.fieldData[field]?.label) ||
                                ''
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
                                              (
                                                  props.fieldData[
                                                      field
                                                  ] as FieldOption
                                              ).label) ||
                                          capitalize(field)
                                "
                                :icon="
                                    (props.fieldData &&
                                        props.fieldData[field] &&
                                        (props.fieldData[field] as FieldOption)
                                            .icon) ||
                                    ''
                                "
                                :model-value="state[field]"
                                @update:model-value="(v) => setField(field, v)"
                                no-float
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
                                              (
                                                  props.fieldData[
                                                      field
                                                  ] as FieldOption
                                              ).label) ||
                                          capitalize(field)
                                "
                                :model-value="state[field]"
                                @update:model-value="(v) => setField(field, v)"
                                auto-resize
                                no-float
                            />
                            <DynamicFormSelect
                                v-else-if="
                                    props.fieldData &&
                                    props.fieldData[field] &&
                                    (props.fieldData[field] as FieldOption)
                                        .type === 'select'
                                "
                                :model-value="state[field]"
                                @update:model-value="(v) => setField(field, v)"
                                :data="
                                    props.fieldData[field] as Extract<
                                        FieldOption,
                                        { type: 'select' }
                                    >
                                "
                                :labeled="props.labeled"
                            />
                            <DynamicFormCheckbox
                                v-else-if="
                                    props.fieldData &&
                                    props.fieldData[field] &&
                                    (props.fieldData[field] as FieldOption)
                                        .type === 'checkbox'
                                "
                                :model-value="state[field]"
                                @update:model-value="(v) => setField(field, v)"
                                :data="
                                    props.fieldData[field] as Extract<
                                        FieldOption,
                                        { type: 'checkbox' }
                                    >
                                "
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
                                :model-value="state[field]"
                                @update:model-value="(v) => setField(field, v)"
                                :icon="
                                    (props.fieldData &&
                                        props.fieldData[field] &&
                                        props.fieldData[field]?.icon) ||
                                    ''
                                "
                                float
                                :type="
                                    props.fieldData &&
                                    props.fieldData[field] &&
                                    (props.fieldData[field]?.type as
                                        | 'text'
                                        | 'number')
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
