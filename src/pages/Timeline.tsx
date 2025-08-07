@@ .. @@
 import { useEffect, useState } from "react";
 import { api } from "@/lib/api";
+import { mockProjects } from "@/lib/mockData";
 
 const statusColors = {
@@ .. @@
   useEffect(() => {
-    api
-      .get("/projects")
-      .then((response) => setTimelineData(response as any[]))
-      .catch(console.error);
+    // Use mock data initially
+    setTimelineData(mockProjects as any[]);
+    
+    // Try to fetch real data
+    api
+      .get("/projects")
+      .then((response) => setTimelineData(response as any[]))
+      .catch(console.error);
   }, []);