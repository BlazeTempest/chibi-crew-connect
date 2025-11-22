import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Smile } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { useProfiles } from "@/hooks/useProfiles";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import { useProjectMembers } from "@/hooks/useProjectMembers";

const Chat = () => {
  const [newMessage, setNewMessage] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { user } = useAuth();
  const { projects, loading: projectsLoading } = useProjects();
  
  // Get user's projects where they are members
  const userProjects = projects.filter(p => p.status === "active");
  
  // Get selected project's team_id
  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const { messages, loading: messagesLoading, sendMessage } = useMessages(selectedProject?.team_id);
  const { profiles } = useProfiles();
  
  // Auto-select first project if none selected
  useEffect(() => {
    if (!selectedProjectId && userProjects.length > 0) {
      setSelectedProjectId(userProjects[0].id);
    }
  }, [userProjects, selectedProjectId]);
  
  const loading = projectsLoading || messagesLoading;

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  const handleSend = async () => {
    if (newMessage.trim() && selectedProject?.team_id) {
      await sendMessage(newMessage, selectedProject.team_id);
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-sky/20 via-background to-muted/20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold text-foreground mb-2 flex items-center gap-3">
            <span className="text-5xl">💬</span>
            Project Chat
          </h1>
          <p className="text-xl text-muted-foreground">Chat with your project teammates</p>
          
          {/* Project Selector */}
          {userProjects.length > 0 && (
            <div className="mt-4 max-w-md">
              <Select value={selectedProjectId || ""} onValueChange={setSelectedProjectId}>
                <SelectTrigger className="bg-card border-2">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {userProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Chat Card */}
        <Card className="shadow-card bg-card/95 backdrop-blur-sm animate-fade-in">
          {/* Chat Header */}
          <div className="p-6 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
            {selectedProject ? (
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {profiles.slice(0, 3).map((profile, idx) => (
                    <div key={idx} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center border-2 border-card text-xl">
                      {profile.avatar_url || "👤"}
                    </div>
                  ))}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{selectedProject.name}</h3>
                  <p className="text-sm text-muted-foreground">Project Team Chat</p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-bold text-foreground">Select a Project</h3>
                <p className="text-sm text-muted-foreground">Choose a project to start chatting</p>
              </div>
            )}
          </div>

          {/* Messages */}
          <ScrollArea className="h-[500px] p-6">
            <div className="space-y-4">
              {!selectedProject ? (
                <p className="text-center text-muted-foreground py-8">
                  Select a project to view messages
                </p>
              ) : messages.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No messages yet. Start the conversation!
                </p>
              ) : (
                messages.map((msg, index) => {
                  const sender = profiles.find((p) => p.id === msg.sender_id);
                  const isMe = msg.sender_id === user?.id;
                  
                  return (
                    <div 
                      key={msg.id}
                      className={`flex gap-3 animate-fade-in ${isMe ? 'flex-row-reverse' : ''}`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl flex-shrink-0 ${isMe ? 'animate-float' : ''}`}>
                        {sender?.avatar_url || "👤"}
                      </div>
                      <div className={`flex-1 max-w-[70%] ${isMe ? 'flex flex-col items-end' : ''}`}>
                        {!isMe && (
                          <p className="text-sm font-semibold text-foreground mb-1">
                            {sender?.username || "Unknown"}
                          </p>
                        )}
                        <div className={`p-4 rounded-2xl shadow-soft ${
                          isMe 
                            ? 'bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-tr-none' 
                            : 'bg-card border-2 border-border text-foreground rounded-tl-none'
                        }`}>
                          <p>{msg.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border bg-gradient-to-r from-muted/30 to-background">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon"
                className="rounded-full border-2 hover:bg-accent/10"
              >
                <Smile className="w-5 h-5" />
              </Button>
              <Input 
                placeholder="Type your message... ✨"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="rounded-full border-2"
              />
              <Button 
                onClick={handleSend}
                disabled={!selectedProject}
                className="rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-soft hover:shadow-glow transition-all duration-300"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
