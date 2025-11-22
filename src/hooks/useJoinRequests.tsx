import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export type JoinRequest = {
  id: string;
  project_id: string;
  user_id: string;
  status: string;
  message: string | null;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
};

export const useJoinRequests = (projectId: string | null) => {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!projectId || !user) {
      setRequests([]);
      setLoading(false);
      return;
    }

    const fetchRequests = async () => {
      try {
        const { data, error } = await supabase
          .from("project_join_requests")
          .select(`
            id,
            project_id,
            user_id,
            status,
            message,
            created_at
          `)
          .eq("project_id", projectId)
          .eq("status", "pending")
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Fetch profiles separately
        if (data && data.length > 0) {
          const userIds = data.map(r => r.user_id);
          const { data: profilesData, error: profilesError } = await supabase
            .from("profiles")
            .select("id, username, avatar_url")
            .in("id", userIds);

          if (profilesError) throw profilesError;

          const requestsWithProfiles = data.map(request => ({
            ...request,
            profiles: profilesData?.find(p => p.id === request.user_id) || {
              username: "Unknown",
              avatar_url: null,
            },
          }));

          setRequests(requestsWithProfiles);
        } else {
          setRequests([]);
        }
      } catch (error) {
        console.error("Error fetching join requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("join-requests-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "project_join_requests",
          filter: `project_id=eq.${projectId}`,
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, user]);

  const approveRequest = async (requestId: string, userId: string, projectId: string) => {
    try {
      // First, get the project's team_id
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("team_id")
        .eq("id", projectId)
        .single();

      if (projectError) throw projectError;

      if (!project.team_id) {
        toast.error("This project doesn't have a team");
        return;
      }

      // Add user to team_members
      const { error: memberError } = await supabase
        .from("team_members")
        .insert({
          team_id: project.team_id,
          user_id: userId,
          role: "member",
        });

      if (memberError) throw memberError;

      // Update request status
      const { error: updateError } = await supabase
        .from("project_join_requests")
        .update({ status: "approved" })
        .eq("id", requestId);

      if (updateError) throw updateError;

      toast.success("Request approved successfully!");
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("Failed to approve request");
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("project_join_requests")
        .update({ status: "rejected" })
        .eq("id", requestId);

      if (error) throw error;
      toast.success("Request rejected");
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request");
    }
  };

  return { requests, loading, approveRequest, rejectRequest };
};
