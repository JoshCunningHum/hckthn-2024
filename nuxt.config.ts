// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: false },
    alias: {
        assets: "/<srcDir>/assets",
    },
    modules: [
        "@pinia/nuxt",
        "@vueuse/nuxt",
        "@nuxt/image",
        "@nuxtjs/tailwindcss",
        "@nuxtjs/device",
        "nuxt-typed-router",
        "@nuxt/fonts",
        "@nuxtjs/color-mode",
        "@morev/vue-transitions",
        "nuxt-primevue",
        "@vee-validate/nuxt",
    ],
    primevue: {
        // cssLayerOrder: "tailwind-base, primevue, tailwind-utilities",
        components: {
            prefix: "Prime",
            include: "*",
            exclude: ["Editor", "Chart"],
        },
        options: {
            ripple: true,
        },
    },
    css: [
        "primeicons/primeicons.css",
        "primevue/resources/themes/aura-light-blue/theme.css",
        "~/assets/css/main.css",
    ],
    tailwindcss: {
        viewer: false,
        cssPath: "~/assets/css/tailwind.css",
        configPath: "~/tailwind.config.ts",
        injectPosition: 0,
    },
    colorMode: {
        preference: "dark",
    },

    app: {
        head: {
            title: "HCKTHN 2024",
        },
    },
    vite: {
        vue: {
            script: {
                propsDestructure: true,
            },
        },
    },
});
