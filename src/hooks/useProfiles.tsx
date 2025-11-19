import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Profile = {
  id: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setProfiles(data || []);
      } catch (error) {
        console.error("Error fetching profiles:", error);
        toast.error("Failed to load profiles");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("profiles-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        () => {
          fetchProfiles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { profiles, loading };
};
