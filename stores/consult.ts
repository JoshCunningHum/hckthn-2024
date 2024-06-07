import { promiseTimeout } from "@vueuse/core";
import { defineStore } from "pinia";

type ChatMessage = {
    session: string;
    role: "user" | "system";
    content: string;
    timestamp: string;
};

type ChatSession = {
    user: number;
    session_id: string;
    created_at: string;
};

export const useConsultStore = defineStore("Consult", () => {
    const req = ref("");
    const isrequesting = ref(false);

    type Message = {
        text: string;
        isAI?: boolean;
    };

    const messsages = ref<Message[]>([]);

    const reset = () => {
        req.value = "";
        isrequesting.value = false;
        messsages.value.splice(0);
    };

    const onstartnewconvo = async () => {
        // Code for starting a new conversation
    };

    const ask = async () => {
        const text = req.value;

        if (!text) return;

        req.value = "";
        messsages.value.push({ text });

        const res = await fetch(useBackendUrl() + "/model/augmented_query/", {
            method: "POST",
            headers: {
                "Content-Type": 'application/json; charset=UTF-8"',
            },
            body: JSON.stringify({ prompt: text }),
        });

        const { response } = (await res.json()) as { response: string };
        messsages.value.push({ text: response, isAI: true });
    };

    return {
        req,
        messsages,
        ask,
        reset,
    };
});
