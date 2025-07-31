import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckSquare,
  Target,
  AlertTriangle,
  FileText,
  Clock,
} from "lucide-react";

const activities = [
  {
    id: "1",
    type: "completed" as const,
    entity: "task" as const,
    entityName: "Update user authentication",
    user: { name: "John Doe", avatar: "" },
    description: "marked task as completed",
    timestamp: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    type: "created" as const,
    entity: "project" as const,
    entityName: "Mobile App Redesign",
    user: { name: "Sarah Johnson", avatar: "" },
    description: "created new project",
    timestamp: "2024-01-15T09:15:00Z",
  },
  {
    id: "3",
    type: "updated" as const,
    entity: "risk" as const,
    entityName: "Database performance issues",
    user: { name: "Mike Chen", avatar: "" },
    description: "updated risk status to mitigated",
    timestamp: "2024-01-15T08:45:00Z",
  },
  {
    id: "4",
    type: "assigned" as const,
    entity: "task" as const,
    entityName: "Code review for payment module",
    user: { name: "Emily Davis", avatar: "" },
    description: "assigned task to Alex Wilson",
    timestamp: "2024-01-14T16:20:00Z",
  },
  {
    id: "5",
    type: "commented" as const,
    entity: "document" as const,
    entityName: "API Documentation v2.1",
    user: { name: "Alex Wilson", avatar: "" },
    description: "added comment on document",
    timestamp: "2024-01-14T14:10:00Z",
  },
];

const entityIcons = {
  task: CheckSquare,
  project: Target,
  risk: AlertTriangle,
  document: FileText,
};

const typeColors = {
  created: "success",
  updated: "default",
  completed: "success",
  assigned: "warning",
  commented: "secondary",
} as const;

function formatTimeAgo(timestamp: string) {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInHours = Math.floor(
    (now.getTime() - time.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export function RecentActivity({
  onEntityClick,
}: {
  onEntityClick?: (
    entity: "project" | "task" | "risk" | "document",
    id: string
  ) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const EntityIcon = entityIcons[activity.entity];

            return (
              <div
                key={activity.id}
                className="flex items-start space-x-3 cursor-pointer hover:bg-gray-100 rounded p-2"
                onClick={() => onEntityClick?.(activity.entity, activity.id)}
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <EntityIcon className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user.name}</span>{" "}
                      <span className="text-muted-foreground">
                        {activity.description}
                      </span>
                    </p>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={typeColors[activity.type]}
                        className="text-xs"
                      >
                        {activity.type}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-1">
                    {activity.entityName}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
