import { Link } from "@tanstack/react-router";
import { useState } from "react";
import SignUpButton from "@/features/auth/ui/sign-up-button";
import { cn } from "@/shared/lib/utils";
import { Checkbox } from "@/shared/ui/checkbox/Checkbox";
import { LogoButton } from "@/shared/ui/logo";

type Term = { key: string; label: string; required: boolean; slug: string };

const TERMS: Term[] = [
	{ key: "service", label: "이용 약관", required: true, slug: "service" },
	{
		key: "privacy",
		label: "개인정보 처리방침",
		required: true,
		slug: "privacy",
	},
	{
		key: "marketing",
		label: "마케팅 목적 개인정보 수집 및 이용",
		required: false,
		slug: "marketing",
	},
] as const;

export default function SignUpSection({ puuid }: { puuid: string }) {
	const [termsState, setTermsState] = useState(
		TERMS.reduce(
			(acc, term) => {
				acc[term.key] = false;
				return acc;
			},
			{} as Record<string, boolean>,
		),
	);

	const isRequiredAllSelected = TERMS.every((term) => {
		if (term.required) {
			return term.required === termsState[term.key];
		}
		return true;
	});

	/**
	 * terms의 상태를 바꾸는 함수
	 * @param key - 어떤 terms를 바꿀 것인지
	 * @param checked - 해당 terms의 변경된 후 상태
	 */
	const handleChangeTermsState = (
		key: keyof typeof termsState,
		checked: boolean,
	) => {
		setTermsState((prevState) => {
			const newState = {
				...prevState,
				[key]: checked,
			};
			return newState;
		});
	};

	return (
		<div className="flex flex-col gap-[188px] w-[468px]">
			<header className="flex flex-col items-start gap-4">
				<LogoButton className="text-violet-600 w-[314px]" />
				<h2 className="regular-32 text-gray-700">이용 약관 동의</h2>
			</header>
			<main className="w-full flex flex-col gap-11">
				<ul className="flex flex-col gap-6">
					{TERMS.map((term) => {
						return (
							<TermItem
								key={term.key}
								name={term.label}
								required={term.required}
								isChecked={termsState[term.key]}
								to={term.slug}
								onChangeCheckbox={(checked) =>
									handleChangeTermsState(term.key, checked)
								}
							/>
						);
					})}
				</ul>
				<SignUpButton
					isDisabled={!isRequiredAllSelected}
					puuid={puuid}
					isAgreed={termsState.marketing}
				/>
			</main>
		</div>
	);
}

function TermItem({
	name,
	isChecked,
	required,
	to,
	onChangeCheckbox,
}: {
	name: string;
	isChecked: boolean;
	required: boolean;
	to: string;
	onChangeCheckbox: (checked: boolean) => void;
}) {
	return (
		<li className="flex flex-row text-gray-700 regular-18 items-center">
			<Checkbox isChecked={isChecked} onCheckedChange={onChangeCheckbox} />
			<Link
				to={to}
				className="ml-2 underline decoration-solid decoration-skip-ink-none decoration-auto underline-offset-auto hover:text-gray-500"
				style={{ textUnderlinePosition: "from-font" }}
			>
				{name}
			</Link>
			<span className="ml-1">동의</span>
			<span
				className={cn("ml-1", required ? "text-violet-800" : "text-gray-500")}
			>
				{required ? "(필수)" : "(선택)"}
			</span>
		</li>
	);
}
