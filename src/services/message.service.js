import supabase from "../config/db.js";


export const addMessage = async (message) => {
    return await supabase.from('messages').insert(message).select();
}