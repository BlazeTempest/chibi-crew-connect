import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export type Message = {
  id: string;
  content: string;
  sender_id: string;
  team_id: string | null;
  created_at: string;
};

export const useMessages = (teamId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        let query = supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: true });

        if (teamId) {
          query = query.eq("team_id", teamId);
        }

        const { data, error } = await query;

        if (error) throw error;
        setMessages(data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("messages-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, teamId]);

  const sendMessage = async (content: string, teamId?: string) => {
    if (!user) {
      toast.error("You must be logged in to send messages");
      return;
    }

    if (!content.trim()) return;

    try {
      const { error } = await supabase.from("messages").insert({
        content,
        sender_id: user.id,
        team_id: teamId || null,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  return { messages, loading, sendMessage };
};
