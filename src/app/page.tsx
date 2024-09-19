import MainSection from '@/components/MainSection'
import React from 'react'
import SharedLayout from './sharedlayout'
import { createClient } from '@/utils/supabase/server'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { revalidateTag } from 'next/cache';

export const revalidate=0;

const page = async () => {

    

    return (

        <>
            
        <SharedLayout>
            <MainSection/>
        </SharedLayout>
        </>
    )
}

export default page
