import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export type Rating = {
  id: string;
  rater_id: string;
  rated_user_id: string;
  rating: number;
  comment: string | null;
  project_id: string | null;
  created_at: string;
};

export const useRatings = () => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchRatings = async () => {
      try {
        const { data, error } = await supabase
          .from("ratings")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setRatings(data || []);
      } catch (error) {
        console.error("Error fetching ratings:", error);
        toast.error("Failed to load ratings");
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("ratings-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ratings",
        },
        () => {
          fetchRatings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const submitRating = async (
    ratedUserId: string,
    rating: number,
    comment: string,
    projectId?: string
  ) => {
    if (!user) {
      toast.error("You must be logged in to rate");
      return;
    }

    try {
      const { error } = await supabase.from("ratings").insert({
        rater_id: user.id,
        rated_user_id: ratedUserId,
        rating,
        comment: comment || null,
        project_id: projectId || null,
      });

      if (error) throw error;
      toast.success("⭐ Rating submitted successfully!");
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating");
    }
  };

  return { ratings, loading, submitRating };
};
