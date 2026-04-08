import { useQuery } from "@tanstack/react-query";
import { lolbtiKeys } from "@/entities/lol-bti/config/query-keys";
import { getParticipants } from "../api";

export default function useFetchParticipants() {
	return useQuery({
		queryFn: getParticipants,
		queryKey: lolbtiKeys.participants(),
	});
}
