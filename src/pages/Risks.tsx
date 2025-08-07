@@ .. @@
 import { api } from "@/lib/api";
+import { mockRisks } from "@/lib/mockData";
 
 interface Risk {
@@ .. @@
   useEffect(() => {
-    fetchRisks();
+    // Use mock data initially
+    setRisks(mockRisks as any[]);
+    setLoading(false);
+    
+    // Try to fetch real data
+    fetchRisks();
   }, []);