import { defineStore } from "pinia";

export type ChatSession = {
    user: number;
    session_id: string;
    created_at: string;
};

export const useHistoryStore = defineStore("History", () => {
    const history = ref < {};

    return {};
});
