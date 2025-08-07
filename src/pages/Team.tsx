@@ .. @@
 import { api } from "@/lib/api";
+import { mockTeamMembers } from "@/lib/mockData";
 
 interface TeamMember {
@@ .. @@
   useEffect(() => {
-    fetchTeamMembers();
+    // Use mock data initially, then try to fetch from API
+    setTeamMembers(mockTeamMembers as any[]);
+    setLoading(false);
+    
+    // Try to fetch real data
+    fetchTeamMembers();
   }, []);