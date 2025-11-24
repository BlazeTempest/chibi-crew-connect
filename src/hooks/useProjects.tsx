import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export type Project = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  owner_id: string;
  team_id: string | null;
  created_at: string;
  updated_at: string;
};

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      try {
        // Fetch projects where user is owner or team member
        const { data: ownedProjects, error: ownedError } = await supabase
          .from("projects")
          .select("*")
          .eq("owner_id", user.id);

        if (ownedError) throw ownedError;

        // Fetch projects where user is a team member
        const { data: teamMemberships, error: teamError } = await supabase
          .from("team_members")
          .select("team_id")
          .eq("user_id", user.id);

        if (teamError) throw teamError;

        const teamIds = teamMemberships?.map(tm => tm.team_id) || [];
        
        let memberProjects: Project[] = [];
        if (teamIds.length > 0) {
          const { data, error } = await supabase
            .from("projects")
            .select("*")
            .in("team_id", teamIds)
            .neq("owner_id", user.id);

          if (error) throw error;
          memberProjects = data || [];
        }

        // Combine and sort by creation date
        const allUserProjects = [...(ownedProjects || []), ...memberProjects]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setProjects(allUserProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("projects-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "projects",
        },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { projects, loading };
};
