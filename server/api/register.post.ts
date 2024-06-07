export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const link = useBackendUrl() + `/auth/signup/`;
    const res = await fetch(link, {
        method: "POST",
        body,
    });

    console.log(res);
});
