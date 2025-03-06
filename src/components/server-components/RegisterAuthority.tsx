import React from 'react';
import FormAuthority from '../client-components/FormAuthority';
import { getUserData } from '@/actions/get-user-data';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

const RegisterAuthority = () => {
    async function submitAuthority(formData: FormData) {
        'use server';

        const userData = await getUserData();
        const profileId = userData?.id;

        const organizationName = formData.get("organizationName") as string;
        const fullname = formData.get("fullname") as string;
        const designation = formData.get("designation") as string;
        const contact = formData.get("contact") as string;
        const officialEmail = formData.get("officialEmail") as string;
        const documentUrl = formData.get("documentUrl") as string;
        const latitude = formData.get("latitude") as string;
        const longitude = formData.get("longitude") as string;

        const supabase = createClient();

        const { data, error } = await supabase.from("authorities").insert({
            profile_id: profileId,
            fullname: fullname,
            organizationName: organizationName,
            designation: designation,
            latitude: latitude,
            longitude: longitude,
            official_email: officialEmail,
            document_url: documentUrl,
            contact,
        });

        if (error) {
            return { error: { message: error.message } };
        }

        revalidatePath('/');
        return { data };
    }

    return <FormAuthority serverAction={submitAuthority} />;
};

export default RegisterAuthority;