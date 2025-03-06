"use server"
import { createClient } from "@/utils/supabase/server";
import { User } from "../../types/app";

export const getAllUsers = async (): Promise<User[] | null> => {
    const supabase = createClient();
    const { data, error } = await supabase.from('profiles').select("*");
    if (error) return null;
    return data;
}