import { auth, LoginCredentials, RegisterData, User } from "@/services/auth";
import { useCallback, useEffect, useState } from "react"

export const useAuth = () => {

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const state = await auth.getAuthState();
            setUser(state.user);
            setIsAuthenticated(state.isAuthenticated);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Auth check failed');
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = useCallback(async (credentials: LoginCredentials) => {
        try {
            setIsLoading(true);
            setError(null);
            const { user, tokens } = await auth.login(credentials);
            await new Promise(resolve => setTimeout(resolve, 50));
            const state = await auth.getAuthState();

            setUser(state.user);
            setIsAuthenticated(state.isAuthenticated);

            return { user, tokens };

        } catch (err) {
            const message = err instanceof Error ? err.message : 'Login failed';
            setError(message);
            setIsAuthenticated(false);
            setUser(null);
            throw err;
        } finally {
            setIsLoading(false);
        }

    }, []);
    const register = useCallback(async (data: RegisterData) => {
        try {
            setIsLoading(true);
            setError(null);
            const { user, tokens } = await auth.register(data);
            // Attendre un peu pour que SecureStore sauvegarde
            await new Promise(resolve => setTimeout(resolve, 50));
            // Vérifier l'état après sauvegarde
            const state = await auth.getAuthState();
            setUser(state.user);
            setIsAuthenticated(state.isAuthenticated);
            console.log('✅ [useAuth] Register completed, auth state:', state.isAuthenticated);
            return { user, tokens };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Registration failed';
            setError(message);
            setIsAuthenticated(false);
            setUser(null);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            await auth.logout();
            setUser(null);
            setIsAuthenticated(false);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Logout failed';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshAuth = useCallback(async () => {
        await checkAuth();
    }, []);

    return {
        user,
        isLoading,
        isAuthenticated,
        error,
        login,
        register,
        logout,
        refreshAuth,
    };

}