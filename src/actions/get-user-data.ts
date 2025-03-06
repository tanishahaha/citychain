"use server"
import { createClient } from "@/utils/supabase/server";
import { User } from "../../types/app";

export const getUserData = async (): Promise<User | null> => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data, error } = await supabase.from('profiles').select("*").eq('id', user.id);

    if (error) {
        return null;
    }

    return data ? data[0] : null;
}