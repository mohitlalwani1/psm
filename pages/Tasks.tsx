import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  MoreHorizontal,
  User,
  Calendar,
  Clock,
  Link,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";

const statusOptions = ["todo", "in-progress", "review", "completed"];
const priorityOptions = ["low", "medium", "high", "critical"];

const initialForm = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  assignee: "",
  reporter: "",
  project: "",
  startDate: "",
  dueDate: "",
  estimatedHours: "",
  actualHours: "",
  dependencies: "",
  tags: "",
};

export default function Tasks() {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState<{ open: boolean; task?: any }>({
    open: false,
  });
  const [showView, setShowView] = useState<{ open: boolean; task?: any }>({
    open: false,
  });
  const [showDelete, setShowDelete] = useState<{ open: boolean; task?: any }>({
    open: false,
  });
  const [form, setForm] = useState(initialForm);
  const [taskList, setTaskList] = useState<any[]>([]);

  useEffect(() => {
    api
      .get("/tasks")
      .then((response) => setTaskList(response as any[]))
      .catch(console.error);
  }, []);

  const handleCreate = async () => {
    try {
      const newTask = await api.post("/tasks", form);
      setTaskList((prev) => [...prev, newTask]);
      setForm(initialForm);
      setShowCreate(false);
    } catch (e) {
      alert("Failed to create task");
    }
  };

  const handleEdit = async () => {
    try {
      if (!showEdit.task) return;
      await api.put();
      setTaskList((prev) =>
        prev.map((t) => (t._id === showEdit.task._id ? { ...t, ...form } : t))
      );
      setShowEdit({ open: false });
    } catch (e) {
      alert("Failed to update task");
    }
  };

  const handleDelete = async () => {
    try {
      if (!showDelete.task) return;
      await api.delete();
      setTaskList((prev) => prev.filter((t) => t._id !== showDelete.task._id));
      setShowDelete({ open: false });
    } catch (e) {
      alert("Failed to delete task");
    }
  };

  const TaskCard = ({ task }: { task: any }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              {task.title || "Untitled Task"}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {task.description || "No description"}
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
                onClick={() => setShowView({ open: true, task })}
              >
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setForm({
                    title: task.title || "",
                    description: task.description || "",
                    status: task.status || "todo",
                    priority: task.priority || "medium",
                    assignee: task.assignee || "",
                    reporter: task.reporter || "",
                    project: task.project || "",
                    startDate: task.startDate || "",
                    dueDate: task.dueDate || "",
                    estimatedHours: String(task.estimatedHours || 0),
                    actualHours: String(task.actualHours || 0),
                    dependencies: task.dependencies || "",
                    tags: task.tags || "",
                  });
                  setShowEdit({ open: true, task });
                }}
              >
                Edit Task
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setShowDelete({ open: true, task })}
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
              <Badge variant={task.status || "todo"}>
                {(task.status || "todo").replace("-", " ")}
              </Badge>
              <Badge variant={task.priority || "medium"}>
                {task.priority || "medium"}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">
              {task.project || "No project"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>{task.assignee || "Unassigned"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>
                Due{" "}
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "Not set"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>
                {task.actualHours || 0}h / {task.estimatedHours || 0}h
              </span>
            </div>
            {task.dependencies && (
              <div className="flex items-center space-x-2">
                <Link className="w-4 h-4 text-muted-foreground" />
                <span>{task.dependencies}</span>
              </div>
            )}
          </div>
          {task.tags && (
            <div className="flex flex-wrap gap-1">
              {task.tags.split(",").map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Reporter: {task.reporter || "Not assigned"}</span>
              <span>
                Started{" "}
                {task.startDate
                  ? new Date(task.startDate).toLocaleDateString()
                  : "Not set"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const todoTasks = (taskList || []).filter((t) => t.status === "todo");
  const inProgressTasks = (taskList || []).filter(
    (t) => t.status === "in-progress"
  );
  const reviewTasks = (taskList || []).filter((t) => t.status === "review");
  const completedTasks = (taskList || []).filter(
    (t) => t.status === "completed"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Track and manage tasks across all projects
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>
      {/* Create Task Modal */}
      {showCreate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Task</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
              }}
              className="space-y-4"
            >
              <input
                className="w-full border rounded p-2"
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
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
                value={form.project}
                onChange={(e) =>
                  setForm((f) => ({ ...f, project: e.target.value }))
                }
                required
                aria-label="Project"
              >
                <option value="">Select Project</option>
                {/* mockProjects.map((p) => ( */}
                {/*   <option key={p.id} value={p.name}> */}
                {/*     {p.name} */}
                {/*   </option> */}
                {/* ))} */}
              </select>
              <select
                className="w-full border rounded p-2"
                value={form.assignee}
                onChange={(e) =>
                  setForm((f) => ({ ...f, assignee: e.target.value }))
                }
                required
                aria-label="Assignee"
              >
                <option value="">Select Assignee</option>
                {/* mockUsers.map((u) => ( */}
                {/*   <option key={u.id} value={u.name}> */}
                {/*     {u.name} */}
                {/*   </option> */}
                {/* ))} */}
              </select>
              <select
                className="w-full border rounded p-2"
                value={form.reporter}
                onChange={(e) =>
                  setForm((f) => ({ ...f, reporter: e.target.value }))
                }
                required
                aria-label="Reporter"
              >
                <option value="">Select Reporter</option>
                {/* mockUsers.map((u) => ( */}
                {/*   <option key={u.id} value={u.name}> */}
                {/*     {u.name} */}
                {/*   </option> */}
                {/* ))} */}
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
                placeholder="Due Date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dueDate: e.target.value }))
                }
                required
              />
              <input
                className="w-full border rounded p-2"
                type="number"
                placeholder="Estimated Hours"
                value={form.estimatedHours}
                onChange={(e) =>
                  setForm((f) => ({ ...f, estimatedHours: e.target.value }))
                }
                required
              />
              <input
                className="w-full border rounded p-2"
                type="number"
                placeholder="Actual Hours"
                value={form.actualHours}
                onChange={(e) =>
                  setForm((f) => ({ ...f, actualHours: e.target.value }))
                }
              />
              <input
                className="w-full border rounded p-2"
                placeholder="Dependencies (comma separated)"
                value={form.dependencies}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dependencies: e.target.value }))
                }
              />
              <input
                className="w-full border rounded p-2"
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
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
      {/* Edit Task Modal */}
      {showEdit.open && showEdit.task && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEdit();
              }}
              className="space-y-4"
            >
              <input
                className="w-full border rounded p-2"
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
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
                value={form.project}
                onChange={(e) =>
                  setForm((f) => ({ ...f, project: e.target.value }))
                }
                required
                aria-label="Project"
              >
                <option value="">Select Project</option>
                {/* mockProjects.map((p) => ( */}
                {/*   <option key={p.id} value={p.name}> */}
                {/*     {p.name} */}
                {/*   </option> */}
                {/* ))} */}
              </select>
              <select
                className="w-full border rounded p-2"
                value={form.assignee}
                onChange={(e) =>
                  setForm((f) => ({ ...f, assignee: e.target.value }))
                }
                required
                aria-label="Assignee"
              >
                <option value="">Select Assignee</option>
                {/* mockUsers.map((u) => ( */}
                {/*   <option key={u.id} value={u.name}> */}
                {/*     {u.name} */}
                {/*   </option> */}
                {/* ))} */}
              </select>
              <select
                className="w-full border rounded p-2"
                value={form.reporter}
                onChange={(e) =>
                  setForm((f) => ({ ...f, reporter: e.target.value }))
                }
                required
                aria-label="Reporter"
              >
                <option value="">Select Reporter</option>
                {/* mockUsers.map((u) => ( */}
                {/*   <option key={u.id} value={u.name}> */}
                {/*     {u.name} */}
                {/*   </option> */}
                {/* ))} */}
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
                placeholder="Due Date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dueDate: e.target.value }))
                }
                required
              />
              <input
                className="w-full border rounded p-2"
                type="number"
                placeholder="Estimated Hours"
                value={form.estimatedHours}
                onChange={(e) =>
                  setForm((f) => ({ ...f, estimatedHours: e.target.value }))
                }
                required
              />
              <input
                className="w-full border rounded p-2"
                type="number"
                placeholder="Actual Hours"
                value={form.actualHours}
                onChange={(e) =>
                  setForm((f) => ({ ...f, actualHours: e.target.value }))
                }
              />
              <input
                className="w-full border rounded p-2"
                placeholder="Dependencies (comma separated)"
                value={form.dependencies}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dependencies: e.target.value }))
                }
              />
              <input
                className="w-full border rounded p-2"
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
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
      {/* View Task Modal */}
      {showView.open && showView.task && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Task Details</h2>
            <div className="mb-4">
              <div className="font-semibold">Title:</div>
              <div>{showView.task.title || "Untitled Task"}</div>
              <div className="font-semibold mt-2">Description:</div>
              <div>{showView.task.description || "No description"}</div>
              <div className="font-semibold mt-2">Project:</div>
              <div>{showView.task.project || "No project"}</div>
              <div className="font-semibold mt-2">Assignee:</div>
              <div>{showView.task.assignee || "Unassigned"}</div>
              <div className="font-semibold mt-2">Reporter:</div>
              <div>{showView.task.reporter || "Not assigned"}</div>
              <div className="font-semibold mt-2">Start Date:</div>
              <div>{showView.task.startDate || "Not set"}</div>
              <div className="font-semibold mt-2">Due Date:</div>
              <div>{showView.task.dueDate || "Not set"}</div>
              <div className="font-semibold mt-2">Estimated Hours:</div>
              <div>{showView.task.estimatedHours || 0}</div>
              <div className="font-semibold mt-2">Actual Hours:</div>
              <div>{showView.task.actualHours || 0}</div>
              <div className="font-semibold mt-2">Status:</div>
              <div>{showView.task.status || "Not set"}</div>
              <div className="font-semibold mt-2">Priority:</div>
              <div>{showView.task.priority || "Not set"}</div>
              <div className="font-semibold mt-2">Dependencies:</div>
              <div>{showView.task.dependencies || "None"}</div>
              <div className="font-semibold mt-2">Tags:</div>
              <div>{showView.task.tags || "None"}</div>
            </div>
            <Button
              className="w-full"
              onClick={() => setShowView({ open: false })}
            >
              Close
            </Button>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDelete.open && showDelete.task && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-600">Delete Task</h2>
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {showDelete.task.title || "this task"}
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
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Tasks ({taskList.length})</TabsTrigger>
          <TabsTrigger value="todo">To Do ({todoTasks.length})</TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({inProgressTasks.length})
          </TabsTrigger>
          <TabsTrigger value="review">
            Review ({reviewTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedTasks.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(taskList || []).map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="todo" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {todoTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="in-progress" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inProgressTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="review" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reviewTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
