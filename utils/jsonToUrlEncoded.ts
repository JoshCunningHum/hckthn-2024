export default (obj: Record<string, any>) => {
    return Object.entries(obj)
        .map(([key, value]) => {
            if (Array.isArray(value)) {
                return value
                    .map(
                        (item) =>
                            `${encodeURIComponent(key)}[]=${encodeURIComponent(item)}`
                    )
                    .join("&");
            } else {
                return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            }
        })
        .join("&");
};
