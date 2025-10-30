import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Mail, Star, Edit } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type ProfileFormData = {
  name: string;
  location: string;
  email: string;
  bio: string;
  status: string;
};

const Profile = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Luna Sakura",
    location: "Tokyo, Japan",
    email: "luna@chibicrew.com",
    bio: "✨ Passionate developer who loves creating beautiful and functional web experiences. Always excited to collaborate on new projects!",
    status: "available",
    emoji: "🦊"
  });

  const { register, handleSubmit, reset } = useForm<ProfileFormData>({
    defaultValues: profileData
  });

  const skills = ["React", "TypeScript", "UI/UX Design", "Project Management", "Node.js"];
  const experiences = [
    { role: "Frontend Developer", company: "Tech Startup", period: "2022 - Present" },
    { role: "UI Designer", company: "Creative Agency", period: "2020 - 2022" },
  ];

  const onSubmit = (data: ProfileFormData) => {
    setProfileData({ ...profileData, ...data });
    setIsDialogOpen(false);
    toast.success("Profile updated successfully! ✨");
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <Card className="p-8 mb-6 bg-gradient-to-br from-card to-muted/30 border-2 border-primary/20 shadow-card animate-fade-in">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-5xl shadow-glow animate-float">
              {profileData.emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-4xl font-bold text-foreground">{profileData.name}</h1>
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
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          {...register("name")} 
                          className="border-2 border-border focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input 
                          id="location" 
                          {...register("location")} 
                          className="border-2 border-border focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          {...register("email")} 
                          className="border-2 border-border focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea 
                          id="bio" 
                          {...register("bio")} 
                          className="border-2 border-border focus:border-primary min-h-[100px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select defaultValue={profileData.status} onValueChange={(value) => reset({ ...profileData, status: value })}>
                          <SelectTrigger className="border-2 border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">🌞 Available</SelectItem>
                            <SelectItem value="busy">🌙 Busy</SelectItem>
                            <SelectItem value="looking">🌸 Looking for Team</SelectItem>
                          </SelectContent>
                        </Select>
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
                  <MapPin className="w-4 h-4" />
                  {profileData.location}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {profileData.email}
                </span>
              </div>
              <p className="text-foreground mb-4">
                {profileData.bio}
              </p>
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground border-0 px-4 py-1 rounded-full shadow-soft">
                  {profileData.status === "available" && "🌞 Available"}
                  {profileData.status === "busy" && "🌙 Busy"}
                  {profileData.status === "looking" && "🌸 Looking for Team"}
                </Badge>
                <div className="flex items-center gap-1 text-foreground">
                  <Star className="w-5 h-5 fill-accent text-accent" />
                  <span className="font-bold">4.8</span>
                  <span className="text-muted-foreground">(24 reviews)</span>
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
              <h3 className="text-2xl font-bold text-foreground mb-4">My Skills</h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
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
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="experience" className="mt-6">
            <div className="space-y-4">
              {experiences.map((exp, index) => (
                <Card key={index} className="p-6 shadow-soft hover:shadow-card transition-all duration-300 hover:scale-105">
                  <h4 className="text-xl font-bold text-foreground mb-1">{exp.role}</h4>
                  <p className="text-muted-foreground mb-2">{exp.company}</p>
                  <p className="text-sm text-muted-foreground">{exp.period}</p>
                </Card>
              ))}
            </div>
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
                        className={`w-8 h-8 ${star <= 4 ? 'fill-accent text-accent' : 'text-muted'}`}
                      />
                    ))}
                    <span className="text-3xl font-bold text-foreground ml-2">4.8</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Alex Chen", rating: 5, comment: "Amazing teammate! Very responsive and creative 💖" },
                  { name: "Sarah Kim", rating: 5, comment: "Great communication and delivered high quality work ✨" },
                  { name: "Mike Johnson", rating: 4, comment: "Reliable and professional. Would work with again!" },
                ].map((review, index) => (
                  <div key={index} className="border-b border-border pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-foreground">{review.name}</p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= review.rating ? 'fill-accent text-accent' : 'text-muted'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
