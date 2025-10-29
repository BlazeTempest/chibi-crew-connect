import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Sparkles, Users, Briefcase } from "lucide-react";
import mascotImage from "@/assets/chibi-mascot.png";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Header */}
      <header className="mb-12 animate-fade-in">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2 flex items-center gap-3">
          <Sparkles className="w-12 h-12 text-primary animate-sparkle" />
          ChibiCrew
        </h1>
        <p className="text-xl text-muted-foreground">Find your perfect teammates and make magic happen! ✨</p>
      </header>

      {/* Welcome Card */}
      <Card className="mb-8 p-8 bg-gradient-to-br from-card to-muted/30 border-2 border-primary/20 shadow-card hover:shadow-glow transition-all duration-300 animate-fade-in">
        <div className="flex items-center gap-8">
          <img 
            src={mascotImage} 
            alt="ChibiCrew Mascot" 
            className="w-32 h-32 animate-bounce-subtle"
          />
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">✨ You're shining bright today!</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Ready to find amazing teammates and start your next adventure?
            </p>
            <div className="flex gap-4">
              <Button 
                onClick={() => navigate("/team-finder")}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-soft hover:shadow-glow transition-all duration-300 rounded-full px-6"
              >
                <Users className="w-4 h-4 mr-2" />
                Find Teammates
              </Button>
              <Button 
                onClick={() => navigate("/projects")}
                variant="outline"
                className="border-2 border-secondary hover:bg-secondary/10 rounded-full px-6"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:scale-105 transition-transform duration-300 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
              💖
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Projects</p>
              <p className="text-3xl font-bold text-foreground">3</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20 hover:scale-105 transition-transform duration-300 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-2xl">
              🌸
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Team Members</p>
              <p className="text-3xl font-bold text-foreground">12</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:scale-105 transition-transform duration-300 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-2xl">
              ⭐
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your Rating</p>
              <p className="text-3xl font-bold text-foreground">4.8</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 shadow-card">
        <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[
            { text: "🎨 Sarah joined your Design Team project", time: "2 hours ago" },
            { text: "✅ Completed 5 tasks in Web Development", time: "5 hours ago" },
            { text: "💬 New message from Alex in Chat", time: "1 day ago" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <p className="text-foreground">{activity.text}</p>
              <p className="text-sm text-muted-foreground">{activity.time}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
