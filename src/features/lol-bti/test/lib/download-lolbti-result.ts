export const downloadLolBtiResult = async (result: string): Promise<void> => {
	const imageUrl = `/assets/images/result-cards/${result}.png`;

	const response = await fetch(imageUrl);
	if (!response.ok) {
		throw new Error(`이미지를 불러오지 못했습니다: ${response.status}`);
	}

	const blob = await response.blob();
	const objectUrl = URL.createObjectURL(blob);

	const link = document.createElement("a");
	link.href = objectUrl;
	link.download = `lolbti-${result}.png`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	URL.revokeObjectURL(objectUrl);
};