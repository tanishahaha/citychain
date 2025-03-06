"use server";

import { createClient } from "@/utils/supabase/server";
import { User } from "../../types/app";

export const getSpecificUser = async (id:string): Promise<User | null> => {
    const supabase = createClient();

    const { data, error } = await supabase.from('profiles').select("*").eq('id', id);

    if (error) {
        return null;
    }

    return data ? data[0] : null;
}