<script lang="ts" setup>
const router = useRouter();
</script>

<template>
    <Fill class="bg-ground dmsans md:items-center md:justify-center">
        <Register
            @success="router.push('/login')"
            login="/login"
        />
    </Fill>
</template>

<style lang="scss" scoped></style>
