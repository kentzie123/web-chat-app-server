import supabase from "../config/db.js";

export const addMessage = async (message) => {
  return await supabase.from("messages").insert([message]).select();
};

export const getMessagesFromTo = async (sender_id, receiver_id) => {
  return await supabase
    .from("messages")
    .select("*")
    .in("sender_id", [sender_id, receiver_id])
    .in("receiver_id", [sender_id, receiver_id])
    .order("created_at", { ascending: false }) // newest first
    .limit(20);
};

export const getMoreOlderMesssage = async (sender_id, receiver_id, startingDate, limit) => {
  console.log(`Starting date: ${startingDate}, limit: ${limit}, sender_id: ${sender_id}, receiver_id: ${receiver_id}`);
  
  return await supabase
    .from("messages")
    .select("*")
    .in("sender_id", [sender_id, receiver_id])
    .in("receiver_id", [sender_id, receiver_id])
    .lt("created_at", startingDate)
    .order("created_at", { ascending: false })
    .limit(limit);
}