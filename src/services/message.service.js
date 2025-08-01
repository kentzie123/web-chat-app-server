import supabase from "../config/db.js";


export const addMessage = async (message) => {
    return await supabase.from('messages').insert([message]).select();
}

export const getMessagesFromTo = async (sender_id, receiver_id) => {
    return await supabase.from('messages').select('*').eq('sender_id', sender_id).eq('receiver_id', receiver_id);
}