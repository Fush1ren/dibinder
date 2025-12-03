export const formatDate = (date: Date): string => {
    const formatted = date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
    return formatted;
}