export const downloadLolBtiResult = async (result: string): Promise<void> => {
	const imageUrl = `/assets/images/result-cards/${result}.png`;

	const response = await fetch(imageUrl);
	if (!response.ok) {
		throw new Error(`이미지를 불러오지 못했습니다: ${response.status}`);
	}

	const blob = await response.blob();
	const fileName = `lolbti-${result}.png`;
	const file = new File([blob], fileName, { type: blob.type });

	if (navigator.canShare?.({ files: [file] })) {
		await navigator.share({ files: [file], title: fileName });
		return;
	}

	const objectUrl = URL.createObjectURL(blob);

	const link = document.createElement("a");
	link.href = objectUrl;
	link.download = fileName;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	URL.revokeObjectURL(objectUrl);
};
