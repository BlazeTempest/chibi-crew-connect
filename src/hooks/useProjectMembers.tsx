import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ProjectMember = {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
};

export const useProjectMembers = (projectId: string | null) => {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) {
      setMembers([]);
      setLoading(false);
      return;
    }

    const fetchMembers = async () => {
      try {
        // First get the project to get team_id
        const { data: project, error: projectError } = await supabase
          .from("projects")
          .select("team_id")
          .eq("id", projectId)
          .single();

        if (projectError) throw projectError;

        if (!project?.team_id) {
          setMembers([]);
          setLoading(false);
          return;
        }

        // Then get team members
        const { data, error } = await supabase
          .from("team_members")
          .select(`
            id,
            user_id,
            role,
            joined_at
          `)
          .eq("team_id", project.team_id);

        if (error) throw error;

        // Fetch profiles separately
        if (data && data.length > 0) {
          const userIds = data.map(m => m.user_id);
          const { data: profilesData, error: profilesError } = await supabase
            .from("profiles")
            .select("id, username, avatar_url")
            .in("id", userIds);

          if (profilesError) throw profilesError;

          const membersWithProfiles = data.map(member => ({
            ...member,
            profiles: profilesData?.find(p => p.id === member.user_id) || {
              username: "Unknown",
              avatar_url: null,
            },
          }));

          setMembers(membersWithProfiles);
        } else {
          setMembers([]);
        }
      } catch (error) {
        console.error("Error fetching project members:", error);
        toast.error("Failed to load project members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [projectId]);

  return { members, loading };
};
