@@ .. @@
 import { api } from "@/lib/api";
+import { mockBudgets, mockExpenses } from "@/lib/mockData";
 
 interface Budget {
@@ .. @@
   useEffect(() => {
-    fetchBudgets();
-    fetchExpenses();
+    // Use mock data initially
+    setBudgets(mockBudgets as any[]);
+    setExpenses(mockExpenses as any[]);
+    setLoading(false);
+    
+    // Try to fetch real data
+    fetchBudgets();
+    fetchExpenses();
   }, []);