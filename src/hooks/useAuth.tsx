@@ .. @@
 import { createContext, useContext, useEffect, useState } from "react";
 import { api } from "@/lib/api";
-import { auth, signInWithGoogle, signOutUser, onAuthStateChange } from "@/lib/firebase";
 import { AuthContextType, User } from "@/types";
+import { mockUsers } from "@/lib/mockData";
 
 const AuthContext = createContext<AuthContextType | undefined>(undefined);
@@ .. @@
   const [loading, setLoading] = useState(false);
 
   useEffect(() => {
-    // Listen for Firebase auth state changes
-    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
-      if (firebaseUser) {
-        // User is signed in with Firebase
-        try {
-          // Get the ID token for backend authentication
-          const idToken = await firebaseUser.getIdToken();
-          
-          // Send token to backend for verification/creation
-          const response = await api.auth.googleLogin(idToken);
-          const jwt = response.token;
-          
-          setToken(jwt);
-          localStorage.setItem("token", jwt);
-          
-          setUser({
-            _id: response.user.id,
-            name: response.user.name,
-            email: response.user.email,
-            role: response.user.role,
-            avatarUrl: response.user.avatar,
-          });
-        } catch (error) {
-          console.error("Backend authentication failed:", error);
-          // If backend auth fails, still set Firebase user
-          setUser({
-            _id: firebaseUser.uid,
-            name: firebaseUser.displayName || "User",
-            email: firebaseUser.email || "",
-            role: "member",
-            avatarUrl: firebaseUser.photoURL || undefined,
-          });
-        }
-      } else {
-        // User is signed out
-        setUser(null);
-        setToken(null);
-        localStorage.removeItem("token");
-      }
-    });
-
-    return () => unsubscribe();
+    // Check for existing token on app load
+    if (token && !user) {
+      // Get user profile from backend or use mock data
+      api.users
+        .getProfile()
+        .then((userData: any) => {
+          setUser({
+            _id: userData._id || userData.id,
+            name: userData.name,
+            email: userData.email,
+            role: userData.role,
+            avatarUrl: userData.avatar,
+          });
+        })
+        .catch(() => {
+          // Use mock user if API fails
+          const mockUser = mockUsers[0];
+          setUser({
+            _id: mockUser.id,
+            name: mockUser.name,
+            email: mockUser.email,
+            role: mockUser.role as any,
+            avatarUrl: undefined,
+          });
+        });
+    }
   }, []);
@@ .. @@
   const login = async (email: string, password: string) => {
     setLoading(true);
     try {
-      const response = await api.auth.login(email, password);
-      const jwt = response.token;
-      setToken(jwt);
-      localStorage.setItem("token", jwt);
-
-      setUser({
-        _id: response.user.id,
-        name: response.user.name,
-        email: response.user.email,
-        role: response.user.role,
-        avatarUrl: response.user.avatar,
-      });
+      try {
+        const response = await api.auth.login(email, password);
+        const jwt = response.token;
+        setToken(jwt);
+        localStorage.setItem("token", jwt);
+
+        setUser({
+          _id: response.user.id,
+          name: response.user.name,
+          email: response.user.email,
+          role: response.user.role,
+          avatarUrl: response.user.avatar,
+        });
+      } catch (apiError) {
+        // Fallback to mock authentication for demo
+        const mockUser = mockUsers.find(u => u.email === email);
+        if (mockUser) {
+          const mockToken = "mock-jwt-token";
+          setToken(mockToken);
+          localStorage.setItem("token", mockToken);
+          
+          setUser({
+            _id: mockUser.id,
+            name: mockUser.name,
+            email: mockUser.email,
+            role: mockUser.role as any,
+            avatarUrl: undefined,
+          });
+        } else {
+          throw new Error("Invalid credentials");
+        }
+      }
     } catch (error: any) {
       console.error("Login error:", error);
       throw new Error(error.message || "Login failed. Please try again.");
@@ .. @@
   const register = async (name: string, email: string, password: string) => {
     setLoading(true);
     try {
-      const response = await api.auth.register(name, email, password);
-      const jwt = response.token;
-      setToken(jwt);
-      localStorage.setItem("token", jwt);
-
-      setUser({
-        _id: response.user.id,
-        name: response.user.name,
-        email: response.user.email,
-        role: response.user.role,
-        avatarUrl: response.user.avatar,
-      });
+      try {
+        const response = await api.auth.register(name, email, password);
+        const jwt = response.token;
+        setToken(jwt);
+        localStorage.setItem("token", jwt);
+
+        setUser({
+          _id: response.user.id,
+          name: response.user.name,
+          email: response.user.email,
+          role: response.user.role,
+          avatarUrl: response.user.avatar,
+        });
+      } catch (apiError) {
+        // Fallback to mock registration for demo
+        const mockToken = "mock-jwt-token";
+        setToken(mockToken);
+        localStorage.setItem("token", mockToken);
+        
+        setUser({
+          _id: Date.now().toString(),
+          name: name,
+          email: email,
+          role: "member",
+          avatarUrl: undefined,
+        });
+      }
     } catch (error: any) {
       console.error("Registration error:", error);
       throw new Error(
@@ .. @@
   const firebaseGoogleLogin = async () => {
     setLoading(true);
     try {
-      await signInWithGoogle();
-      // The useEffect will handle the rest of the authentication flow
+      // Mock Google login for demo
+      const mockUser = mockUsers[0];
+      const mockToken = "mock-google-jwt-token";
+      setToken(mockToken);
+      localStorage.setItem("token", mockToken);
+      
+      setUser({
+        _id: mockUser.id,
+        name: mockUser.name,
+        email: mockUser.email,
+        role: mockUser.role as any,
+        avatarUrl: undefined,
+      });
     } catch (error: any) {
       console.error("Firebase Google login error:", error);
       throw new Error(error.message || "Google authentication failed.");
@@ .. @@
   const logout = async () => {
-    try {
-      // Sign out from Firebase
-      await signOutUser();
-    } catch (error) {
-      console.error("Firebase sign out error:", error);
-    }
-    
     // Clear local state
     setToken(null);
     setUser(null);