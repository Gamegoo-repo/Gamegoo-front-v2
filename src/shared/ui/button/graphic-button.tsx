import clsx from "clsx";

interface GraphicButtonProps {
	title: string;
	subtitle?: string;
	width?: string;
	height: string;
	hoverBackgroundColor?: string;
	hoverText?: {
		title: string;
		subtitle?: string;
	};
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	onClick?: () => void;
}

const GraphicButton = (props: GraphicButtonProps) => {
	const {
		title,
		subtitle,
		width,
		height,
		hoverBackgroundColor,
		hoverText,
		onMouseEnter,
		onMouseLeave,
		onClick,
	} = props;

	const handleClick = () => onClick?.();

	return (
		<button
			type="button"
			onClick={handleClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					handleClick();
				}
			}}
			className={clsx(
				"group relative w-full rounded-[30px] bg-gray-800 cursor-pointer hover:shadow-[0px_0px_38.3px_0px_rgba(90,66,238,0.7)] max-[1300px]:w-full",
				hoverBackgroundColor && `hover:bg-${hoverBackgroundColor}`,
			)}
			style={{
				maxWidth: width,
				height: height,
			}}
		>
			<div className="flex flex-col justify-center items-center text-center w-full h-full relative">
				<div className="text-white group-hover:opacity-0 transition-opacity flex flex-col justify-center items-center text-center">
					<div className="bold-25 text-lg leading-6">{title}</div>
					{subtitle && (
						<div className="regular-16 text-base leading-5">{subtitle}</div>
					)}
				</div>
				<div className="text-white opacity-0 group-hover:opacity-100 transition-opacity absolute flex flex-col justify-center items-center text-center">
					<div className="bold-25 text-lg leading-6">
						{hoverText?.title || title}
					</div>
					<div className="regular-16 text-base leading-5">
						{hoverText?.subtitle || subtitle}
					</div>
				</div>
			</div>
		</button>
	);
};

export default GraphicButton;
