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
  { id: "4", name: "John Doe" },
  { id: "5", name: "Jane Smith" },
];

const statusOptions = [
  "not-started",
  "in-progress",
  "on-hold",
  "completed",
  "cancelled",
];
const priorityOptions = ["low", "medium", "high", "critical"];

const initialForm = {
  name: "",
  description: "",
  manager: "",
  startDate: "",
  endDate: "",
  budget: "",
  status: "not-started",
  priority: "medium",
};

export default function Projects() {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<{ open: boolean; project?: any }>({
    open: false,
  });
  const [showView, setShowView] = useState<{ open: boolean; project?: any }>({
    open: false,
  });
  const [showDelete, setShowDelete] = useState<{
    open: boolean;
    project?: any;
  }>({ open: false });
  const [form, setForm] = useState(initialForm);
  const [projectList, setProjectList] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState("overview");
  const [team, setTeam] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [risks, setRisks] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [newTeamMember, setNewTeamMember] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    assignee: "",
    dueDate: "",
  });
  const [newRisk, setNewRisk] = useState({ title: "", status: "identified" });
  const [newDoc, setNewDoc] = useState({ name: "" });

  useEffect(() => {
    api
      .get("/projects")
      .then((response) => setProjectList(response as any[]))
      .catch(console.error);
  }, []);

  const handleCreate = async () => {
    try {
      const newProject = await api.post("/projects", form);
      setProjectList((prev) => [...prev, newProject]);
      setForm(initialForm);
      setShowCreate(false);
    } catch (e) {
      alert("Failed to create project");
    }
  };

  const handleEdit = async () => {
    try {
      if (!showEdit.project) return;
      await api.put(`/projects/${showEdit.project._id}`, form);
      setProjectList((prev) =>
        prev.map((p) =>
          p._id === showEdit.project._id ? { ...p, ...form } : p
        )
      );
      setShowEdit({ open: false });
    } catch (e) {
      alert("Failed to update project");
    }
  };

  const handleDelete = async () => {
    try {
      if (!showDelete.project) return;
      await api.delete();
      setProjectList((prev) =>
        prev.filter((p) => p._id !== showDelete.project._id)
      );
      setShowDelete({ open: false });
    } catch (e) {
      alert("Failed to delete project");
    }
  };

  const handleAddTeamMember = () => {
    if (!newTeamMember) return;
    setTeam([...team, mockUsers.find((u) => u.id === newTeamMember)]);
    setNewTeamMember("");
  };
  const handleRemoveTeamMember = (id: string) => {
    setTeam(team.filter((u) => u.id !== id));
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.assignee) return;
    setTasks([...tasks, { ...newTask, id: (tasks.length + 1).toString() }]);
    setNewTask({ title: "", assignee: "", dueDate: "" });
  };
  const handleRemoveTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleAddRisk = () => {
    if (!newRisk.title) return;
    setRisks([...risks, { ...newRisk, id: (risks.length + 1).toString() }]);
    setNewRisk({ title: "", status: "identified" });
  };
  const handleRemoveRisk = (id: string) => {
    setRisks(risks.filter((r) => r.id !== id));
  };

  const handleAddDoc = () => {
    if (!newDoc.name) return;
    setDocuments([
      ...documents,
      { ...newDoc, id: (documents.length + 1).toString() },
    ]);
    setNewDoc({ name: "" });
  };
  const handleRemoveDoc = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
  };

  const ProjectCard = ({ project }: { project: any }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {project.description}
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
                  setShowView({ open: true, project });
                  setActiveTab("overview");
                  setTeam(project.team || []);
                  setTasks(project.tasks || []);
                  setRisks(project.risks || []);
                  setDocuments(project.documents || []);
                }}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setForm({
                    name: project.name || "",
                    description: project.description || "",
                    manager: project.manager || "",
                    startDate: project.startDate || "",
                    endDate: project.endDate || "",
                    budget: String(project.budget || 0),
                    status: project.status || "not-started",
                    priority: project.priority || "medium",
                  });
                  setShowEdit({ open: true, project });
                }}
              >
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("Timeline coming soon!")}>
                View Timeline
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("Report coming soon!")}>
                Generate Report
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setShowDelete({ open: true, project })}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge
                variant={
                  statusOptions.includes(project.status)
                    ? project.status
                    : "default"
                }
              >
                {(project.status || "unknown").replace("-", " ")}
              </Badge>
              <Badge
                variant={
                  priorityOptions.includes(project.priority)
                    ? project.priority
                    : "default"
                }
              >
                {project.priority || "medium"}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">
              {project.progress || 0}% complete
            </span>
          </div>
          <Progress value={project.progress || 0} className="h-2" />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{(project.team || []).length} members</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>
                Due{" "}
                {project.endDate
                  ? new Date(project.endDate).toLocaleDateString()
                  : "Not set"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span>
                ${(project.spent || 0).toLocaleString()} / $
                {(project.budget || 0).toLocaleString()}
              </span>
            </div>
            {(project.risks || []).length > 0 && (
              <div className="flex items-center space-x-2 text-yellow-600">
                <AlertTriangle className="w-4 h-4" />
                <span>{(project.risks || []).length} risks</span>
              </div>
            )}
          </div>
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Manager: {project.manager || "Not assigned"}</span>
              <span>Tasks: {(project.tasks || []).length}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage and track all your projects in one place
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>
      {/* Create Project Modal */}
      {showCreate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Project</h2>
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
              <label htmlFor="manager-select" className="sr-only">
                Project Manager
              </label>
              <select
                id="manager-select"
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
              <label htmlFor="status-select" className="sr-only">
                Status
              </label>
              <select
                id="status-select"
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
              <label htmlFor="priority-select" className="sr-only">
                Priority
              </label>
              <select
                id="priority-select"
                className="w-full border rounded p-2"
                value={form.priority}
                onChange={(e) =>
                  setForm((f) => ({ ...f, priority: e.target.value }))
                }
                required
                aria-label="Priority"
              >
                {priorityOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
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
      {/* Edit Project Modal */}
      {showEdit.open && showEdit.project && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Project</h2>
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
              <select
                className="w-full border rounded p-2"
                value={form.priority}
                onChange={(e) =>
                  setForm((f) => ({ ...f, priority: e.target.value }))
                }
                required
                aria-label="Priority"
              >
                {priorityOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
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
      {showView.open && showView.project && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4">Project Details</h2>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-4"
            >
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="risks">Risks</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <div className="mb-4">
                  <div className="font-semibold">Name:</div>
                  <div>{showView.project.name || "Not set"}</div>
                  <div className="font-semibold mt-2">Description:</div>
                  <div>{showView.project.description || "No description"}</div>
                  <div className="font-semibold mt-2">Manager:</div>
                  <div>{showView.project.manager || "Not assigned"}</div>
                  <div className="font-semibold mt-2">Start Date:</div>
                  <div>{showView.project.startDate || "Not set"}</div>
                  <div className="font-semibold mt-2">End Date:</div>
                  <div>{showView.project.endDate || "Not set"}</div>
                  <div className="font-semibold mt-2">Budget:</div>
                  <div>${showView.project.budget || 0}</div>
                  <div className="font-semibold mt-2">Status:</div>
                  <div>{showView.project.status || "Not set"}</div>
                  <div className="font-semibold mt-2">Priority:</div>
                  <div>{showView.project.priority || "Not set"}</div>
                </div>
              </TabsContent>
              <TabsContent value="tasks">
                <div className="mb-2 flex gap-2">
                  <input
                    className="border rounded p-2 flex-1"
                    placeholder="Task Title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask((t) => ({ ...t, title: e.target.value }))
                    }
                  />
                  <select
                    className="border rounded p-2"
                    value={newTask.assignee}
                    onChange={(e) =>
                      setNewTask((t) => ({ ...t, assignee: e.target.value }))
                    }
                    aria-label="Assignee"
                  >
                    <option value="">Assignee</option>
                    {mockUsers.map((u) => (
                      <option key={u.id} value={u.name}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                  <input
                    className="border rounded p-2"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask((t) => ({ ...t, dueDate: e.target.value }))
                    }
                    placeholder="Due Date"
                    aria-label="Due Date"
                  />
                  <Button onClick={handleAddTask}>Add</Button>
                </div>
                <ul className="space-y-2">
                  {tasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center justify-between border rounded p-2"
                    >
                      <span>
                        {task.title} (Assignee: {task.assignee}, Due:{" "}
                        {task.dueDate})
                      </span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveTask(task.id)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="team">
                <div className="mb-2 flex gap-2">
                  <select
                    className="border rounded p-2 flex-1"
                    value={newTeamMember}
                    onChange={(e) => setNewTeamMember(e.target.value)}
                    aria-label="Team Member"
                  >
                    <option value="">Select User</option>
                    {mockUsers
                      .filter((u) => !team.some((t) => t.id === u.id))
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                  </select>
                  <Button onClick={handleAddTeamMember}>Add</Button>
                </div>
                <ul className="space-y-2">
                  {team.map((member) => (
                    <li
                      key={member.id}
                      className="flex items-center justify-between border rounded p-2"
                    >
                      <span>{member.name}</span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveTeamMember(member.id)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="risks">
                <div className="mb-2 flex gap-2">
                  <input
                    className="border rounded p-2 flex-1"
                    placeholder="Risk Title"
                    value={newRisk.title}
                    onChange={(e) =>
                      setNewRisk((r) => ({ ...r, title: e.target.value }))
                    }
                  />
                  <select
                    className="border rounded p-2"
                    value={newRisk.status}
                    onChange={(e) =>
                      setNewRisk((r) => ({ ...r, status: e.target.value }))
                    }
                    aria-label="Risk Status"
                  >
                    <option value="identified">Identified</option>
                    <option value="assessed">Assessed</option>
                    <option value="mitigated">Mitigated</option>
                    <option value="closed">Closed</option>
                  </select>
                  <Button onClick={handleAddRisk}>Add</Button>
                </div>
                <ul className="space-y-2">
                  {risks.map((risk) => (
                    <li
                      key={risk.id}
                      className="flex items-center justify-between border rounded p-2"
                    >
                      <span>
                        {risk.title} ({risk.status})
                      </span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveRisk(risk.id)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="documents">
                <div className="mb-2 flex gap-2">
                  <input
                    className="border rounded p-2 flex-1"
                    placeholder="Document Name"
                    value={newDoc.name}
                    onChange={(e) =>
                      setNewDoc((d) => ({ ...d, name: e.target.value }))
                    }
                  />
                  <Button onClick={handleAddDoc}>Add</Button>
                </div>
                <ul className="space-y-2">
                  {documents.map((doc) => (
                    <li
                      key={doc.id}
                      className="flex items-center justify-between border rounded p-2"
                    >
                      <span>{doc.name}</span>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveDoc(doc.id)}
                      >
                        Remove
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
      {showDelete.open && showDelete.project && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-600">
              Delete Project
            </h2>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {showDelete.project.name || "this project"}
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
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            Active (
            {projectList.filter((p) => p.status === "in-progress").length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed (
            {projectList.filter((p) => p.status === "completed").length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming (
            {projectList.filter((p) => p.status === "not-started").length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Projects ({projectList.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {projectList
              .filter((p) => p.status === "in-progress")
              .map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {projectList
              .filter((p) => p.status === "completed")
              .map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {projectList
              .filter((p) => p.status === "not-started")
              .map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
          </div>
        </TabsContent>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {projectList.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
