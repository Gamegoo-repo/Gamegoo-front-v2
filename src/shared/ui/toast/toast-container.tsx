import { Toast } from "./toast";
import { useToast } from "../../lib/toast/use-toast";

const ToastContainer = () => {
	const { currentToast, closeToast } = useToast();

	return (
		<>
			{currentToast && (
				<Toast
					onClose={closeToast}
					{...currentToast.options}
					message={currentToast.message}
				/>
			)}
		</>
	);
};

export default ToastContainer;
