import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, Bell } from "lucide-react";
import { api } from "@/lib/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    api.get("/users/me").then(setUser).catch(console.error);
    api
      .get("/notifications")
      .then((notes) => {
        if (Array.isArray(notes)) {
          setUnreadCount(notes.filter((n: any) => !n.read).length);
        } else {
          setUnreadCount(0);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6 shadow">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1 text-blue-900">
            Welcome back, {user?.name || "User"}!
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Your project management dashboard at a glance.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-4 lg:mt-0">
          <Button
            onClick={() => navigate("/projects")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
          >
            + Create Project
          </Button>
          <Button
            onClick={() => navigate("/tasks")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
          >
            + Create Task
          </Button>
          <div className="relative">
            <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 flex flex-col items-center mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          <h2 className="text-lg sm:text-xl font-bold">
            Project Progress Overview
          </h2>
        </div>
        {/* Placeholder for Gantt/Bar/Line chart */}
        <div className="w-full h-32 sm:h-48 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg text-sm sm:text-base">
          <span>Chart coming soon (Gantt/Bar/Line)</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Active Projects
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-blue-600">12</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Completed Tasks
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">45</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Team Members
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-purple-600">8</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Budget Used
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-orange-600">67%</p>
        </div>
      </div>
    </div>
  );
}
