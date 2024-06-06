<script lang="ts" setup>
import { type LoginParams } from "../../controllers/auth.sqlite";

const onlogin = ({ password, email }: LoginParams) => {
    // Refresh the page
    location.reload();
};
</script>

<template>
    <Fill
        class="bg-ground dmsans"
        center
    >
        <Login
            @success="onlogin"
            register="/register"
        />
    </Fill>
</template>

<style lang="scss" scoped></style>
