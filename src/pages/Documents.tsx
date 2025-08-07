@@ .. @@
 import { api } from "@/lib/api";
+import { mockDocuments } from "@/lib/mockData";
 
 interface Document {
@@ .. @@
   useEffect(() => {
-    fetchDocuments();
+    // Use mock data initially
+    setDocuments(mockDocuments as any[]);
+    setLoading(false);
+    
+    // Try to fetch real data
+    fetchDocuments();
   }, []);