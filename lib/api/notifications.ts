import { createAdminClient } from "@/lib/supabase/server";

export type NotificationType = 
  | "order" 
  | "message" 
  | "payment" 
  | "system" 
  | "review"
  | "offer"
  | "revision"
  | "completion";

export interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, any>;
}

/**
 * Erstellt eine Benachrichtigung für einen User
 * Verwendet den Admin Client, um RLS zu umgehen
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        link: params.link || null,
        metadata: params.metadata || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating notification:", error);
      return { error };
    }

    return { data };
  } catch (error) {
    console.error("Error creating notification:", error);
    return { error };
  }
}

/**
 * Erstellt Benachrichtigungen für mehrere User
 */
export async function createNotificationsForUsers(
  userIds: string[],
  params: Omit<CreateNotificationParams, "userId">
) {
  try {
    const supabase = createAdminClient();

    const notifications = userIds.map((userId) => ({
      user_id: userId,
      type: params.type,
      title: params.title,
      message: params.message,
      link: params.link || null,
      metadata: params.metadata || null,
    }));

    const { data, error } = await supabase
      .from("notifications")
      .insert(notifications)
      .select();

    if (error) {
      console.error("Error creating notifications:", error);
      return { error };
    }

    return { data };
  } catch (error) {
    console.error("Error creating notifications:", error);
    return { error };
  }
}

