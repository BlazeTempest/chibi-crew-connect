import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Smile } from "lucide-react";

const Chat = () => {
  const [messages] = useState([
    { id: 1, sender: "Alex Chen", avatar: "🐱", message: "Hey! How's the design progress going?", time: "10:30 AM", isMe: false },
    { id: 2, sender: "Me", avatar: "🦊", message: "Going great! Just finished the mockups 🎨", time: "10:32 AM", isMe: true },
    { id: 3, sender: "Alex Chen", avatar: "🐱", message: "Awesome! Can't wait to see them!", time: "10:33 AM", isMe: false },
    { id: 4, sender: "Sarah Kim", avatar: "🐰", message: "I've reviewed the code, looks amazing! ✨", time: "10:45 AM", isMe: false },
    { id: 5, sender: "Me", avatar: "🦊", message: "Thanks Sarah! Your feedback was really helpful 💖", time: "10:46 AM", isMe: true },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message
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
            Team Chat
          </h1>
          <p className="text-xl text-muted-foreground">Stay connected with your teammates</p>
        </div>

        {/* Chat Card */}
        <Card className="shadow-card bg-card/95 backdrop-blur-sm animate-fade-in">
          {/* Chat Header */}
          <div className="p-6 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {["🐱", "🐰", "🐼"].map((avatar, idx) => (
                  <div key={idx} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center border-2 border-card text-xl">
                    {avatar}
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-bold text-foreground">Design System Team</h3>
                <p className="text-sm text-muted-foreground">3 members online</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="h-[500px] p-6">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div 
                  key={msg.id}
                  className={`flex gap-3 animate-fade-in ${msg.isMe ? 'flex-row-reverse' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl flex-shrink-0 ${msg.isMe ? 'animate-float' : ''}`}>
                    {msg.avatar}
                  </div>
                  <div className={`flex-1 max-w-[70%] ${msg.isMe ? 'flex flex-col items-end' : ''}`}>
                    {!msg.isMe && <p className="text-sm font-semibold text-foreground mb-1">{msg.sender}</p>}
                    <div className={`p-4 rounded-2xl shadow-soft ${
                      msg.isMe 
                        ? 'bg-gradient-to-br from-primary to-secondary text-primary-foreground rounded-tr-none' 
                        : 'bg-card border-2 border-border text-foreground rounded-tl-none'
                    }`}>
                      <p>{msg.message}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
                  </div>
                </div>
              ))}
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
