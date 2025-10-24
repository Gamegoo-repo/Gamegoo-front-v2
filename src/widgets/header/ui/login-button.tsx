import { Link } from "@tanstack/react-router";

export default function LoginButton() {
	return (
		<Link
			to="/riot"
			className="mobile:bg-violet-600 font-bold mobile: mobile:text-white mobile:py-2 mobile:px-6 mobile:rounded-md mobile:font-bold mobile:text-lg bg-transparent text-violet-600 text-sm px-0 cursor-pointer mx-auto my-0"
		>
			로그인
		</Link>
	);
}
