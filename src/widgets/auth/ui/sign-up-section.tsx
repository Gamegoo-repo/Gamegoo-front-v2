import { Checkbox } from "@/shared/ui/checkbox/Checkbox";
import { LogoButton } from "@/shared/ui/logo";

export default function SignUpSection() {
	return (
		<div>
			<header className="flex flex-col items-start">
				<LogoButton />
				<h2>이용 약관 동의</h2>
			</header>
			<main>
				<div>
					<Checkbox />
					<Checkbox />
					<Checkbox />
				</div>
			</main>
		</div>
	);
}
