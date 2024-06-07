<script lang="ts" setup>
const active = defineModel<number>({ default: 0 });
const steps = ref([
    {
        label: "Credentials",
    },
    {
        label: "Biodata",
    },
    {
        label: "Health History",
    },
    {
        label: "More",
    },
]);
</script>

<template>
    <PrimeSteps
        v-model:activeStep="active"
        :model="steps"
        :readonly="false"
    />
</template>

<style lang="scss" scoped></style>
