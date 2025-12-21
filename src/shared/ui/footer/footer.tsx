import emailjs from "@emailjs/browser";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import PaperPlaneIcon from "@/shared/assets/icons/ic-paper-plane.svg?react";
import { cn } from "@/shared/lib/utils";
import useResponsive from "@/shared/model/use-responsive";
import { LogoButton } from "../logo";
import { toast } from "@/shared/lib/toast";

const EMAILJS_CONFIG = {
	serviceId: process.env.PUBLIC_EMAILJS_SERVICE_ID ?? "",
	templateId: process.env.PUBLIC_EMAILJS_TEMPLATE_ID ?? "",
	publicKey: process.env.PUBLIC_EMAILJS_PUBLIC_KEY ?? "",
};

export default function Footer() {
	const { isMobile } = useResponsive();

	if (isMobile) {
		return (
			<footer className="flex w-full flex-col gap-8 p-5">
				<section className="flex mobile:w-[417px] w-full flex-col gap-4">
					<LogoButton className="h-fit w-[87px] text-gray-400" />
					<FeedbackForm />
				</section>
				<section className="flex flex-col gap-1.5">
					<TermsLink />
					<FooterInfo />
				</section>
			</footer>
		);
	}
	return (
		<footer className="flex w-full mobile:flex-row flex-col justify-start mobile:px-0 px-5 desktop:pb-[120px] pb-8 tablet:pb-[100px]">
			<section className="flex mobile:w-[417px] w-full flex-col gap-7">
				<LogoButton className="h-fit w-[118px] text-gray-400" />
				<TermsLink />
				<FooterInfo />
			</section>
			<section className="flex flex-col justify-end">
				<FeedbackForm />
			</section>
		</footer>
	);
}

function TermsLink() {
	return (
		<p className="flex gap-2.5 mobile:gap-4">
			<Link
				to="/policy"
				search={{ term: "privacy" }}
				className="bold-14 text-gray-500 underline underline-offset-2"
			>
				개인정보처리방침
			</Link>
			<Link
				to="/policy"
				search={{ term: "service" }}
				className="bold-14 text-gray-500 underline underline-offset-2"
			>
				이용약관
			</Link>
		</p>
	);
}

function FooterInfo() {
	return (
		<p className="regular-13 flex w-full flex-col gap-1.5 mobile:gap-1 text-gray-500">
			<a
				href="mailto:gamegoo0707@gmail.com"
				className="transition-colors hover:text-gray-700"
			>
				email: gamegoo0707@gmail.com
			</a>
			<span>Copyright 2024. GameGoo All Rights Reserved.</span>
		</p>
	);
}

function FeedbackForm() {
	const [enteredFeedback, setEnteredFeedback] = useState("");
	const canSubmit = enteredFeedback.trim() !== "";

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!canSubmit) return;

		const today = new Date();
		const dateKr = today.toLocaleDateString("ko-KR");

		emailjs
			.send(
				EMAILJS_CONFIG.serviceId,
				EMAILJS_CONFIG.templateId,
				{ feedback: enteredFeedback, date: dateKr },
				EMAILJS_CONFIG.publicKey,
			)
			.then(
				(_result) => {
					toast.confirm("소중한 피드백 감사합니다:)");
				},
				(_error) => {
					toast.error("피드백을 제출하지 못했습니다");
				},
			);
		setEnteredFeedback("");
	};

	const handleChangeFeedback = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEnteredFeedback(e.target.value);
	};

	return (
		<div className="flex flex-col gap-1.5">
			<p className="bold-14 text-gray-700">
				Gamegoo 팀에게 소중한 피드백을 전달해주세요!
			</p>
			<form className="flex items-center gap-3" onSubmit={handleSubmit}>
				<input
					name="feedback"
					placeholder="본 피드백은 서비스 개선에 큰 도움이 됩니다 :)"
					className={
						"regular-13 mobile:w-[343px] w-full rounded-lg border border-gray-500 px-3 py-2.5 shadow-none outline-none transition-all duration-100 ease-in-out placeholder:text-gray-500 focus:border-violet-300"
					}
					value={enteredFeedback}
					onChange={handleChangeFeedback}
				/>
				<button
					disabled={!canSubmit}
					type="submit"
					className={cn(
						"cursor-pointer p-1 text-gray-400 disabled:cursor-default disabled:text-gray-300",
						canSubmit && "duration-300 hover:scale-120",
					)}
				>
					<PaperPlaneIcon />
				</button>
			</form>
		</div>
	);
}
