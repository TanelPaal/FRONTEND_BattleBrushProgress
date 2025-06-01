export class TokenService {
	private static readonly JWT_KEY = '_jwt';
	private static readonly REFRESH_TOKEN_KEY = '_refreshToken';

	static getJwt(): string | null {
		return localStorage.getItem(this.JWT_KEY);
	}

	static getRefreshToken(): string | null {
		return localStorage.getItem(this.REFRESH_TOKEN_KEY);
	}

	static setTokens(jwt: string, refreshToken: string): void {
		localStorage.setItem(this.JWT_KEY, jwt);
		localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
	}

	static clearTokens(): void {
		localStorage.removeItem(this.JWT_KEY);
		localStorage.removeItem(this.REFRESH_TOKEN_KEY);
	}

	static hasValidTokens(): boolean {
		return !!(this.getJwt() && this.getRefreshToken());
	}
}
