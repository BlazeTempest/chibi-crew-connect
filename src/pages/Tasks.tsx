import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const Tasks = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Design landing page mockups", project: "Design System Revamp", assignee: "🦊", completed: false, priority: "high" },
    { id: 2, title: "Implement authentication flow", project: "Mobile App Launch", assignee: "🐱", completed: false, priority: "high" },
    { id: 3, title: "Write API documentation", project: "Analytics Dashboard", assignee: "🐼", completed: true, priority: "medium" },
    { id: 4, title: "Create user testing scenarios", project: "Design System Revamp", assignee: "🐰", completed: false, priority: "medium" },
    { id: 5, title: "Optimize database queries", project: "Mobile App Launch", assignee: "🦄", completed: true, priority: "low" },
  ]);

  const completedTasks = tasks.filter(t => t.completed).length;
  const completionPercentage = Math.round((completedTasks / tasks.length) * 100);

  const handleTaskToggle = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      toast.success("✨ Task completed! Great work!");
    }
  };

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
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold text-foreground mb-2 flex items-center gap-3">
            <span className="text-5xl">✅</span>
            My Tasks
          </h1>
          <p className="text-xl text-muted-foreground">Stay organized and productive!</p>
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
                task.completed ? 'opacity-60' : ''
              } ${getPriorityColor(task.priority)}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <Checkbox 
                  checked={task.completed}
                  onCheckedChange={() => handleTaskToggle(task.id)}
                  className="mt-1 w-6 h-6 rounded-full border-2 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-secondary"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
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
                    <p className="text-sm text-muted-foreground">{task.project}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{task.assignee}</span>
                      {task.completed && <CheckCircle2 className="w-5 h-5 text-accent" />}
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
