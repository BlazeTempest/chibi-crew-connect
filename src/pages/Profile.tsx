import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Mail, Star, Edit, X, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { useRatings } from "@/hooks/useRatings";

type ProfileFormData = {
  username: string;
  bio: string;
};

const Profile = () => {
  const { user } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const { ratings } = useRatings();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSkillsDialogOpen, setIsSkillsDialogOpen] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const { register, handleSubmit, reset } = useForm<ProfileFormData>({
    defaultValues: {
      username: profile?.username || "",
      bio: profile?.bio || ""
    }
  });

  // Calculate average rating for the user
  const userRatings = ratings.filter(r => r.rated_user_id === user?.id);
  const avgRating = userRatings.length > 0
    ? userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length
    : 0;

  const onSubmit = async (data: ProfileFormData) => {
    await updateProfile(data);
    setIsDialogOpen(false);
    reset(data);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      toast.success("Skill added!");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
    toast.success("Skill removed!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  if (!profile || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-muted-foreground">Please log in to view your profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <Card className="p-8 mb-6 bg-gradient-to-br from-card to-muted/30 border-2 border-primary/20 shadow-card animate-fade-in">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-5xl shadow-glow animate-float">
              {profile.avatar_url || "👤"}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-4xl font-bold text-foreground">{profile.username}</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-2 border-primary hover:bg-primary/10 rounded-full"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] bg-card border-2 border-primary/20">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-foreground">Edit Profile ✨</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input 
                          id="username" 
                          {...register("username")} 
                          className="border-2 border-border focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          {...register("bio")} 
                          placeholder="Tell us about yourself..."
                          className="border-2 border-border focus:border-primary min-h-[100px]"
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsDialogOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </span>
              </div>
              <p className="text-foreground mb-4">
                {profile.bio || "No bio yet. Click Edit Profile to add one!"}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-foreground">
                  <Star className="w-5 h-5 fill-accent text-accent" />
                  <span className="font-bold">{avgRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({userRatings.length} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="skills" className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-3 bg-card border border-border rounded-2xl p-1 shadow-soft">
            <TabsTrigger value="skills" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground">
              Skills 🎨
            </TabsTrigger>
            <TabsTrigger value="experience" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground">
              Experience 💼
            </TabsTrigger>
            <TabsTrigger value="ratings" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground">
              Ratings ⭐
            </TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="mt-6">
            <Card className="p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-foreground">My Skills</h3>
                <Dialog open={isSkillsDialogOpen} onOpenChange={setIsSkillsDialogOpen}>
                  <Button
                    onClick={() => setIsSkillsDialogOpen(true)}
                    variant="outline"
                    size="sm"
                    className="border-2 border-primary hover:bg-primary/10 rounded-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Manage Skills
                  </Button>
                  <DialogContent className="sm:max-w-[500px] bg-card border-2 border-primary/20">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-foreground">Manage Skills ✨</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="flex gap-2">
                        <Input
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                          placeholder="Add a skill..."
                          className="border-2 border-border focus:border-primary"
                        />
                        <Button onClick={handleAddSkill} className="bg-gradient-to-r from-primary to-secondary">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <Badge
                            key={index}
                            className="px-3 py-2 text-sm rounded-full border-2 flex items-center gap-2"
                            style={{
                              borderColor: index % 3 === 0 ? 'hsl(333 100% 92%)' : index % 3 === 1 ? 'hsl(231 97% 89%)' : 'hsl(154 75% 81%)',
                              backgroundColor: index % 3 === 0 ? 'hsl(333 100% 97%)' : index % 3 === 1 ? 'hsl(231 97% 97%)' : 'hsl(154 75% 95%)',
                              color: 'hsl(0 0% 23%)'
                            }}
                          >
                            {skill}
                            <button
                              onClick={() => handleRemoveSkill(skill)}
                              className="hover:opacity-70"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex flex-wrap gap-3">
                {skills.length === 0 ? (
                  <p className="text-muted-foreground">No skills added yet. Click "Manage Skills" to add some!</p>
                ) : (
                  skills.map((skill, index) => (
                    <Badge 
                      key={index}
                      className="px-4 py-2 text-base rounded-full border-2 bg-gradient-to-r hover:scale-105 transition-transform"
                      style={{
                        borderColor: index % 3 === 0 ? 'hsl(333 100% 92%)' : index % 3 === 1 ? 'hsl(231 97% 89%)' : 'hsl(154 75% 81%)',
                        backgroundColor: index % 3 === 0 ? 'hsl(333 100% 97%)' : index % 3 === 1 ? 'hsl(231 97% 97%)' : 'hsl(154 75% 95%)',
                        color: 'hsl(0 0% 23%)'
                      }}
                    >
                      {skill}
                    </Badge>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="mt-6">
            <Card className="p-6 shadow-card">
              <p className="text-muted-foreground text-center">Experience section coming soon!</p>
            </Card>
          </TabsContent>

          <TabsContent value="ratings" className="mt-6">
            <Card className="p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Overall Rating</h3>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-8 h-8 ${star <= Math.round(avgRating) ? 'fill-accent text-accent' : 'text-muted'}`}
                      />
                    ))}
                    <span className="text-3xl font-bold text-foreground ml-2">{avgRating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {userRatings.length === 0 ? (
                  <p className="text-muted-foreground text-center">No ratings yet</p>
                ) : (
                  userRatings.map((rating) => (
                    <div key={rating.id} className="border-b border-border pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-foreground">Rating</p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-4 h-4 ${star <= rating.rating ? 'fill-accent text-accent' : 'text-muted'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground">{rating.comment || "No comment provided"}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
