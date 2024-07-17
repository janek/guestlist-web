import { Bot } from "grammy";
import { createClient } from "@/utils/supabase/client";

const teamInfo = {
  Janek: "224704481",
  // Jan: "224704481",
  //   Julie: "5676203249",
  //   Johannes: "27087952",
};

const bot = new Bot("6753060735:AAG5KDtydqTNP4R5Iyln0NsGX4efXk7Vi1U");
const supabase = createClient();

export async function sendOutStaffLinks(
  limit_free: number,
  limit_half: number,
  limit_skip: number,
  eventId: string,
  baseUrl: string
) {
  for (const [name, id] of Object.entries(teamInfo)) {
    
    const { data, error } = await supabase
      .from("links")
      .insert([
        {
          organisation: `${name} (Turbulence)`,
          event_id: eventId,
          limit_free: limit_free || 0,
          limit_half: limit_half || 0,
          limit_skip: limit_skip || 0,
        },
      ])
      .select();
    if (error) {
      throw error;
    }
    if (data) {
        const slug = data[0].slug;
        const url = `${baseUrl}/${slug}`;
        bot.api.sendMessage(id, `Hi ${name}! Your guestlist link is <a href="${url}">${url}</a>`, { parse_mode: "HTML" }).catch(console.error);
    }
  }
}