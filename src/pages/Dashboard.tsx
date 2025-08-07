@@ .. @@
 import { api } from "@/lib/api";
+import { mockUsers, mockNotifications } from "@/lib/mockData";
 
 export default function Dashboard() {
@@ .. @@
   useEffect(() => {
-    api.get("/users/me").then(setUser).catch(console.error);
-    api
-      .get("/notifications")
-      .then((notes) => {
-        if (Array.isArray(notes)) {
-          setUnreadCount(notes.filter((n: any) => !n.read).length);
-        } else {
-          setUnreadCount(0);
-        }
-      })
-      .catch(console.error);
+    // Use mock data initially
+    setUser(mockUsers[0]);
+    setUnreadCount(mockNotifications.filter(n => !n.read).length);
+    
+    // Try to fetch real data
+    api.get("/users/me").then(setUser).catch(console.error);
+    api
+      .get("/notifications")
+      .then((notes) => {
+        if (Array.isArray(notes)) {
+          setUnreadCount(notes.filter((n: any) => !n.read).length);
+        } else {
+          setUnreadCount(0);
+        }
+      })
+      .catch(console.error);
   }, []);