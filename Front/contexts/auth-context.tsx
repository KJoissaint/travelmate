import { auth, LoginCredentials, RegisterData, User } from "@/services/auth";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<{ user: User, tokens: any }>;
    register: (data: RegisterData) => Promise<{ user: User, tokens: any }>;
    logout: () => Promise<void>;
    refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Mock user data
    const [user, setUser] = useState<User | null>({
        id: 'mock-user-123',
        email: 'test@example.com',
        name: 'Test User',
        roles: ['user']
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(true); // Always authenticated
    const [error, setError] = useState<string | null>(null);

    // Mock functions so i can test without logging in (i was having trouble fixing itw)
    const login = useCallback(async (credentials: LoginCredentials) => {
        console.log('🔧 Mock login called');
        return { 
            user: user!, 
            tokens: { accessToken: 'mock-token', refreshToken: 'mock-token', expiresAt: Date.now() + 3600000 } 
        };
    }, [user]);

    const register = useCallback(async (data: RegisterData) => {
        console.log('🔧 Mock register called');
        return { 
            user: user!, 
            tokens: { accessToken: 'mock-token', refreshToken: 'mock-token', expiresAt: Date.now() + 3600000 } 
        };
    }, [user]);

    const logout = useCallback(async () => {
        console.log('🔧 Mock logout called');
    }, []);

    const refreshAuth = useCallback(async () => {
        console.log('🔧 Mock refreshAuth called');
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated,
                error,
                login,
                register,
                logout,
                refreshAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}