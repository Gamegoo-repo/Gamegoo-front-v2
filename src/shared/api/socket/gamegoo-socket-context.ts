import { createContext, useContext } from "react";

export interface GamegooSocketContextType {
	isAuthenticated: boolean;
	isConnected: boolean;
}

export const GamegooSocketContext =
	createContext<GamegooSocketContextType | null>(null);

export const useGamegooSocket = () => {
	const context = useContext(GamegooSocketContext);
	if (!context) {
		throw new Error(
			"useGamegooSocket must be used within GamegooSocketProvider",
		);
	}
	return context;
};
