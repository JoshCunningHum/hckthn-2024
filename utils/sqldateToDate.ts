export default (sqlDate: string) => {
    const [year, month, day] = sqlDate.split("-").map(Number);
    return new Date(year, month - 1, day);
};
