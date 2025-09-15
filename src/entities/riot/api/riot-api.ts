import { RiotApi } from "@/shared/api/@generated";
import { apiClient, apiConfiguration } from "@/shared/api/config";

export const riotApi = new RiotApi(
	apiConfiguration,
	process.env.PUBLIC_API_BASE_URL,
	apiClient,
);
