import { useQuery } from "@tanstack/react-query"
import { getParticipants } from "../api"

export default function useFetchParticipants() {
    return useQuery({queryFn: getParticipants, queryKey: ['lolbti', 'participants']})
}