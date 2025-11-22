import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Plus, Users, Calendar, CheckCircle2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { useProjectMembers } from "@/hooks/useProjectMembers";
import { useJoinRequests } from "@/hooks/useJoinRequests";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { format } from "date-fns";

const Projects = () => {
  const { projects, loading } = useProjects();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [joinMessage, setJoinMessage] = useState("");
  const { members } = useProjectMembers(selectedProject);
  const { requests, approveRequest, rejectRequest } = useJoinRequests(selectedProject);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const selectedProjectData = projects.find(p => p.id === selectedProject);
  const isProjectOwner = selectedProjectData?.owner_id === user?.id;
  const hasRequestedToJoin = requests.some(r => r.user_id === user?.id);

  const handleMarkAsFinished = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ status: "completed" })
        .eq("id", projectId);

      if (error) throw error;
      toast.success("Project marked as finished! 🎉");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    }
  };

  const handleJoinRequest = async () => {
    if (!selectedProject || !user) return;

    try {
      const { error } = await supabase
        .from("project_join_requests")
        .insert({
          project_id: selectedProject,
          user_id: user.id,
          message: joinMessage || null,
          status: "pending",
        });

      if (error) throw error;
      toast.success("Join request sent!");
      setJoinMessage("");
    } catch (error) {
      console.error("Error sending join request:", error);
      toast.error("Failed to send join request");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to create a project");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from("projects")
        .insert([
          {
            name: formData.name,
            description: formData.description || null,
            owner_id: user.id,
            status: "active",
          },
        ]);

      if (error) throw error;

      toast.success("Project created successfully! 🎉");
      setFormData({ name: "", description: "" });
      setOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-muted-foreground">Loading projects...</div>
      </div>
    );
  }

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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-soft hover:shadow-glow transition-all duration-300 rounded-full px-6"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Start a new project and invite your team members.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project Name *</Label>
                    <Input
                      id="name"
                      placeholder="My Awesome Project"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="What's this project about?"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Creating..." : "Create Project"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
            {projects.filter(p => p.status === "active").length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-2xl text-muted-foreground mb-4">No active projects yet</p>
                <p className="text-muted-foreground">Create your first project to get started!</p>
              </Card>
            ) : (
              projects.filter(p => p.status === "active").map((project, index) => (
                <Card 
                  key={project.id} 
                  className="p-6 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-2">{project.name}</h3>
                      {project.description && (
                        <p className="text-muted-foreground mb-4">{project.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(project.created_at), "MMM d, yyyy")}</span>
                        </div>
                        {project.team_id && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>Team Project</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-accent to-secondary text-accent-foreground border-0 rounded-full">
                      {project.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    {project.owner_id === user?.id && (
                      <Button
                        variant="outline"
                        className="border-2 border-accent hover:bg-accent/10 rounded-full"
                        onClick={() => handleMarkAsFinished(project.id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark as Finished
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      className="border-2 border-primary hover:bg-primary/10 rounded-full"
                      onClick={() => {
                        setSelectedProject(project.id);
                        setDetailsOpen(true);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {projects.filter(p => p.status === "completed").length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-2xl text-muted-foreground mb-4">No completed projects yet</p>
                <p className="text-muted-foreground">Complete your projects to see them here!</p>
              </Card>
            ) : (
              projects.filter(p => p.status === "completed").map((project, index) => (
                <Card 
                  key={project.id} 
                  className="p-6 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 opacity-80 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-2">{project.name}</h3>
                      {project.description && (
                        <p className="text-muted-foreground mb-4">{project.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(project.created_at), "MMM d, yyyy")}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground border-0 rounded-full">
                      ✅ Completed
                    </Badge>
                  </div>

                  <Button 
                    variant="outline"
                    className="border-2 border-primary hover:bg-primary/10 rounded-full w-full"
                  >
                    View Archive
                  </Button>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Project Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedProjectData?.name}</DialogTitle>
              <DialogDescription>
                {selectedProjectData?.description || "No description provided"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Project Info */}
              <div>
                <h3 className="font-semibold mb-2">Project Information</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Created: {selectedProjectData && format(new Date(selectedProjectData.created_at), "MMMM d, yyyy")}</p>
                  <p>Status: <Badge>{selectedProjectData?.status}</Badge></p>
                </div>
              </div>

              <Separator />

              {/* Team Members */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Team Members ({members.length})
                </h3>
                {members.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No team members yet</p>
                ) : (
                  <div className="space-y-2">
                    {members.map((member) => (
                      <Card key={member.id} className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              {member.profiles.username[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{member.profiles.username}</p>
                              <p className="text-xs text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                          <Badge variant="outline">{member.role}</Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Join Requests (only for project owner) */}
              {isProjectOwner && requests.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      Pending Join Requests ({requests.length})
                    </h3>
                    <div className="space-y-2">
                      {requests.map((request) => (
                        <Card key={request.id} className="p-3">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                                {request.profiles.username[0].toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{request.profiles.username}</p>
                                {request.message && (
                                  <p className="text-xs text-muted-foreground mt-1">{request.message}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => approveRequest(request.id, request.user_id, request.project_id)}
                                className="flex-1"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => rejectRequest(request.id)}
                                className="flex-1"
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Join Request (for non-owners) */}
              {!isProjectOwner && selectedProjectData?.status === "active" && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-3">Request to Join</h3>
                    {hasRequestedToJoin ? (
                      <p className="text-sm text-muted-foreground">
                        You have already requested to join this project. Please wait for the project owner to respond.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Add a message (optional)"
                          value={joinMessage}
                          onChange={(e) => setJoinMessage(e.target.value)}
                          rows={3}
                        />
                        <Button onClick={handleJoinRequest} className="w-full">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Send Join Request
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Projects;
