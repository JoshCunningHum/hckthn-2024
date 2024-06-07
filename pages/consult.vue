<script lang="ts" setup>
import { useConsultStore } from "../stores/consult";
import { useAsyncStateTimeout } from "../composables/AsyncStateTimeout";

const conStore = useConsultStore();
const { req, messsages } = storeToRefs(conStore);

const router = useRouter();

const {
    error,
    execute: ask,
    isLoading,
} = useAsyncStateTimeout(conStore.ask, null, {
    timeout: 0,
    immediate: false,
});

onBeforeMount(() => conStore.reset());
</script>

<template>
    <Screen class="mx-auto max-w-3xl flex flex-col p-4 items-center">
        <PrimeButton
            @click="router.push('/home')"
            rounded
            icon="pi pi-times"
            severity="secondary"
            class="absolute top-4 right-4"
        />
        <Fill
            class="flex flex-col gap-2 p-4"
            overflow-scroll-y
        >
            <Loader :finished="messsages.length > 0">
                <ConsultMessage
                    v-for="(msg, i) in messsages"
                    :key="i"
                    :text="msg.text"
                    :isown="!msg.isAI"
                />
                <PrimeSkeleton
                    width="20rem"
                    height="10rem"
                    v-if="isLoading"
                />

                <template #loader>
                    <div
                        class="flex-grow flex flex-col gap-2 justify-center items-center"
                    >
                        <i class="pi pi-plus text-8xl text-neutral-300" />
                        <small class="text-neutral-500"
                            >Start a new conversation</small
                        >
                    </div>
                </template>
            </Loader>
        </Fill>
        <div class="flex gap-1 w-full relative">
            <StateWrapper
                v-slot="{ over }"
                class="flex gap-1 w-full relative"
            >
                <PrimeButton
                    label="Generate Report"
                    severity="success"
                    :class="
                        over && messsages.length > 2
                            ? '-translate-y-7'
                            : 'translate-y-0'
                    "
                    class="text-xs absolute py-2 px-4 transition-all left-[40%]"
                />
                <PrimeInputText
                    v-model="req"
                    :disabled="isLoading"
                    class="rounded-full flex-grow z-10"
                    placeholder="Ask here..."
                    @keydown.enter="ask"
                />
                <PrimeButton
                    icon="pi pi-send"
                    :disabled="!req"
                    rounded
                    @click="ask"
                />
                <PrimeButton
                    rounded
                    icon="pi pi-microphone"
                />
            </StateWrapper>
        </div>
    </Screen>
</template>

<style lang="scss" scoped></style>
