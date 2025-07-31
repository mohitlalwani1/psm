import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Search,
  Crown,
  Shield,
  User,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { api } from "@/lib/api";

interface TeamMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "admin" | "manager" | "member" | "viewer";
  department: string;
  position: string;
  avatar: string;
  joinDate: string;
  status: "active" | "inactive" | "pending";
  skills: string[];
  projects: string[];
  performance: {
    completedTasks: number;
    totalTasks: number;
    rating: number;
  };
}

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [newMember, setNewMember] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "member" as const,
    department: "",
    position: "",
    skills: "",
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await api.get("/users");
      setTeamMembers(response as any[]);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    try {
      const memberData = {
        ...newMember,
        skills: newMember.skills
          ? newMember.skills.split(",").map((skill) => skill.trim())
          : [],
      };
      await api.post("/users", memberData);
      setNewMember({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "member",
        department: "",
        position: "",
        skills: "",
      });
      setShowAddMember(false);
      fetchTeamMembers();
    } catch (error) {
      console.error("Error adding team member:", error);
    }
  };

  const handleUpdateMemberStatus = async (
    _memberId: string,
    _status: string
  ) => {
    try {
      await api.put();
      fetchTeamMembers();
    } catch (error) {
      console.error("Error updating member status:", error);
    }
  };

  const handleDeleteMember = async (_id: string) => {
    if (window.confirm("Are you sure you want to remove this team member?")) {
      try {
        await api.delete();
        fetchTeamMembers();
      } catch (error) {
        console.error("Error deleting team member:", error);
      }
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="w-4 h-4" />;
      case "manager":
        return <Shield className="w-4 h-4" />;
      case "member":
        return <User className="w-4 h-4" />;
      case "viewer":
        return <Clock className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "manager":
        return "bg-blue-100 text-blue-800";
      case "member":
        return "bg-green-100 text-green-800";
      case "viewer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredMembers = (teamMembers || []).filter((member) => {
    const matchesSearch =
      (member.firstName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (member.lastName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (member.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.department || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || member.role === selectedRole;
    const matchesStatus =
      selectedStatus === "all" || member.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeMembers = (teamMembers || []).filter(
    (member) => member.status === "active"
  );
  const inactiveMembers = (teamMembers || []).filter(
    (member) => member.status === "inactive"
  );
  const pendingMembers = (teamMembers || []).filter(
    (member) => member.status === "pending"
  );

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">
            Manage your team members and their roles
          </p>
        </div>
        <Button onClick={() => setShowAddMember(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              className="p-2 border rounded"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              aria-label="Filter by role"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
            <select
              className="p-2 border rounded"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(teamMembers || []).length}
            </div>
            <p className="text-xs text-muted-foreground">All team members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Members
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeMembers.length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inactive Members
            </CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {inactiveMembers.length}
            </div>
            <p className="text-xs text-muted-foreground">Not active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingMembers.length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting activation</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Members</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMembers.map((member) => (
                  <div key={member._id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                          {(member.firstName || "")[0]}
                          {(member.lastName || "")[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {member.firstName || ""} {member.lastName || ""}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {member.position || "No position"}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Badge
                          className={getRoleColor(member.role || "member")}
                        >
                          {getRoleIcon(member.role || "member")}
                        </Badge>
                        <Badge
                          className={getStatusColor(
                            member.status || "inactive"
                          )}
                        >
                          {member.status || "inactive"}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{member.email || "No email"}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{member.phone || "No phone"}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{member.department || "No department"}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>
                          Joined{" "}
                          {member.joinDate
                            ? new Date(member.joinDate).toLocaleDateString()
                            : "Unknown"}
                        </span>
                      </div>
                    </div>

                    {(member.skills || []).length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-1">Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {(member.skills || []).map((skill, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="font-medium">
                          {(member.performance || {}).completedTasks || 0}
                        </span>
                        <span className="text-muted-foreground">
                          /{(member.performance || {}).totalTasks || 0} tasks
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        {member.status === "active" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateMemberStatus(member._id, "inactive")
                            }
                          >
                            Deactivate
                          </Button>
                        )}
                        {member.status === "inactive" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateMemberStatus(member._id, "active")
                            }
                          >
                            Activate
                          </Button>
                        )}
                        {member.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateMemberStatus(member._id, "active")
                            }
                          >
                            Approve
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            /* Handle edit */
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteMember(member._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeMembers.map((member) => (
                  <div
                    key={member._id}
                    className="border rounded-lg p-4 border-green-200 bg-green-50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                          {member.firstName[0]}
                          {member.lastName[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {member.firstName} {member.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {member.position}
                          </p>
                        </div>
                      </div>
                      <Badge className={getRoleColor(member.role)}>
                        {getRoleIcon(member.role)}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{member.department}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="font-medium">
                          {(member.performance || {}).completedTasks || 0}
                        </span>
                        <span className="text-muted-foreground">
                          /{(member.performance || {}).totalTasks || 0} tasks
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleUpdateMemberStatus(member._id, "inactive")
                          }
                        >
                          Deactivate
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            /* Handle edit */
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inactiveMembers.map((member) => (
                  <div
                    key={member._id}
                    className="border rounded-lg p-4 border-red-200 bg-red-50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold">
                          {member.firstName[0]}
                          {member.lastName[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {member.firstName} {member.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {member.position}
                          </p>
                        </div>
                      </div>
                      <Badge className={getRoleColor(member.role)}>
                        {getRoleIcon(member.role)}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{member.department}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="font-medium">
                          {(member.performance || {}).completedTasks || 0}
                        </span>
                        <span className="text-muted-foreground">
                          /{(member.performance || {}).totalTasks || 0} tasks
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleUpdateMemberStatus(member._id, "active")
                          }
                        >
                          Activate
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteMember(member._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingMembers.map((member) => (
                  <div
                    key={member._id}
                    className="border rounded-lg p-4 border-yellow-200 bg-yellow-50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white font-semibold">
                          {member.firstName[0]}
                          {member.lastName[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {member.firstName} {member.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {member.position}
                          </p>
                        </div>
                      </div>
                      <Badge className={getRoleColor(member.role)}>
                        {getRoleIcon(member.role)}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{member.department}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Awaiting approval
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleUpdateMemberStatus(member._id, "active")
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteMember(member._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Team Member</h2>
            <div className="space-y-4">
              <Input
                placeholder="First Name"
                value={newMember.firstName}
                onChange={(e) =>
                  setNewMember({ ...newMember, firstName: e.target.value })
                }
              />
              <Input
                placeholder="Last Name"
                value={newMember.lastName}
                onChange={(e) =>
                  setNewMember({ ...newMember, lastName: e.target.value })
                }
              />
              <Input
                type="email"
                placeholder="Email"
                value={newMember.email}
                onChange={(e) =>
                  setNewMember({ ...newMember, email: e.target.value })
                }
              />
              <Input
                placeholder="Phone"
                value={newMember.phone}
                onChange={(e) =>
                  setNewMember({ ...newMember, phone: e.target.value })
                }
              />
              <select
                className="w-full p-2 border rounded"
                value={newMember.role}
                onChange={(e) =>
                  setNewMember({ ...newMember, role: e.target.value as any })
                }
                aria-label="Select member role"
              >
                <option value="member">Member</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>
              <Input
                placeholder="Department"
                value={newMember.department}
                onChange={(e) =>
                  setNewMember({ ...newMember, department: e.target.value })
                }
              />
              <Input
                placeholder="Position"
                value={newMember.position}
                onChange={(e) =>
                  setNewMember({ ...newMember, position: e.target.value })
                }
              />
              <Input
                placeholder="Skills (comma separated)"
                value={newMember.skills}
                onChange={(e) =>
                  setNewMember({ ...newMember, skills: e.target.value })
                }
              />
              <div className="flex space-x-2">
                <Button onClick={handleAddMember} className="flex-1">
                  Add Member
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddMember(false)}
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
