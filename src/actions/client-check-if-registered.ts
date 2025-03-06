import { createClient } from "@/utils/supabase/client";


export async function clientCheckIfRegistered(): Promise<boolean>{
    const supabase = createClient();

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user.id) {
        return false;
    }

    const { data, error } = await supabase.from("authorities").select('profile_id').eq('profile_id', userData.user.id).maybeSingle();

    return !!data;
}