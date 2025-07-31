import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Download,
} from "lucide-react";
import { api } from "@/lib/api";

interface Budget {
  _id: string;
  name: string;
  amount: number;
  spent: number;
  category: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "overdue";
}

interface Expense {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  budgetId: string;
}

export default function Budget() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newBudget, setNewBudget] = useState({
    name: "",
    amount: 0,
    category: "",
    startDate: "",
    endDate: "",
  });
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: 0,
    category: "",
    date: "",
    budgetId: "",
  });

  useEffect(() => {
    fetchBudgets();
    fetchExpenses();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await api.get("/budgets");
      setBudgets(response as Budget[]);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await api.get("/expenses");
      setExpenses(response as Expense[]);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = async () => {
    try {
      await api.post("/budgets", newBudget);
      setNewBudget({
        name: "",
        amount: 0,
        category: "",
        startDate: "",
        endDate: "",
      });
      setShowAddBudget(false);
      fetchBudgets();
    } catch (error) {
      console.error("Error adding budget:", error);
    }
  };

  const handleAddExpense = async () => {
    try {
      await api.post("/expenses", newExpense);
      setNewExpense({
        description: "",
        amount: 0,
        category: "",
        date: "",
        budgetId: "",
      });
      setShowAddExpense(false);
      fetchExpenses();
      fetchBudgets();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const totalBudget = (budgets || []).reduce(
    (sum, budget) => sum + (budget.amount || 0),
    0
  );
  const totalSpent = (budgets || []).reduce(
    (sum, budget) => sum + (budget.spent || 0),
    0
  );
  const remainingBudget = totalBudget - totalSpent;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Budget Management</h1>
          <p className="text-muted-foreground">
            Track and manage project budgets
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowAddBudget(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Budget
          </Button>
          <Button onClick={() => setShowAddExpense(true)} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalBudget.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Allocated budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalSpent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Expenses incurred</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${remainingBudget.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Available budget</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="budgets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="budgets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(budgets || []).map((budget) => {
                  const progress =
                    budget.amount > 0
                      ? (budget.spent / budget.amount) * 100
                      : 0;
                  return (
                    <div key={budget._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">
                            {budget.name || "Unnamed Budget"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {budget.category || "Uncategorized"}
                          </p>
                        </div>
                        <Badge
                          className={getStatusColor(budget.status || "active")}
                        >
                          {budget.status || "active"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">
                          ${(budget.spent || 0).toLocaleString()} / $
                          {(budget.amount || 0).toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {progress.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={progress} className="mb-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          Start:{" "}
                          {budget.startDate
                            ? new Date(budget.startDate).toLocaleDateString()
                            : "Not set"}
                        </span>
                        <span>
                          End:{" "}
                          {budget.endDate
                            ? new Date(budget.endDate).toLocaleDateString()
                            : "Not set"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(expenses || []).map((expense) => (
                  <div
                    key={expense._id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">
                        {expense.description || "No description"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {expense.category || "Uncategorized"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${(expense.amount || 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {expense.date
                          ? new Date(expense.date).toLocaleDateString()
                          : "Unknown date"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20">
                    <Download className="w-4 h-4 mr-2" />
                    Export Budget Report
                  </Button>
                  <Button variant="outline" className="h-20">
                    <Download className="w-4 h-4 mr-2" />
                    Export Expense Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Budget Modal */}
      {showAddBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Budget</h2>
            <div className="space-y-4">
              <Input
                placeholder="Budget Name"
                value={newBudget.name}
                onChange={(e) =>
                  setNewBudget({ ...newBudget, name: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Amount"
                value={newBudget.amount}
                onChange={(e) =>
                  setNewBudget({ ...newBudget, amount: Number(e.target.value) })
                }
              />
              <Input
                placeholder="Category"
                value={newBudget.category}
                onChange={(e) =>
                  setNewBudget({ ...newBudget, category: e.target.value })
                }
              />
              <Input
                type="date"
                value={newBudget.startDate}
                onChange={(e) =>
                  setNewBudget({ ...newBudget, startDate: e.target.value })
                }
              />
              <Input
                type="date"
                value={newBudget.endDate}
                onChange={(e) =>
                  setNewBudget({ ...newBudget, endDate: e.target.value })
                }
              />
              <div className="flex space-x-2">
                <Button onClick={handleAddBudget} className="flex-1">
                  Add Budget
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddBudget(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
            <div className="space-y-4">
              <Input
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, description: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) =>
                  setNewExpense({
                    ...newExpense,
                    amount: Number(e.target.value),
                  })
                }
              />
              <Input
                placeholder="Category"
                value={newExpense.category}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, category: e.target.value })
                }
              />
              <Input
                type="date"
                value={newExpense.date}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, date: e.target.value })
                }
              />
              <select
                className="w-full p-2 border rounded"
                value={newExpense.budgetId}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, budgetId: e.target.value })
                }
                aria-label="Select budget for expense"
              >
                <option value="">Select Budget</option>
                {(budgets || []).map((budget) => (
                  <option key={budget._id} value={budget._id}>
                    {budget.name || "Unnamed Budget"}
                  </option>
                ))}
              </select>
              <div className="flex space-x-2">
                <Button onClick={handleAddExpense} className="flex-1">
                  Add Expense
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddExpense(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
