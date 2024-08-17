import { Bot } from "grammy";
import { createClient } from "@/utils/supabase/client";

const adminId = "224704481"

const teamInfo = {
  Janek: "224704481",
  // Pajka: "7105079392",
  // Saskia: "298058903",
  // Raulito: "201575900",
  // Fabi: "296141797",
  // Johannes: "27087952",
  // Arun: "671842270",
  // Laura: "689093771",
  // Tutti: "813457031",
  // Manu: "968563962",
  // // AlexBr: (hiddden user)
  // Jule: "6018809085",
  // Fraenze: "648270588",
  // Caspar: "1152830468",
  // Julie: "5676203249",
  // Shelly: "503953582",
  // Ady: "425952926",
};

// TODO: use env var, use the live bot
const bot = new Bot("7141745995:AAGEa_CKxwLgyo96Nw3I1xcPot0uQT29F3Y");
const supabase = createClient();

export async function sendOutStaffLinks(
  limit_free: number,
  limit_half: number,
  limit_skip: number,
  baseUrl: string,
  event: GuestlistEvent
) {
  console.log("Received event:", event)  // Add this line for debugging
  const undeliveredLinks = [];

  for (const [name, id] of Object.entries(teamInfo)) {
    
    const { data, error } = await supabase
      .from("links")
      .insert([
        {
          organisation: `${name} (Turbulence)`,
          event_id: event.id,
          limit_free: limit_free || 0,
          limit_half: limit_half || 0,
          limit_skip: limit_skip || 0,
          telegram_user_id: id,
        },
      ])
      .select();

    // TODO: error 400 will happen a lot at because people won't be authorized - needs to be handled in the UI
    if (error) {
      throw error;
    }
    if (data) {
        const slug = data[0].slug;
        console.log("Data \n", data)
        const url = `${baseUrl}/${slug}`;
        try {
          if (!event || !event.name || !event.date) {
            throw new Error("Event details are missing");
          }
          await bot.api.sendMessage(id, `Hi ${name}! Your guestlist link for <i>${event.name}</i> is:\n\n<a href="${url}">${url}</a>\n<i>(${limit_free} free, ${limit_half} half, ${limit_skip} skip)</i>.\n\n You can write me the name(s), for example "Suley Blum, free"`, { parse_mode: "HTML" });
        } catch (error) {
          console.error(`Failed to send message to ${name}:`, error);
          undeliveredLinks.push({ 
            name, 
            id, 
            error: error instanceof Error ? error.message : String(error) 
          });
        }
    }
  }

  if (undeliveredLinks.length > 0) {
    const undeliveredMessage = undeliveredLinks.map(({ name, id, error }) => `${name} (ID: ${id}) - Error: ${error}`).join('\n');
    await bot.api.sendMessage(adminId, `These staff links could not be delivered:\n${undeliveredMessage}`);
  }
}
