import emailjs from "@emailjs/browser";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import PaperPlaneIcon from "@/shared/assets/icons/ic-paper-plane.svg?react";
import { cn } from "@/shared/lib/utils";
import useResponsive from "@/shared/model/use-responsive";
import { Logo } from "../logo";

export default function Footer() {
	const { isMobile } = useResponsive();

	if (isMobile) {
		return (
			<footer className="w-full flex flex-col gap-8 p-5">
				<section className="w-full mobile:w-[417px] flex flex-col gap-4">
					<Logo className="w-[87px] text-gray-400 h-fit" />
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
		<footer className="w-full flex flex-col mobile:flex-row justify-start pb-8 tablet:pb-[100px] desktop:pb-[120px] px-5 mobile:px-0">
			<section className="w-full mobile:w-[417px] flex flex-col gap-7">
				<Logo className="w-[118px] text-gray-400 h-fit" />
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
				to="/about"
				className="underline-offset-2 underline bold-14 text-gray-500"
			>
				개인정보처리방침
			</Link>
			<Link
				to="/about"
				className="underline-offset-2 underline bold-14 text-gray-500"
			>
				이용약관
			</Link>
		</p>
	);
}

function FooterInfo() {
	return (
		<p className="w-full flex flex-col gap-1.5 mobile:gap-1 regular-13 text-gray-500">
			<a
				href="mailto:gamegoo0707@gmail.com"
				className="hover:text-gray-700 transition-colors"
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
				import.meta.env.PUBLIC_EMAILJS_SERVICE_ID,
				import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID,
				{ feedback: enteredFeedback, date: dateKr },
				import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY,
			)
			.then(
				(result) => {
					console.log(result.text);
				},
				(error) => {
					console.log(error.text);
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
			<form className="flex gap-3 items-center" onSubmit={handleSubmit}>
				<input
					name="feedback"
					placeholder="본 피드백은 서비스 개선에 큰 도움이 됩니다 :)"
					className={
						"outline-none shadow-none focus:border-violet-300 transition-all ease-in-out duration-100 placeholder:text-gray-500 w-full mobile:w-[343px] px-3 py-2.5 border border-gray-500 rounded-lg regular-13"
					}
					value={enteredFeedback}
					onChange={handleChangeFeedback}
				/>
				<button
					disabled={!canSubmit}
					type="submit"
					className={cn(
						"cursor-pointer p-1 text-gray-400 disabled:text-gray-300 disabled:cursor-default",
						canSubmit && "hover:scale-120 duration-300",
					)}
				>
					<PaperPlaneIcon />
				</button>
			</form>
		</div>
	);
}
