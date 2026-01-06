import { getAuthValidate } from '@/api';

export async function checkAuth() {
    try {
        const [data, error] = await getAuthValidate();

        if (error || !data) {
            return { isAuthenticated: false, user: null };
        }

        return { isAuthenticated: true, user: data };
    } catch {
        return { isAuthenticated: false, user: null };
    }
}
