import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Calendar, DollarSign } from "lucide-react";
import { toast } from "sonner";

const Projects = () => {
  const projects = [
    {
      id: 1,
      name: "🎨 Design System Revamp",
      progress: 65,
      team: ["🦊", "🐱", "🐰"],
      deadline: "2024-02-15",
      budget: "$5,000",
      roles: ["UI Designer", "Frontend Dev"],
      status: "active",
    },
    {
      id: 2,
      name: "🚀 Mobile App Launch",
      progress: 40,
      team: ["🐼", "🦄"],
      deadline: "2024-03-01",
      budget: "$8,000",
      roles: ["iOS Dev", "Backend Dev"],
      status: "active",
    },
    {
      id: 3,
      name: "📊 Analytics Dashboard",
      progress: 100,
      team: ["🦊", "🐱", "🐼", "🦄"],
      deadline: "2024-01-20",
      budget: "$3,500",
      roles: ["Data Analyst", "Frontend Dev"],
      status: "completed",
    },
  ];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-5xl font-bold text-foreground mb-2 flex items-center gap-3">
              <span className="text-5xl">💼</span>
              My Projects
            </h1>
            <p className="text-xl text-muted-foreground">Manage your amazing collaborations</p>
          </div>
          <Button 
            onClick={() => toast.success("🌸 Project creation coming soon!")}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-soft hover:shadow-glow transition-all duration-300 rounded-full px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-2 bg-card border border-border rounded-2xl p-1 shadow-soft mb-8">
            <TabsTrigger value="active" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground">
              Active Projects ✨
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground">
              Completed Projects 🎉
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {projects.filter(p => p.status === "active").map((project, index) => (
              <Card 
                key={project.id} 
                className="p-6 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{project.name}</h3>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{project.deadline}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        <span>{project.budget}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <div className="flex -space-x-2">
                          {project.team.map((avatar, idx) => (
                            <div key={idx} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center border-2 border-card">
                              {avatar}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-accent to-secondary text-accent-foreground border-0 rounded-full">
                    In Progress
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Progress</span>
                    <span className="text-sm font-bold text-primary">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-3 bg-muted" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {project.roles.map((role, idx) => (
                      <Badge key={idx} variant="outline" className="rounded-full border-2 border-secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    variant="outline"
                    className="border-2 border-primary hover:bg-primary/10 rounded-full"
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {projects.filter(p => p.status === "completed").map((project, index) => (
              <Card 
                key={project.id} 
                className="p-6 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 opacity-80 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{project.name}</h3>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{project.deadline}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <div className="flex -space-x-2">
                          {project.team.map((avatar, idx) => (
                            <div key={idx} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center border-2 border-card">
                              {avatar}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground border-0 rounded-full">
                    ✅ Completed
                  </Badge>
                </div>

                <div className="mb-4">
                  <Progress value={100} className="h-3 bg-muted" />
                </div>

                <Button 
                  variant="outline"
                  className="border-2 border-primary hover:bg-primary/10 rounded-full w-full"
                >
                  View Archive
                </Button>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Projects;
