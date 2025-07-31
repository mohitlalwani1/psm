import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Target,
  CheckSquare,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

const stats = [
  {
    title: "Active Projects",
    value: "24",
    change: "+12%",
    trend: "up" as const,
    icon: Target,
    description: "from last month",
  },
  {
    title: "Completed Tasks",
    value: "1,429",
    change: "+8%",
    trend: "up" as const,
    icon: CheckSquare,
    description: "this month",
  },
  {
    title: "Open Risks",
    value: "12",
    change: "-4%",
    trend: "down" as const,
    icon: AlertTriangle,
    description: "from last week",
  },
  {
    title: "Budget Utilization",
    value: "78%",
    change: "0%",
    trend: "neutral" as const,
    icon: DollarSign,
    description: "of total budget",
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const TrendIcon =
          stat.trend === "up"
            ? TrendingUp
            : stat.trend === "down"
            ? TrendingDown
            : Minus;

        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <TrendIcon
                    className={`h-3 w-3 mr-1 ${
                      stat.trend === "up"
                        ? "text-green-500"
                        : stat.trend === "down"
                        ? "text-red-500"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={
                      stat.trend === "up"
                        ? "text-green-500"
                        : stat.trend === "down"
                        ? "text-red-500"
                        : "text-muted-foreground"
                    }
                  >
                    {stat.change}
                  </span>
                </div>
                <span>{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
