"use client";

import { createContext } from "react";

export interface IAccountInfo {
	jwt?: string;
	refreshToken?: string;
}

export interface IAccountState {
	accountInfo?: IAccountInfo;
	setAccountInfo: (value: IAccountInfo) => void;
}

export const AccountContext = createContext<IAccountState>({
	accountInfo: undefined,
	setAccountInfo: () => {
		console.warn('setAccountInfo called before context was initialized');
	}
});
