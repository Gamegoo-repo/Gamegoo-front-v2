export const share = (dataurl: string, imgName: string) => {
	///url -> file 변경하는 코드
	let arr: string[] = dataurl.split(","),
		//  @ts-expect-error
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = window.atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	const file = new File([u8arr], imgName, { type: mime });

	if (navigator.share) {
		navigator.share({
			title: "제목",
			text: "공유 내용",
			files: [file],
		});
	} else {
		alert("공유하기가 지원되지 않는 환경 입니다.");
	}
};
