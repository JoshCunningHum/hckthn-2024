import { promiseTimeout } from "@vueuse/core";
import { defineStore } from "pinia";
import type { ChatSession } from "./history";

type ChatMessage = {
    session?: string;
    role: "user" | "system";
    content: string;
    timestamp?: string;
};

export const useConsultStore = defineStore("Consult", () => {
    const req = ref("");
    const isrequesting = ref(false);
    const current_session = ref<string>();

    type Message = {
        text: string;
        isAI?: boolean;
    };

    const messsages = ref<Message[]>([]);

    const reset = () => {
        req.value = "";
        isrequesting.value = false;
        current_session.value = "";
        messsages.value.splice(0);
    };

    const loadSession = async (sessionId: string) => {
        reset();

        const res = await fetch(useBackendUrl() + "/", {
            method: "POST",
            headers: {
                "Content-Type": 'application/json; charset=UTF-8"',
            },
            body: JSON.stringify({ sessionId }),
        });

        const { messages, session } = (await res.json()) as {
            messages: ChatMessage[];
            session: ChatSession;
        };

        current_session.value = session.session_id;
        messsages.value.push(
            ...messages.map((m) => ({
                text: m.content,
                isAI: m.role === "system",
            }))
        );
    };

    const ask = async () => {
        const { state } = useUserSession();

        if (!state.value) return;

        const text = req.value;

        if (!text) return;

        req.value = "";
        messsages.value.push({ text });

        const res = await fetch(useBackendUrl() + "/model/augmented_query/", {
            method: "POST",
            headers: {
                "Content-Type": 'application/json; charset=UTF-8"',
            },
            body: JSON.stringify({
                prompt: text,
            }),
        });

        const ai_response = (await res.json()) as { response: string };

        // Save result of AI and User
        const save_ai = await fetch(
            useBackendUrl() + "/session_context/save_chat_message/",
            {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json; charset=UTF-8"',
                },
                body: JSON.stringify({
                    user_id: state.value.id,
                    role: "system",
                    content: ai_response.response,
                }),
            }
        );

        const save_user = await fetch(
            useBackendUrl() + "/session_context/save_chat_message/",
            {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json; charset=UTF-8"',
                },
                body: JSON.stringify({
                    user_id: state.value.id,
                    role: "user",
                    content: text,
                }),
            }
        );

        messsages.value.push({ text: ai_response.response, isAI: true });
    };

    return {
        req,
        messsages,
        ask,
        reset,
        current_session,
        loadSession,
    };
});
