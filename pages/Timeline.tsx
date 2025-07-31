import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BarChart3, List, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const statusColors = {
  "not-started": "secondary",
  "in-progress": "default",
  "on-hold": "warning",
  completed: "success",
  cancelled: "destructive",
} as const;

type TimelineStatus = keyof typeof statusColors;

function getDateRange(start: string, end: string) {
  return Math.ceil(
    (new Date(end).getTime() - new Date(start).getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

export default function Timeline() {
  const [activeTab, setActiveTab] = useState("gantt");
  const [timelineData, setTimelineData] = useState<any[]>([]);

  useEffect(() => {
    api
      .get("/projects")
      .then((response) => setTimelineData(response as any[]))
      .catch(console.error);
  }, []);

  const GanttView = () => (
    <div className="space-y-6">
      {(timelineData || []).map((item) => {
        const totalDays =
          item.startDate && item.endDate
            ? getDateRange(item.startDate, item.endDate)
            : 0;
        const status = (item.status || "not-started") as TimelineStatus;
        return (
          <Card
            key={item._id || item.id}
            className="hover:shadow-lg transition cursor-pointer"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {item.name || "Unnamed Project"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {item.startDate && item.endDate ? (
                      <>
                        {new Date(item.startDate).toLocaleDateString()} -{" "}
                        {new Date(item.endDate).toLocaleDateString()} (
                        {totalDays} days)
                      </>
                    ) : (
                      "Dates not set"
                    )}
                  </p>
                </div>
                <Badge variant={statusColors[status]}>
                  {(item.status || "not-started").replace("-", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                <Progress value={item.progress || 0} className="h-2" />
                <span className="text-xs text-muted-foreground">
                  {item.progress || 0}% complete
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(item.milestones || []).map(
                  (m: { name: string; completed: boolean }) => (
                    <span
                      key={m.name}
                      className={`px-2 py-1 rounded text-xs ${
                        m.completed
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {m.name}
                    </span>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const CalendarView = () => (
    <Card>
      <CardHeader>
        <CardTitle>Calendar View</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-4" />
          <p>Calendar view will be implemented here</p>
          <p className="text-sm">
            This will show projects and milestones in a calendar format
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const ListView = () => (
    <div className="space-y-4">
      {(timelineData || []).map((item) => {
        const status = (item.status || "not-started") as TimelineStatus;
        return (
          <Card
            key={item._id || item.id}
            className="hover:shadow-lg transition cursor-pointer"
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">
                    {item.name || "Unnamed Project"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.startDate && item.endDate ? (
                      <>
                        {new Date(item.startDate).toLocaleDateString()} -{" "}
                        {new Date(item.endDate).toLocaleDateString()}
                      </>
                    ) : (
                      "Dates not set"
                    )}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.progress || 0}%</p>
                    <Progress value={item.progress || 0} className="w-20 h-2" />
                  </div>
                  <Badge variant={statusColors[status]}>
                    {(item.status || "not-started").replace("-", " ")}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timeline</h1>
          <p className="text-muted-foreground">
            Visualize project timelines and track progress
          </p>
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="gantt">
            <BarChart3 className="w-4 h-4 mr-2" />
            Gantt Chart
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="w-4 h-4 mr-2" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="w-4 h-4 mr-2" />
            List View
          </TabsTrigger>
        </TabsList>
        <TabsContent value="gantt">
          <GanttView />
        </TabsContent>
        <TabsContent value="calendar">
          <CalendarView />
        </TabsContent>
        <TabsContent value="list">
          <ListView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
