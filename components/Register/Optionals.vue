<script lang="ts" setup>
import { type InsertUser } from "../../schemas/user";

const props = defineProps<{
    state: Partial<InsertUser>;
}>();

const { state } = toRefs(props);

// #region Some Data
const nationalities = getNationalities();

// #region Location API Call
const ph = usePsgcStore();

const { state: provinces, isLoading: isProvinceLoading } = useAsyncStateTimeout(
    async () => {
        return ph.getprovinces();
    },
    [],
    {
        timeout: 0,
    }
);

const province = useArrayFind(
    provinces,
    (p) => p.name === state.value.province
);

const {
    state: cities,
    isLoading: isCitiesLoading,
    execute: fetchCities,
    then,
} = useAsyncStateTimeout(
    async () => {
        if (!province.value) return [];

        const cities = await ph.getcities();

        // filter cities according to its province code

        return cities.filter(
            (city) =>
                province.value && city.provinceCode === province.value.code
        );
    },
    [],
    {
        timeout: 0,
        immediate: false,
    }
);

// Watch any changes in the province to filte the cities
watch(province, (p) => {
    if (p) fetchCities();
});

const city = useArrayFind(cities, (c) => c.name === state.value.city);
</script>

<template>
    <div class="p-1 flex flex-col gap-2 w-full">
        <Field
            name="age"
            label="Age "
        >
            <PrimeInputNumber
                v-model="state.age"
                label="Age"
                show-buttons
                :min="0"
            />
        </Field>
        <Field
            name="nationality"
            label="Nationality "
        >
            <PrimeDropdown
                placeholder="Select a nationality"
                :options="nationalities"
                v-model="state.nationality"
                filter
            />
        </Field>

        <div class="flex gap-2 w-full">
            <Field
                name="province"
                label="Province "
                class="flex-grow"
            >
                <PrimeDropdown
                    :loading="isProvinceLoading"
                    :placeholder="
                        isProvinceLoading ? 'Loading...' : 'Select a province'
                    "
                    :options="provinces"
                    optionLabel="name"
                    optionValue="name"
                    v-model="state.province"
                    filter
                />
            </Field>

            <Field
                name="city"
                label="City "
                class="w-56"
            >
                <PrimeDropdown
                    :disabled="!province"
                    :loading="isCitiesLoading"
                    :placeholder="
                        isCitiesLoading ? 'Loading...' : 'Select a city'
                    "
                    :options="cities"
                    optionLabel="name"
                    optionValue="name"
                    v-model="state.city"
                    filter
                />
            </Field>
        </div>

        <Field
            name="zipcode"
            label="Zipcode "
        >
            <Input
                v-model="state.zipcode"
                label="Zipcode"
            />
        </Field>

        <div class="flex gap-2 flex-col lg:flex-row">
            <Field
                name="height"
                label="Height "
            >
                <Input
                    v-model="state.height"
                    label="Height"
                    type="number"
                />
            </Field>

            <Field
                name="weight"
                label="Weight "
            >
                <Input
                    v-model="state.weight"
                    label="Weight"
                    type="number"
                />
            </Field>
        </div>
        <Field
            name="phone"
            label="Phone No. "
        >
            <PrimeInputMask
                v-model="state.phone"
                mask="(999) 999 9999"
                placeholder="(999) 999 9999"
            />
        </Field>
    </div>
</template>

<style lang="scss" scoped></style>
