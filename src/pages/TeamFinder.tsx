import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, Search, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useProfiles } from "@/hooks/useProfiles";
import { useRatings } from "@/hooks/useRatings";
import { useAuth } from "@/hooks/useAuth";

const TeamFinder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { profiles, loading } = useProfiles();
  const { ratings } = useRatings();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading teammates...</p>
      </div>
    );
  }

  const handleInvite = (name: string) => {
    toast.success(`💖 Invitation sent to ${name}!`, {
      description: "They'll be notified about your project",
    });
  };

  const getAverageRating = (userId: string) => {
    const userRatings = ratings.filter((r) => r.rated_user_id === userId);
    if (userRatings.length === 0) return 0;
    return userRatings.reduce((acc, r) => acc + r.rating, 0) / userRatings.length;
  };

  const filteredProfiles = profiles.filter((profile) => {
    if (profile.id === user?.id) return false; // Don't show current user
    if (searchQuery) {
      return (
        profile.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

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
          {filteredProfiles.map((profile, index) => {
            const rating = getAverageRating(profile.id);
            const reviewCount = ratings.filter((r) => r.rated_user_id === profile.id).length;
            return (
            <Card 
              key={profile.id}
              className="p-6 shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105 animate-fade-in border-2 border-border"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl shadow-soft animate-float">
                  {profile.avatar_url || "👤"}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2">{profile.username}</h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${star <= rating ? 'fill-accent text-accent' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {rating > 0 ? rating.toFixed(1) : "N/A"}
                    </span>
                  </div>

                  {profile.bio && (
                    <p className="text-sm text-muted-foreground mb-3">{profile.bio}</p>
                  )}

                  <Button 
                    onClick={() => handleInvite(profile.username)}
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground rounded-full shadow-soft hover:shadow-glow transition-all duration-300"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Invite
                    </Button>
                </div>
              </div>
            </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeamFinder;
