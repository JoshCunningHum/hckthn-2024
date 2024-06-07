<script lang="ts" setup>
import { type LoginParams } from "../../controllers/auth.sqlite";

const onlogin = ({ password, email }: LoginParams) => {
    // Refresh the page
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
            redirect="/home"
        />
    </Fill>
</template>

<style lang="scss" scoped></style>
