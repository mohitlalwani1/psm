import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { auth, signInWithGoogle, signOutUser, onAuthStateChange } from "@/lib/firebase";
import { AuthContextType, User } from "@/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in with Firebase
        try {
          // Get the ID token for backend authentication
          const idToken = await firebaseUser.getIdToken();
          
          // Send token to backend for verification/creation
          const response = await api.auth.googleLogin(idToken);
          const jwt = response.token;
          
          setToken(jwt);
          localStorage.setItem("token", jwt);
          
          setUser({
            _id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            role: response.user.role,
            avatarUrl: response.user.avatar,
          });
        } catch (error) {
          console.error("Backend authentication failed:", error);
          // If backend auth fails, still set Firebase user
          setUser({
            _id: firebaseUser.uid,
            name: firebaseUser.displayName || "User",
            email: firebaseUser.email || "",
            role: "member",
            avatarUrl: firebaseUser.photoURL || undefined,
          });
        }
      } else {
        // User is signed out
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (token && !user) {
      // Get user profile from backend
      api.users
        .getProfile()
        .then((userData: any) => {
          setUser({
            _id: userData._id || userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            avatarUrl: userData.avatar,
          });
        })
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
        });
    }
  }, [token, user]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.auth.login(email, password);
      const jwt = response.token;
      setToken(jwt);
      localStorage.setItem("token", jwt);

      setUser({
        _id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        avatarUrl: response.user.avatar,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.auth.register(name, email, password);
      const jwt = response.token;
      setToken(jwt);
      localStorage.setItem("token", jwt);

      setUser({
        _id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        avatarUrl: response.user.avatar,
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(
        error.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (googleToken: string) => {
    setLoading(true);
    try {
      const response = await api.auth.googleLogin(googleToken);
      const jwt = response.token;
      setToken(jwt);
      localStorage.setItem("token", jwt);

      setUser({
        _id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        avatarUrl: response.user.avatar,
      });
    } catch (error: any) {
      console.error("Google login error:", error);
      throw new Error(error.message || "Google authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const firebaseGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      // The useEffect will handle the rest of the authentication flow
    } catch (error: any) {
      console.error("Firebase Google login error:", error);
      throw new Error(error.message || "Google authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Sign out from Firebase
      await signOutUser();
    } catch (error) {
      console.error("Firebase sign out error:", error);
    }
    
    // Clear local state
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        token, 
        login, 
        register, 
        googleLogin, 
        firebaseGoogleLogin,
        logout, 
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
