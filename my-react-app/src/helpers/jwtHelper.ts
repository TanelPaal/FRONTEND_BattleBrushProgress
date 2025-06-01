export function getUserIdFromJwt(jwt: string): string | null {
    if (!jwt) return null;
    try {
        const payload = JSON.parse(atob(jwt.split('.')[1]));
        // This gets the user ID from the JWT claims
        return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || payload.sub || null;
    } catch {
        return null;
    }
}
