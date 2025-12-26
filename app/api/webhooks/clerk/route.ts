import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  // Webhook Secret aus Environment
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  const supabase = createAdminClient();

  try {
    switch (eventType) {
      case "user.created": {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;
        
        const email = email_addresses[0]?.email_address;
        const name = [first_name, last_name].filter(Boolean).join(" ") || null;

        if (!email) {
          return new Response("No email address found", { status: 400 });
        }

        // User in Supabase erstellen
        const { data: user, error: userError } = await supabase
          .from("users")
          .insert({
            clerk_id: id,
            email: email,
            name: name,
            image: image_url || null,
            role: "CUSTOMER",
          })
          .select()
          .single();

        if (userError) {
          console.error("Error creating user:", userError);
          return new Response("Error creating user", { status: 500 });
        }

        // Customer Profile erstellen
        const { error: profileError } = await supabase
          .from("customer_profiles")
          .insert({
            user_id: user.id,
          });

        if (profileError) {
          console.error("Error creating customer profile:", profileError);
        }

        console.log(`User created: ${email}`);
        break;
      }

      case "user.updated": {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;
        
        const email = email_addresses[0]?.email_address;
        const name = [first_name, last_name].filter(Boolean).join(" ") || null;

        // User in Supabase updaten
        const { error } = await supabase
          .from("users")
          .update({
            email: email,
            name: name,
            image: image_url || null,
          })
          .eq("clerk_id", id);

        if (error) {
          console.error("Error updating user:", error);
          return new Response("Error updating user", { status: 500 });
        }

        console.log(`User updated: ${email}`);
        break;
      }

      case "user.deleted": {
        const { id } = evt.data;

        if (!id) {
          return new Response("No user ID found", { status: 400 });
        }

        // User aus Supabase löschen (CASCADE löscht auch Profile)
        const { error } = await supabase
          .from("users")
          .delete()
          .eq("clerk_id", id);

        if (error) {
          console.error("Error deleting user:", error);
          return new Response("Error deleting user", { status: 500 });
        }

        console.log(`User deleted: ${id}`);
        break;
      }

      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Error processing webhook", { status: 500 });
  }
}

