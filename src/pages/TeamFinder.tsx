import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, Search, UserPlus } from "lucide-react";
import { toast } from "sonner";

const TeamFinder = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const teammates = [
    {
      id: 1,
      name: "Alex Chen",
      avatar: "🐱",
      skills: ["React", "Node.js", "MongoDB"],
      rating: 4.9,
      availability: "Available",
      matchScore: 95,
    },
    {
      id: 2,
      name: "Sarah Kim",
      avatar: "🐰",
      skills: ["UI/UX", "Figma", "Design Systems"],
      rating: 4.8,
      availability: "Available",
      matchScore: 92,
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar: "🐼",
      skills: ["Python", "Machine Learning", "Data Science"],
      rating: 4.7,
      availability: "Busy",
      matchScore: 88,
    },
    {
      id: 4,
      name: "Emma Wilson",
      avatar: "🦄",
      skills: ["Vue.js", "TypeScript", "Testing"],
      rating: 5.0,
      availability: "Available",
      matchScore: 90,
    },
  ];

  const handleInvite = (name: string) => {
    toast.success(`💖 Invitation sent to ${name}!`, {
      description: "They'll be notified about your project",
    });
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold text-foreground mb-2 flex items-center gap-3">
            <span className="text-5xl animate-sparkle">💫</span>
            Find Your Perfect Teammate
          </h1>
          <p className="text-xl text-muted-foreground">Discover amazing people to collaborate with</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8 shadow-card animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full border-2"
              />
            </div>
            <Select>
              <SelectTrigger className="rounded-full border-2">
                <SelectValue placeholder="Skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="rounded-full border-2">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="rounded-full border-2">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4+ Stars</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teammates.map((teammate, index) => (
            <Card 
              key={teammate.id}
              className={`p-6 shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105 animate-fade-in border-2 ${
                teammate.matchScore >= 90 
                  ? 'border-primary/50 bg-gradient-to-br from-primary/5 to-card' 
                  : 'border-border'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl shadow-soft animate-float">
                  {teammate.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-foreground">{teammate.name}</h3>
                    {teammate.matchScore >= 90 && (
                      <Badge className="bg-gradient-to-r from-accent to-secondary text-accent-foreground border-0 rounded-full animate-pulse">
                        {teammate.matchScore}% Match
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${star <= teammate.rating ? 'fill-accent text-accent' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-foreground">{teammate.rating}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {teammate.skills.map((skill, idx) => (
                      <Badge 
                        key={idx}
                        variant="outline"
                        className="rounded-full border-2 bg-gradient-to-r hover:scale-105 transition-transform"
                        style={{
                          borderColor: idx % 3 === 0 ? 'hsl(333 100% 92%)' : idx % 3 === 1 ? 'hsl(231 97% 89%)' : 'hsl(154 75% 81%)',
                          backgroundColor: idx % 3 === 0 ? 'hsl(333 100% 97%)' : idx % 3 === 1 ? 'hsl(231 97% 97%)' : 'hsl(154 75% 95%)',
                        }}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge 
                      className={`rounded-full border-0 ${
                        teammate.availability === "Available" 
                          ? 'bg-gradient-to-r from-accent to-accent/80 text-accent-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {teammate.availability === "Available" ? "🌞" : "🌙"} {teammate.availability}
                    </Badge>
                    <Button 
                      onClick={() => handleInvite(teammate.name)}
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground rounded-full shadow-soft hover:shadow-glow transition-all duration-300"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Invite
                    </Button>
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

export default TeamFinder;
