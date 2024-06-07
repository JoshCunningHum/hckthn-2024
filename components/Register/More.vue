<script lang="ts" setup>
import type { InsertUser } from "~/schemas/user";

const props = defineProps<{
    state: Partial<InsertUser>;
}>();
</script>

<template>
    <Field name="history">
        <div class="w-full">
            <small>Additional Details</small>
            <PrimeTextarea
                class="w-full"
                :rows="5"
                name="history"
                v-model="state.history"
                auto-resize
                placeholder="Enter more additional details"
            />
        </div>
    </Field>
</template>

<style lang="scss" scoped></style>
