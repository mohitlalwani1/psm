import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Plus, CheckCircle, XCircle, Clock } from "lucide-react";
import { api } from "@/lib/api";

interface Risk {
  _id: string;
  title: string;
  description: string;
  probability: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  status: "open" | "mitigated" | "closed";
  category: string;
  projectId: string;
  assignee: string;
  dueDate: string;
  mitigationPlan: string;
  createdAt: string;
}

export default function Risks() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddRisk, setShowAddRisk] = useState(false);
  const [newRisk, setNewRisk] = useState({
    title: "",
    description: "",
    probability: "medium" as const,
    impact: "medium" as const,
    category: "",
    projectId: "",
    assignee: "",
    dueDate: "",
    mitigationPlan: "",
  });

  useEffect(() => {
    fetchRisks();
  }, []);

  const fetchRisks = async () => {
    try {
      const response = await api.get("/risks");
      setRisks(response as any[]);
    } catch (error) {
      console.error("Error fetching risks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRisk = async () => {
    try {
      await api.post("/risks", newRisk);
      setNewRisk({
        title: "",
        description: "",
        probability: "medium",
        impact: "medium",
        category: "",
        projectId: "",
        assignee: "",
        dueDate: "",
        mitigationPlan: "",
      });
      setShowAddRisk(false);
      fetchRisks();
    } catch (error) {
      console.error("Error adding risk:", error);
    }
  };

  const handleUpdateRiskStatus = async (riskId: string, status: string) => {
    try {
      await api.put(`/risks/${riskId}`, { status });
      fetchRisks();
    } catch (error) {
      console.error("Error updating risk:", error);
    }
  };

  const getRiskLevel = (probability: string, impact: string) => {
    const levels = { low: 1, medium: 2, high: 3 };
    const score =
      levels[probability as keyof typeof levels] *
      levels[impact as keyof typeof levels];
    if (score <= 3)
      return { level: "Low", color: "bg-green-100 text-green-800" };
    if (score <= 6)
      return { level: "Medium", color: "bg-yellow-100 text-yellow-800" };
    return { level: "High", color: "bg-red-100 text-red-800" };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "mitigated":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProbabilityColor = (probability: string) => {
    switch (probability) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openRisks = (risks || []).filter((risk) => risk.status === "open");
  const mitigatedRisks = (risks || []).filter(
    (risk) => risk.status === "mitigated"
  );
  const closedRisks = (risks || []).filter((risk) => risk.status === "closed");

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Risk Management</h1>
          <p className="text-muted-foreground">
            Identify, assess, and mitigate project risks
          </p>
        </div>
        <Button onClick={() => setShowAddRisk(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Risk
        </Button>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(risks || []).length}</div>
            <p className="text-xs text-muted-foreground">
              All identified risks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Risks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {openRisks.length}
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mitigated</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mitigatedRisks.length}
            </div>
            <p className="text-xs text-muted-foreground">Under control</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {closedRisks.length}
            </div>
            <p className="text-xs text-muted-foreground">Resolved</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Risks</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="mitigated">Mitigated</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(risks || []).map((risk) => {
                  const riskLevel = getRiskLevel(
                    risk.probability || "medium",
                    risk.impact || "medium"
                  );
                  return (
                    <div key={risk._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {risk.title || "Untitled Risk"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {risk.description || "No description"}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge
                            className={getStatusColor(risk.status || "open")}
                          >
                            {risk.status || "open"}
                          </Badge>
                          <Badge className={riskLevel.color}>
                            {riskLevel.level} Risk
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-4 mb-2">
                        <Badge
                          className={getProbabilityColor(
                            risk.probability || "medium"
                          )}
                        >
                          Probability: {risk.probability || "medium"}
                        </Badge>
                        <Badge
                          className={getImpactColor(risk.impact || "medium")}
                        >
                          Impact: {risk.impact || "medium"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Category: {risk.category || "Uncategorized"} | Assignee:{" "}
                        {risk.assignee || "Unassigned"}
                      </div>
                      {risk.mitigationPlan && (
                        <div className="text-sm">
                          <strong>Mitigation Plan:</strong>{" "}
                          {risk.mitigationPlan}
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                          Due:{" "}
                          {risk.dueDate
                            ? new Date(risk.dueDate).toLocaleDateString()
                            : "Not set"}
                        </span>
                        <div className="flex space-x-2">
                          {risk.status === "open" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleUpdateRiskStatus(risk._id, "mitigated")
                                }
                              >
                                Mark Mitigated
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleUpdateRiskStatus(risk._id, "closed")
                                }
                              >
                                Close
                              </Button>
                            </>
                          )}
                          {risk.status === "mitigated" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleUpdateRiskStatus(risk._id, "closed")
                              }
                            >
                              Close
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="open" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Open Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {openRisks.map((risk) => {
                  const riskLevel = getRiskLevel(risk.probability, risk.impact);
                  return (
                    <div
                      key={risk._id}
                      className="border rounded-lg p-4 border-red-200 bg-red-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold">{risk.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {risk.description}
                          </p>
                        </div>
                        <Badge className={riskLevel.color}>
                          {riskLevel.level} Risk
                        </Badge>
                      </div>
                      <div className="flex space-x-4 mb-2">
                        <Badge
                          className={getProbabilityColor(risk.probability)}
                        >
                          Probability: {risk.probability}
                        </Badge>
                        <Badge className={getImpactColor(risk.impact)}>
                          Impact: {risk.impact}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Category: {risk.category} | Assignee: {risk.assignee}
                      </div>
                      {risk.mitigationPlan && (
                        <div className="text-sm">
                          <strong>Mitigation Plan:</strong>{" "}
                          {risk.mitigationPlan}
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                          Due: {new Date(risk.dueDate).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateRiskStatus(risk._id, "mitigated")
                            }
                          >
                            Mark Mitigated
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateRiskStatus(risk._id, "closed")
                            }
                          >
                            Close
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mitigated" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mitigated Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mitigatedRisks.map((risk) => {
                  const riskLevel = getRiskLevel(risk.probability, risk.impact);
                  return (
                    <div
                      key={risk._id}
                      className="border rounded-lg p-4 border-yellow-200 bg-yellow-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold">{risk.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {risk.description}
                          </p>
                        </div>
                        <Badge className={riskLevel.color}>
                          {riskLevel.level} Risk
                        </Badge>
                      </div>
                      <div className="flex space-x-4 mb-2">
                        <Badge
                          className={getProbabilityColor(risk.probability)}
                        >
                          Probability: {risk.probability}
                        </Badge>
                        <Badge className={getImpactColor(risk.impact)}>
                          Impact: {risk.impact}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Category: {risk.category} | Assignee: {risk.assignee}
                      </div>
                      {risk.mitigationPlan && (
                        <div className="text-sm">
                          <strong>Mitigation Plan:</strong>{" "}
                          {risk.mitigationPlan}
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">
                          Due: {new Date(risk.dueDate).toLocaleDateString()}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleUpdateRiskStatus(risk._id, "closed")
                          }
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="closed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Closed Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {closedRisks.map((risk) => {
                  const riskLevel = getRiskLevel(risk.probability, risk.impact);
                  return (
                    <div
                      key={risk._id}
                      className="border rounded-lg p-4 border-green-200 bg-green-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold">{risk.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {risk.description}
                          </p>
                        </div>
                        <Badge className={riskLevel.color}>
                          {riskLevel.level} Risk
                        </Badge>
                      </div>
                      <div className="flex space-x-4 mb-2">
                        <Badge
                          className={getProbabilityColor(risk.probability)}
                        >
                          Probability: {risk.probability}
                        </Badge>
                        <Badge className={getImpactColor(risk.impact)}>
                          Impact: {risk.impact}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Category: {risk.category} | Assignee: {risk.assignee}
                      </div>
                      {risk.mitigationPlan && (
                        <div className="text-sm">
                          <strong>Mitigation Plan:</strong>{" "}
                          {risk.mitigationPlan}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-2">
                        Due: {new Date(risk.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Risk Modal */}
      {showAddRisk && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Risk</h2>
            <div className="space-y-4">
              <Input
                placeholder="Risk Title"
                value={newRisk.title}
                onChange={(e) =>
                  setNewRisk({ ...newRisk, title: e.target.value })
                }
              />
              <textarea
                className="w-full p-2 border rounded"
                placeholder="Description"
                value={newRisk.description}
                onChange={(e) =>
                  setNewRisk({ ...newRisk, description: e.target.value })
                }
                rows={3}
              />
              <select
                className="w-full p-2 border rounded"
                value={newRisk.probability}
                onChange={(e) =>
                  setNewRisk({ ...newRisk, probability: e.target.value as any })
                }
                aria-label="Select probability level"
              >
                <option value="low">Low Probability</option>
                <option value="medium">Medium Probability</option>
                <option value="high">High Probability</option>
              </select>
              <select
                className="w-full p-2 border rounded"
                value={newRisk.impact}
                onChange={(e) =>
                  setNewRisk({ ...newRisk, impact: e.target.value as any })
                }
                aria-label="Select impact level"
              >
                <option value="low">Low Impact</option>
                <option value="medium">Medium Impact</option>
                <option value="high">High Impact</option>
              </select>
              <Input
                placeholder="Category"
                value={newRisk.category}
                onChange={(e) =>
                  setNewRisk({ ...newRisk, category: e.target.value })
                }
              />
              <Input
                placeholder="Assignee"
                value={newRisk.assignee}
                onChange={(e) =>
                  setNewRisk({ ...newRisk, assignee: e.target.value })
                }
              />
              <Input
                type="date"
                value={newRisk.dueDate}
                onChange={(e) =>
                  setNewRisk({ ...newRisk, dueDate: e.target.value })
                }
              />
              <textarea
                className="w-full p-2 border rounded"
                placeholder="Mitigation Plan"
                value={newRisk.mitigationPlan}
                onChange={(e) =>
                  setNewRisk({ ...newRisk, mitigationPlan: e.target.value })
                }
                rows={3}
              />
              <div className="flex space-x-2">
                <Button onClick={handleAddRisk} className="flex-1">
                  Add Risk
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddRisk(false)}
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
