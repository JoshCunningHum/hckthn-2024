<script lang="ts" setup>
const over = ref(false);
</script>

<template>
    <div
        @mouseover="over = true"
        @mouseout="over = false"
    >
        <slot :over="over"></slot>
    </div>
</template>

<style lang="scss" scoped></style>
