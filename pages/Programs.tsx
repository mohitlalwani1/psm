import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  MoreHorizontal,
  Users,
  Calendar,
  DollarSign,
  Target,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";

const mockUsers = [
  { id: "1", name: "Sarah Johnson" },
  { id: "2", name: "Mike Chen" },
  { id: "3", name: "Emily Davis" },
];

const statusOptions = ["planning", "active", "on-hold", "completed"];
const initialForm = {
  name: "",
  description: "",
  manager: "",
  startDate: "",
  endDate: "",
  budget: "",
  status: "planning",
};

export default function Programs() {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<{ open: boolean; program?: any }>({
    open: false,
  });
  const [showView, setShowView] = useState<{ open: boolean; program?: any }>({
    open: false,
  });
  const [showDelete, setShowDelete] = useState<{
    open: boolean;
    program?: any;
  }>({ open: false });
  const [form, setForm] = useState(initialForm);
  const [programList, setProgramList] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    api
      .get("/programs")
      .then((response) => setProgramList(response as any[]))
      .catch(console.error);
  }, []);

  const handleCreate = async () => {
    try {
      const newProgram = await api.post("/programs", form);
      setProgramList((prev) => [...prev, newProgram]);
      setForm(initialForm);
      setShowCreate(false);
    } catch (e) {
      alert("Failed to create program");
    }
  };

  const handleEdit = async () => {
    try {
      if (!showEdit.program) return;
      await api.put(`/programs/${showEdit.program._id}`, form);
      setProgramList((prev) =>
        prev.map((p) =>
          p._id === showEdit.program._id ? { ...p, ...form } : p
        )
      );
      setShowEdit({ open: false });
    } catch (e) {
      alert("Failed to update program");
    }
  };

  const handleDelete = async () => {
    try {
      if (!showDelete.program) return;
      await api.delete();
      setProgramList((prev) =>
        prev.filter((p) => p._id !== showDelete.program._id)
      );
      setShowDelete({ open: false });
    } catch (e) {
      alert("Failed to delete program");
    }
  };

  const ProgramCard = ({ program }: { program: any }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              {program.name || "Unnamed Program"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {program.description || "No description"}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setShowView({ open: true, program });
                  setActiveTab("overview");
                }}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setForm({
                    name: program.name || "",
                    description: program.description || "",
                    manager: program.manager || "",
                    startDate: program.startDate || "",
                    endDate: program.endDate || "",
                    budget: String(program.budget || 0),
                    status: program.status || "planning",
                  });
                  setShowEdit({ open: true, program });
                }}
              >
                Edit Program
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setShowDelete({ open: true, program })}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Badge variant={program.status || "planning"}>
              {program.status || "planning"}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>Manager: {program.manager || "Not assigned"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>
              {program.startDate
                ? new Date(program.startDate).toLocaleDateString()
                : "Not set"}{" "}
              -{" "}
              {program.endDate
                ? new Date(program.endDate).toLocaleDateString()
                : "Not set"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span>
              ${(program.spent || 0).toLocaleString()} / $
              {(program.budget || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span>{(program.projects || []).length} projects</span>
          </div>
          {(program.risks || []).length > 0 && (
            <div className="flex items-center space-x-2 text-yellow-600">
              <AlertTriangle className="w-4 h-4" />
              <span>{(program.risks || []).length} risks</span>
            </div>
          )}
        </div>
        <div className="mt-2">
          <Progress
            value={
              program.budget > 0
                ? ((program.spent || 0) / program.budget) * 100
                : 0
            }
            className="h-2"
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Programs</h1>
          <p className="text-muted-foreground">
            Manage strategic programs and their associated projects
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Program
        </Button>
      </div>
      {/* Create Program Modal */}
      {showCreate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Program</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
              }}
              className="space-y-4"
            >
              <input
                className="w-full border rounded p-2"
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
              <input
                className="w-full border rounded p-2"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                required
              />
              <select
                className="w-full border rounded p-2"
                value={form.manager}
                onChange={(e) =>
                  setForm((f) => ({ ...f, manager: e.target.value }))
                }
                required
                aria-label="Manager"
              >
                <option value="">Select Manager</option>
                {mockUsers.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </select>
              <input
                className="w-full border rounded p-2"
                type="date"
                placeholder="Start Date"
                value={form.startDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, startDate: e.target.value }))
                }
                required
              />
              <input
                className="w-full border rounded p-2"
                type="date"
                placeholder="End Date"
                value={form.endDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, endDate: e.target.value }))
                }
                required
              />
              <input
                className="w-full border rounded p-2"
                type="number"
                placeholder="Budget"
                value={form.budget}
                onChange={(e) =>
                  setForm((f) => ({ ...f, budget: e.target.value }))
                }
                required
              />
              <select
                className="w-full border rounded p-2"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value }))
                }
                required
                aria-label="Status"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Create
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Edit Program Modal */}
      {showEdit.open && showEdit.program && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Program</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEdit();
              }}
              className="space-y-4"
            >
              <input
                className="w-full border rounded p-2"
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
              <input
                className="w-full border rounded p-2"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                required
              />
              <select
                className="w-full border rounded p-2"
                value={form.manager}
                onChange={(e) =>
                  setForm((f) => ({ ...f, manager: e.target.value }))
                }
                required
                aria-label="Manager"
              >
                <option value="">Select Manager</option>
                {mockUsers.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </select>
              <input
                className="w-full border rounded p-2"
                type="date"
                placeholder="Start Date"
                value={form.startDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, startDate: e.target.value }))
                }
                required
              />
              <input
                className="w-full border rounded p-2"
                type="date"
                placeholder="End Date"
                value={form.endDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, endDate: e.target.value }))
                }
                required
              />
              <input
                className="w-full border rounded p-2"
                type="number"
                placeholder="Budget"
                value={form.budget}
                onChange={(e) =>
                  setForm((f) => ({ ...f, budget: e.target.value }))
                }
                required
              />
              <select
                className="w-full border rounded p-2"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value }))
                }
                required
                aria-label="Status"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Save
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowEdit({ open: false })}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* View Details Modal with Tabs */}
      {showView.open && showView.program && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Program Details</h2>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-4"
            >
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="risks">Risks</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <div className="mb-4">
                  <div className="font-semibold">Name:</div>
                  <div>{showView.program.name || "Unnamed Program"}</div>
                  <div className="font-semibold mt-2">Description:</div>
                  <div>{showView.program.description || "No description"}</div>
                  <div className="font-semibold mt-2">Manager:</div>
                  <div>{showView.program.manager || "Not assigned"}</div>
                  <div className="font-semibold mt-2">Start Date:</div>
                  <div>{showView.program.startDate || "Not set"}</div>
                  <div className="font-semibold mt-2">End Date:</div>
                  <div>{showView.program.endDate || "Not set"}</div>
                  <div className="font-semibold mt-2">Budget:</div>
                  <div>${showView.program.budget || 0}</div>
                  <div className="font-semibold mt-2">Status:</div>
                  <div>{showView.program.status || "planning"}</div>
                </div>
              </TabsContent>
              <TabsContent value="projects">
                <ul className="space-y-2">
                  {(showView.program.projects || []).map((proj: any) => (
                    <li
                      key={proj.id}
                      className="flex items-center justify-between border rounded p-2"
                    >
                      <span>
                        {proj.name} ({proj.status})
                      </span>
                      <Button size="sm" variant="secondary">
                        View
                      </Button>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="risks">
                <ul className="space-y-2">
                  {(showView.program.risks || []).map((risk: any) => (
                    <li
                      key={risk.id}
                      className="flex items-center justify-between border rounded p-2"
                    >
                      <span>
                        {risk.title} ({risk.status})
                      </span>
                      <Button size="sm" variant="secondary">
                        View
                      </Button>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
            <Button
              className="w-full mt-4"
              onClick={() => setShowView({ open: false })}
            >
              Close
            </Button>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDelete.open && showDelete.program && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-600">
              Delete Program
            </h2>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {showDelete.program.name || "Unnamed Program"}
              </span>
              ?
            </p>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
              <Button
                className="flex-1"
                variant="secondary"
                onClick={() => setShowDelete({ open: false })}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Program List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {programList.map((program) => (
          <ProgramCard key={program._id} program={program} />
        ))}
      </div>
    </div>
  );
}
