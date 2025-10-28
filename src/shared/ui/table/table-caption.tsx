import React from "react";
import { cn } from "@/shared/lib/utils";

export const TableCaption = React.forwardRef<
	HTMLTableCaptionElement,
	React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
	<caption ref={ref} className={className} {...props} />
));
