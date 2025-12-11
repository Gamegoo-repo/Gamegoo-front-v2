import { useState } from "react";
import SignUpButton from "@/features/auth/ui/sign-up-button";
import { cn } from "@/shared/lib/utils";
import { Checkbox } from "@/shared/ui/checkbox/Checkbox";
import { LogoButton } from "@/shared/ui/logo";
import { useTermsDetailModalStore } from "@/features/auth/ui/use-terms-detail-modal-store";
import { TERMS, type TermKey } from "@/entities/term/model";

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
		<div className="flex h-full mobile:h-fit mobile:w-[468px] w-full flex-col mobile:justify-start gap-25 mobile:gap-[188px] px-5 py-8">
			<header className="mobile:mt-0 mt-[72px] flex flex-col items-start gap-2 mobile:gap-4">
				<LogoButton className="mobile:w-[314px] w-[200px] text-violet-600" />
				<h2 className="mobile:text-3xl text-gray-700 text-xl">
					이용 약관 동의
				</h2>
			</header>
			<main className="flex w-full flex-col gap-25 mobile:gap-11">
				<ul className="flex flex-col gap-6">
					{TERMS.map((term) => {
						return (
							<TermItem
								key={term.key}
								type={term.key}
								name={term.label}
								required={term.required}
								isChecked={termsState[term.key]}
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
	type,
	required,
	onChangeCheckbox,
}: {
	name: string;
	type: TermKey;
	isChecked: boolean;
	required: boolean;
	onChangeCheckbox: (checked: boolean) => void;
}) {
	const { openModal } = useTermsDetailModalStore();

	return (
		<li className="flex flex-row items-center mobile:text-lg text-base text-gray-700">
			<Checkbox isChecked={isChecked} onCheckedChange={onChangeCheckbox} />
			<div className="flex flex-wrap items-center">
				<button
					type="button"
					onClick={() => openModal(type)}
					className="ml-2 underline decoration-auto decoration-skip-ink-none decoration-solid underline-offset-auto hover:text-gray-500"
					style={{ textUnderlinePosition: "from-font" }}
				>
					{name}
				</button>
				<span className="ml-1">동의</span>
				<span
					className={cn("ml-1", required ? "text-violet-600" : "text-gray-500")}
				>
					{required ? "(필수)" : "(선택)"}
				</span>
			</div>
		</li>
	);
}
