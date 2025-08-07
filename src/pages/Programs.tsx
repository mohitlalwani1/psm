import { api } from "@/lib/api";
import { mockUsers, mockPrograms } from "@/lib/mockData";

const statusOptions = ["planning", "active", "on-hold", "completed"];

export default function ProgramsPage() {
  const [programList, setProgramList] = useState<any[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any>(null);

  useEffect(() => {
    // Use mock data initially
    setProgramList(mockPrograms as any[]);
    
    // Try to fetch real data
    api
      .get("/programs")
      .then((response) => setProgramList(response as any[]))
      .catch(console.error);
  }, []);

  const handleCreateProgram = async (programData: any) => {
    try {
      const response = await api.post("/programs", programData);
      setProgramList([...programList, response]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create program:", error);
    }
  };

  const handleEditProgram = async (programData: any) => {
    try {
      const response = await api.put(`/programs/${editingProgram.id}`, programData);
      setProgramList(programList.map(p => p.id === editingProgram.id ? response : p));
      setEditingProgram(null);
    } catch (error) {
      console.error("Failed to update program:", error);
    }
  };

  const handleDeleteProgram = async (id: string) => {
    try {
      await api.delete(`/programs/${id}`);
      setProgramList(programList.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete program:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Programs</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Program
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {programList.map((program) => (
          <Card key={program.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{program.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setEditingProgram(program)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteProgram(program.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{program.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={program.status === 'active' ? 'default' : 'secondary'}>
                    {program.status}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Manager:</span>
                  <span>{program.manager}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget:</span>
                  <span>${program.budget?.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ProgramModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProgram}
        title="Create New Program"
        users={mockUsers}
        statusOptions={statusOptions}
      />

      <ProgramModal
        isOpen={!!editingProgram}
        onClose={() => setEditingProgram(null)}
        onSubmit={handleEditProgram}
        title="Edit Program"
        program={editingProgram}
        users={mockUsers}
        statusOptions={statusOptions}
      />
    </div>
  );
}