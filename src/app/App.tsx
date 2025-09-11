import "./styles/globals.css";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import SocketTest from "../components/SocketTest";
import { Button } from "../shared/ui/button/ui";

const queryClient = new QueryClient();

const fetchCatImage = async () => {
	const response = await fetch("https://api.thecatapi.com/v1/images/search");
	if (!response.ok) {
		throw new Error("고양이 사진을 가져오는데 실패했습니다");
	}
	const data = await response.json();
	return data[0]; // 첫 번째 고양이 사진 반환
};

// 고양이 사진을 보여주는 컴포넌트
const CatImage = () => {
	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["catImage"],
		queryFn: fetchCatImage,
	});

	if (isLoading)
		return <div className="text-center">🐱 고양이 사진 로딩 중...</div>;
	if (error) return <div className="text-red-500">에러: {error.message}</div>;

	return (
		<div className="text-center space-y-4">
			<img
				src={data?.url}
				alt="랜덤 고양이"
				className="mx-auto max-w-md rounded-lg shadow-lg"
			/>
			<div>
				<Button onClick={() => refetch()}>새로운 고양이 보기 🐾</Button>
			</div>
		</div>
	);
};

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<div>
				<Button>겜구 테스트</Button>
				<h1 className="font-pretendard">프리텐다드</h1>
				<p className="text-amber-400">
					Start building amazing things with Rsbuild.
				</p>
			</div>
			<div className="border-t pt-6 space-y-6">
				<div>
					<h2 className="text-2xl font-bold text-center mb-4">
						🐱 TanStack Query 테스트
					</h2>
					<CatImage />
				</div>

				<div className="border-t pt-6">
					<h2 className="text-2xl font-bold text-center mb-4">
						🔌 Socket.IO 테스트
					</h2>
					<SocketTest />
				</div>
			</div>
		</QueryClientProvider>
	);
};

export default App;
