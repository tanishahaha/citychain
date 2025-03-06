import { getUserData } from '@/actions/get-user-data';
import MainSection from '@/components/MainSection'
import { redirect } from 'next/navigation';
import React from 'react'

export const revalidate = 0;

const page = async () => {
    const user = await getUserData();

    // If no user is logged in, redirect to /login
    if (!user) {
        redirect('/login');
    }

    return (
        <>

            <MainSection />

        </>
    )
}

export default page
