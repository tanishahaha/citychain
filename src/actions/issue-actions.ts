"use server";
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { notifications } from '@/lib/db/schema';

export async function claimIssue(formData: FormData) {
  const issueId = formData.get('issueId') as string;
  const userId = formData.get('userId') as string;

  if (!issueId || !userId) {
    console.error('Missing issueId or userId:', { issueId, userId });
    return { success: false, error: 'Missing required fields' };
  }

  const supabase = createClient();

  // Update the issue status and fetch title
  const { data: issueData, error: updateError } = await supabase
    .from('tweet')
    .update({ status: 'under_consideration', authority: userId })
    .eq('id', issueId)
    .select('title')
    .single();

  if (updateError) {
    console.error('Supabase error claiming issue:', updateError.message);
    return { success: false, error: updateError.message || 'Failed to claim issue' };
  }

  // Fetch authority's full name
  const { data: profileData } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .single();

  const issueTitle = issueData?.title || 'Unnamed Issue';
  const authorityName = profileData?.full_name || 'Unknown Authority';

  // Insert notification
  await db.insert(notifications).values({
    tweet_id: issueId,
    message: `Issue "${issueTitle}" is under consideration by ${authorityName}`,
    user_id: null, // System-wide; set to a specific user_id if targeted
  });

  console.log('Issue claimed successfully:', issueData);
  revalidatePath('/');
  redirect('/');
}

export async function markAsSolved(formData: FormData) {
  const issueId = formData.get('issueId') as string;

  if (!issueId) {
    console.error('Missing issueId:', { issueId });
    return { success: false, error: 'Missing issueId' };
  }

  const supabase = createClient();

  // Update issue status and fetch title and authority
  const { data: issueData, error } = await supabase
    .from('tweet')
    .update({ status: 'solved' })
    .eq('id', issueId)
    .select('title, authority')
    .single();

  if (error) {
    console.error('Error marking issue as solved:', error);
    return { success: false, error };
  }

  const issueTitle = issueData?.title || 'Unnamed Issue';
  const authorityId = issueData?.authority;

  // Fetch authority's full name
  const { data: profileData } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', authorityId)
    .single();

  const authorityName = profileData?.full_name || 'Unknown Authority';

  // Insert notification
  await db.insert(notifications).values({
    tweet_id: issueId,
    message: `Issue "${issueTitle}" has been marked as solved by ${authorityName}`,
    user_id: null, // System-wide; adjust if targeting specific users
  });

  console.log('Issue marked as solved');
  revalidatePath('/');
  redirect('/');
}