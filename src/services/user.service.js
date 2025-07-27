import supabase from "../config/db.js";

export const getUsers = async () => {
    return await supabase.from('users').select('*');
}

export const addUser = async (user) => {
    return await supabase.from('users').insert(user).select();
}

export const getUserByEmail = async (email) => {
    return await supabase.from('users').select('*').eq('email', email);
}