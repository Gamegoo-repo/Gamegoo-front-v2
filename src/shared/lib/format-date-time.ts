export const formatDateTime = (date: string): string => {
	try {
		const d = new Date(date);

		if (Number.isNaN(d.getTime())) {
			throw new Error("Invalid date");
		}

		const year = String(d.getFullYear()).slice(-2);
		const month = String(d.getMonth() + 1).padStart(2, "0");
		const day = String(d.getDate()).padStart(2, "0");
		const hours = String(d.getHours()).padStart(2, "0");
		const minutes = String(d.getMinutes()).padStart(2, "0");

		return `${year}.${month}.${day}. ${hours}:${minutes}`;
	} catch (error) {
		console.error("Failed to format date:", date, error);
		return "-";
	}
};
