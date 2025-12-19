import {
	BanIcon,
	CircleCheckIcon,
	InfoIcon,
	Loader2Icon,
	TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
	return (
		<Sonner
			theme={"light"}
			position="top-center"
			richColors
			className="toaster group z-[9999]"
			icons={{
				success: <CircleCheckIcon className="size-6" />,
				info: <InfoIcon className="size-6" />,
				warning: <TriangleAlertIcon className="size-6" />,
				error: <BanIcon className="size-6" />,
				loading: <Loader2Icon className="size-6 animate-spin" />,
			}}
			toastOptions={{
				className: "rounded-2xl shadow-lg",
				classNames: {
					title: "bold-18",
					description: "regular-14",
				},
				duration: 5000,
			}}
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
					"--border-radius": "8px",
					"--toast-icon-margin-end": "12px",
					"--error-bg": "#f44336",
					"--error-text": "var(--color-white)",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };
