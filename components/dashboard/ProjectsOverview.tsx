import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Users, Calendar, DollarSign } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const projects = [
  {
    id: "1",
    name: "E-commerce Platform",
    status: "in-progress" as const,
    priority: "high" as const,
    progress: 75,
    budget: 150000,
    spent: 112500,
    dueDate: "2024-03-15",
    team: 8,
    manager: "Sarah Johnson",
  },
  {
    id: "2",
    name: "Mobile App Redesign",
    status: "in-progress" as const,
    priority: "medium" as const,
    progress: 45,
    budget: 80000,
    spent: 36000,
    dueDate: "2024-02-28",
    team: 5,
    manager: "Mike Chen",
  },
  {
    id: "3",
    name: "Data Analytics Dashboard",
    status: "completed" as const,
    priority: "low" as const,
    progress: 100,
    budget: 60000,
    spent: 58000,
    dueDate: "2024-01-30",
    team: 4,
    manager: "Emily Davis",
  },
];

const statusColors = {
  "not-started": "secondary",
  "in-progress": "default",
  "on-hold": "warning",
  completed: "success",
  cancelled: "destructive",
} as const;

const priorityColors = {
  low: "secondary",
  medium: "warning",
  high: "destructive",
  critical: "destructive",
} as const;

export function ProjectsOverview({
  onProjectAction,
}: {
  onProjectAction?: (action: "view" | "edit" | "timeline", id: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{project.name}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onProjectAction?.("view", project.id)}
                      >
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onProjectAction?.("edit", project.id)}
                      >
                        Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          onProjectAction?.("timeline", project.id)
                        }
                      >
                        View Timeline
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{project.team} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Due {new Date(project.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      ${project.spent.toLocaleString()} / $
                      {project.budget.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant={statusColors[project.status]}>
                      {project.status.replace("-", " ")}
                    </Badge>
                    <Badge variant={priorityColors[project.priority]}>
                      {project.priority}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {project.progress}% complete
                  </span>
                </div>

                <Progress value={project.progress} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
