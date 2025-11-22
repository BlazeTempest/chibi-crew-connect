import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CheckCircle2, Plus, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { useProfiles } from "@/hooks/useProfiles";
import { useProjectMembers } from "@/hooks/useProjectMembers";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Tasks = () => {
  const { tasks, loading, toggleTask } = useTasks();
  const { projects } = useProjects();
  const { profiles } = useProfiles();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState<Date>();
  const { members } = useProjectMembers(selectedProject || null);

  // Filter assignees: if project selected, show only project members; otherwise show all profiles
  const availableAssignees = selectedProject && selectedProject !== "none" 
    ? members.map(m => ({ id: m.user_id, username: m.profiles.username }))
    : profiles;

  const handleCreateTask = async () => {
    if (!user || !title.trim()) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      const { error } = await supabase.from("tasks").insert({
        title: title.trim(),
        description: description.trim() || null,
        project_id: selectedProject || null,
        assigned_to: selectedAssignee || null,
        priority,
        due_date: dueDate?.toISOString() || null,
        created_by: user.id,
        status: "todo",
      });

      if (error) throw error;

      toast.success("Task created successfully!");
      setOpen(false);
      setTitle("");
      setDescription("");
      setSelectedProject("");
      setSelectedAssignee("");
      setPriority("medium");
      setDueDate(undefined);
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const completionPercentage = tasks.length > 0 
    ? Math.round((completedTasks / tasks.length) * 100) 
    : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "from-destructive/20 to-destructive/10 border-destructive/30";
      case "medium": return "from-secondary/20 to-secondary/10 border-secondary/30";
      case "low": return "from-accent/20 to-accent/10 border-accent/30";
      default: return "from-muted to-muted/50";
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold text-foreground mb-2 flex items-center gap-3">
              <span className="text-5xl">✅</span>
              My Tasks
            </h1>
            <p className="text-xl text-muted-foreground">Stay organized and productive!</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full shadow-lg">
                <Plus className="w-5 h-5 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter task description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Project</Label>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Project</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Assign To</Label>
                  <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                    <SelectTrigger>
                      <SelectValue placeholder={
                        selectedProject && selectedProject !== "none"
                          ? "Select project member (optional)"
                          : "Select team member (optional)"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Unassigned</SelectItem>
                      {availableAssignees.length === 0 && selectedProject && selectedProject !== "none" ? (
                        <SelectItem value="no-members" disabled>
                          No members in this project yet
                        </SelectItem>
                      ) : (
                        availableAssignees.map((assignee) => (
                          <SelectItem key={assignee.id} value={assignee.id}>
                            {assignee.username}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🌟 Low</SelectItem>
                      <SelectItem value="medium">⚡ Medium</SelectItem>
                      <SelectItem value="high">🔥 High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : "Pick a date (optional)"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <Button onClick={handleCreateTask} className="w-full" size="lg">
                  Create Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Progress Card */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 shadow-card animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-1">Overall Progress</h3>
              <p className="text-muted-foreground">{completedTasks} of {tasks.length} tasks completed</p>
            </div>
            <div className="text-5xl animate-bounce-subtle">
              {completionPercentage === 100 ? "🎉" : "💪"}
            </div>
          </div>
          <Progress value={completionPercentage} className="h-4 bg-muted" />
          <p className="text-right text-sm font-bold text-primary mt-2">{completionPercentage}%</p>
        </Card>

        {/* Filters */}
        <Card className="p-4 mb-6 shadow-soft animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select>
              <SelectTrigger className="rounded-full border-2">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="design">Design System Revamp</SelectItem>
                <SelectItem value="mobile">Mobile App Launch</SelectItem>
                <SelectItem value="analytics">Analytics Dashboard</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="rounded-full border-2">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <Card 
              key={task.id}
              className={`p-6 shadow-soft hover:shadow-card transition-all duration-300 hover:scale-105 animate-fade-in bg-gradient-to-br border-2 ${
                task.status === 'completed' ? 'opacity-60' : ''
              } ${getPriorityColor(task.priority)}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <Checkbox 
                  checked={task.status === 'completed'}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="mt-1 w-6 h-6 rounded-full border-2 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-secondary"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`text-lg font-semibold ${task.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`rounded-full border-2 ${
                          task.priority === 'high' ? 'border-destructive text-destructive' :
                          task.priority === 'medium' ? 'border-secondary text-secondary-foreground' :
                          'border-accent text-accent-foreground'
                        }`}
                      >
                        {task.priority === 'high' ? '🔥' : task.priority === 'medium' ? '⚡' : '🌟'} {task.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground">{task.description || 'No description'}</p>
                    <div className="flex items-center gap-2">
                      {task.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-accent" />}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
