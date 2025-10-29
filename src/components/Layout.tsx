import { Home, Users, Briefcase, ListTodo, MessageCircle, Star, Search } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const Layout = () => {
  const navItems = [
    { title: "Dashboard", url: "/", icon: Home },
    { title: "Team Finder", url: "/team-finder", icon: Search },
    { title: "Projects", url: "/projects", icon: Briefcase },
    { title: "Tasks", url: "/tasks", icon: ListTodo },
    { title: "Chat", url: "/chat", icon: MessageCircle },
    { title: "Ratings", url: "/ratings", icon: Star },
    { title: "Profile", url: "/profile", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-20 bg-card border-r border-border flex flex-col items-center py-6 gap-6 shadow-card z-50">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl animate-float">
          ✨
        </div>
        
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === "/"}
              className={({ isActive }) =>
                `w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                  isActive
                    ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-glow"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-20 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
