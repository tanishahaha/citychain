"use server";

import { createClient } from "@/utils/supabase/server";
import { getUserData } from "./get-user-data";

export async function checkIfRegistered(): Promise<boolean>{
    const supabase = createClient();

    const userData = await getUserData();
    if (!userData || !userData.id) {
        return false;
    }

    const profileId = userData.id;

    const { data, error } = await supabase.from("authorities").select("profile_id").eq("profile_id", profileId).maybeSingle();

    if (error) {
        console.log(error);
        return false;
    }

    return !!data;

}
