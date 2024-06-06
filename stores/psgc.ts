import { defineStore } from "pinia";

export const usePsgcStore = defineStore("Psgc", () => {
    type Province = {
        code: string;
        name: string;
        regionCode: string;
        islandGroupCode: string;
        psgc10DigitCode: string;
    };

    const getprovinces = useMemoize(async (): Promise<Province[]> => {
        return JSON.parse(
            await $fetch(`https://psgc.gitlab.io/api/provinces/`, {
                method: "GET",
            })
        ) as Province[];
    });

    type City = {
        code: string;
        name: string;
        oldName: string;
        isCapital: boolean;
        districtCode: string;
        provinceCode: string;
        regionCode: string;
        islandGroupCode: string;
    };

    const getcities = useMemoize(async (): Promise<City[]> => {
        return JSON.parse(
            await $fetch(`https://psgc.gitlab.io/api/cities/`, {
                method: "GET",
            })
        ) as City[];
    });

    return {
        getprovinces,
        getcities,
    };
});
