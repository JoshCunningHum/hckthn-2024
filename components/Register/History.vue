<script lang="ts" setup>
import { type InsertUser } from "../../schemas/user";

const props = defineProps<{
    state: Partial<InsertUser>;
}>();

const ailment_choices = [`status unknown`, `Yes`, `No`];
</script>

<template>
    <div class="w-full flex flex-col gap-2 px-4">
        <Field name="is_diabetic">
            <div class="flex items-center justify-between w-full'">
                <div>Is Diabetic</div>
                <PrimeSelectButton
                    :options="ailment_choices"
                    v-model="state.is_diabetic"
                    class="capitalize text-xs"
                />
            </div>
        </Field>
        <Field name="is_hypertensive">
            <div class="flex items-center justify-between w-full'">
                <div>Is Hypertensive</div>
                <PrimeSelectButton
                    :options="ailment_choices"
                    v-model="state.is_hypertensive"
                    class="capitalize text-xs"
                />
            </div>
        </Field>
        <Field name="is_smoker">
            <div class="flex items-center justify-between w-full'">
                <div>Is Smoker</div>
                <PrimeSelectButton
                    :options="ailment_choices"
                    v-model="state.is_smoker"
                    class="capitalize text-xs"
                />
            </div>
        </Field>

        <Field
            name="last_checkup"
            label="Last Checkup"
        >
            <PrimeCalendar
                :model-value="
                    state.last_checkup
                        ? sqldateToDate(state.last_checkup)
                        : new Date()
                "
                @update:model-value="
                    (v: Date) => {
                        state.last_checkup = dateToSQLDate(v);
                    }
                "
            />
        </Field>

        <Field name="medications">
            <div class="w-full">
                <small
                    >Please input the medications you've taken. Put N/A if
                    none.</small
                >
                <PrimeTextarea
                    class="w-full"
                    :rows="5"
                    v-model="state.medications"
                    auto-resize
                    placeholder="Entery any previous medications..."
                />
            </div>
        </Field>
    </div>
</template>

<style lang="scss" scoped></style>
