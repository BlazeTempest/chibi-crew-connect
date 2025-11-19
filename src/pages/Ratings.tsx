import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useProfiles } from "@/hooks/useProfiles";
import { useRatings } from "@/hooks/useRatings";
import { useAuth } from "@/hooks/useAuth";

const Ratings = () => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  const { profiles, loading } = useProfiles();
  const { ratings, submitRating } = useRatings();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading ratings...</p>
      </div>
    );
  }

  const handleSubmitRating = async (userId: string, username: string) => {
    if (selectedRating === 0) {
      toast.error("Please select a rating!");
      return;
    }
    await submitRating(userId, selectedRating, comment);
    setSelectedRating(0);
    setComment("");
    setSelectedUserId(null);
  };

  const getAverageRating = (userId: string) => {
    const userRatings = ratings.filter((r) => r.rated_user_id === userId);
    if (userRatings.length === 0) return 0;
    return userRatings.reduce((acc, r) => acc + r.rating, 0) / userRatings.length;
  };

  const getReviewCount = (userId: string) => {
    return ratings.filter((r) => r.rated_user_id === userId).length;
  };

  const myReceivedRatings = ratings.filter((r) => r.rated_user_id === user?.id);
  const filteredProfiles = profiles.filter((p) => p.id !== user?.id);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold text-foreground mb-2 flex items-center gap-3">
            <span className="text-5xl">⭐</span>
            Teammate Ratings
          </h1>
          <p className="text-xl text-muted-foreground">Share your experience and build trust</p>
        </div>

        {/* Rating Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teammates.map((teammate, index) => (
            <Card 
              key={teammate.id}
              className="p-6 shadow-card hover:shadow-glow transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl shadow-soft animate-float">
                  {teammate.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{teammate.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-5 h-5 ${star <= teammate.rating ? 'fill-accent text-accent' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-bold text-foreground">{teammate.rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{teammate.reviews} reviews</p>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground rounded-full shadow-soft hover:shadow-glow transition-all duration-300"
                  >
                    Rate Teammate
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-2 border-primary/20 shadow-glow rounded-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                      <span className="text-3xl">{teammate.avatar}</span>
                      Rate {teammate.name}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    {/* Star Rating */}
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setSelectedRating(star)}
                          className="transition-transform hover:scale-125"
                        >
                          <Star 
                            className={`w-10 h-10 ${star <= selectedRating ? 'fill-accent text-accent animate-sparkle' : 'text-muted'}`}
                          />
                        </button>
                      ))}
                    </div>

                    {/* Comment */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Share your experience (optional)
                      </label>
                      <Textarea 
                        placeholder="What was it like working with them? ✨"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px] rounded-2xl border-2"
                      />
                    </div>

                    <Button 
                      onClick={() => handleSubmitRating(teammate.name)}
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground rounded-full shadow-soft hover:shadow-glow transition-all duration-300"
                    >
                      Submit Rating
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </Card>
          ))}
        </div>

        {/* My Reviews Section */}
        <Card className="p-6 mt-8 shadow-card animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="text-3xl">💖</span>
            Reviews I've Received
          </h2>
          <div className="space-y-4">
            {[
              { name: "Emma Wilson", avatar: "🦄", rating: 5, comment: "Absolutely amazing to work with! Very creative and responsive 💖", time: "2 days ago" },
              { name: "Mike Johnson", avatar: "🐼", rating: 5, comment: "Great communication and delivered high quality work! ✨", time: "1 week ago" },
              { name: "Sarah Kim", avatar: "🐰", rating: 4, comment: "Professional and reliable teammate!", time: "2 weeks ago" },
            ].map((review, index) => (
              <div 
                key={index}
                className="p-4 rounded-2xl bg-gradient-to-br from-muted/50 to-background border-2 border-border hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl">
                    {review.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{review.name}</h4>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= review.rating ? 'fill-accent text-accent' : 'text-muted'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-1">{review.comment}</p>
                    <p className="text-xs text-muted-foreground">{review.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Ratings;
