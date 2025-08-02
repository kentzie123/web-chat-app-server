import supabase from "../config/db.js";

export const addMessage = async (message) => {
  return await supabase.from("messages").insert([message]).select();
};

export const getMessagesFromTo = async (sender_id, receiver_id) => {
  console.log("Sender id", sender_id);
  console.log("Receiver id", receiver_id);

  return await supabase
    .from("messages")
    .select("*")
    .in("sender_id", [sender_id, receiver_id])
    .in("receiver_id", [sender_id, receiver_id]);
};
